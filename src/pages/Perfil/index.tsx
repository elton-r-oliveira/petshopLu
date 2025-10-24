import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, } from "react-native";
import { style } from "./styles";
import { themes } from "../../global/themes";
import TopBar from "../../components/topBar";
import { signOut, onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { auth, db } from "../../lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigation, CommonActions, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../@types/types";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

type PerfilScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Perfil">;

export default function Perfil() {
    const navigation = useNavigation<PerfilScreenNavigationProp>();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [logoutInProgress, setLogoutInProgress] = useState(false);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");

    const [originalData, setOriginalData] = useState({
        nome: "",
        telefone: "",
        endereco: "",
    });
    const originalDataRef = useRef(originalData);

    useEffect(() => {
        originalDataRef.current = originalData;
    }, [originalData]);

    const [topBarNome, setTopBarNome] = useState("");
    const [topBarEndereco, setTopBarEndereco] = useState("");

    const editingRef = useRef(editing);
    const logoutInProgressRef = useRef(logoutInProgress);
    const isDirtyRef = useRef(false);
    const alertShownRef = useRef(false);

    useEffect(() => {
        editingRef.current = editing;
    }, [editing]);

    useEffect(() => {
        logoutInProgressRef.current = logoutInProgress;
    }, [logoutInProgress]);

    const checkIsDirty = () => {
        const dirty = nome !== originalData.nome ||
            telefone !== originalData.telefone ||
            endereco !== originalData.endereco;

        isDirtyRef.current = dirty;
        return dirty;
    };

    useEffect(() => {
        checkIsDirty();
    }, [nome, telefone, endereco, originalData]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                setNome(user.displayName || "");
                setEmail(user.email || "");
                await carregarDadosExtras(user.uid, user.displayName || "");
            } else {
                navigation.replace("Login");
            }
            setLoading(false);
        });

        return unsubscribeAuth;
    }, []);

    const resetarCamposParaOriginais = () => {
        const orig = originalDataRef.current;
        setNome(orig.nome ?? "");
        setTelefone(orig.telefone ?? "");
        setEndereco(orig.endereco ?? "");
        setEditing(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            alertShownRef.current = false;

            let active = true;
            (async () => {
                if (!editingRef.current && currentUser && active) {
                    await carregarDadosExtras(currentUser.uid, currentUser.displayName || "");
                }
            })();

            return () => {
                active = false;
                if (editingRef.current && isDirtyRef.current && !logoutInProgressRef.current && !alertShownRef.current) {
                    alertShownRef.current = true;

                    Alert.alert(
                        "Alterações não salvas",
                        "Suas alterações não foram salvas e serão descartadas.",
                        [
                            {
                                text: "Continuar editando",
                                style: "cancel",
                                onPress: () => {
                                    navigation.navigate("Perfil");
                                    alertShownRef.current = false;
                                }
                            },
                            {
                                text: "Descartar e sair",
                                style: "destructive",
                                onPress: () => {
                                    resetarCamposParaOriginais();
                                    alertShownRef.current = false;
                                }
                            }
                        ]
                    );
                }
            };
        }, [navigation, currentUser])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", (e) => {
            if (editingRef.current && isDirtyRef.current && !logoutInProgressRef.current && !alertShownRef.current) {
                e.preventDefault();
                alertShownRef.current = true;

                Alert.alert(
                    "Alterações não salvas",
                    "Suas alterações não foram salvas e serão descartadas.",
                    [
                        {
                            text: "Continuar editando",
                            style: "cancel",
                            onPress: () => {
                                alertShownRef.current = false;
                            },
                        },
                        {
                            text: "Descartar e sair",
                            style: "destructive",
                            onPress: () => {
                                resetarCamposParaOriginais();
                                navigation.dispatch(e.data.action);
                                alertShownRef.current = false;
                            },
                        },
                    ]
                );
            }
        });

        return unsubscribe;
    }, [navigation]);

    async function carregarDadosExtras(uid: string, displayName: string) {
        try {
            const docRef = doc(db, "usuarios", uid);
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
                const data = snapshot.data();
                const nomeFirestore = data.nome || "";
                const telefoneFirestore = data.telefone || "";
                const enderecoFirestore = data.endereco || "";

                setNome(nomeFirestore || displayName || "");
                setTelefone(telefoneFirestore);
                setEndereco(enderecoFirestore);

                setTopBarNome(nomeFirestore || displayName || "");
                setTopBarEndereco(enderecoFirestore);

                setOriginalData({
                    nome: nomeFirestore || displayName || "",
                    telefone: telefoneFirestore,
                    endereco: enderecoFirestore,
                });
            } else {
                setNome(displayName || "");
                setTelefone("");
                setEndereco("");
                setTopBarNome(displayName || "");
                setTopBarEndereco("");
                setOriginalData({
                    nome: displayName || "",
                    telefone: "",
                    endereco: "",
                });
            }
        } catch (error) {
            console.error("Erro ao carregar dados extras:", error);
        }
    }

    function handleEditPress() {
        console.log('Iniciando edição...');
        setEditing(true);
    }

    async function salvarAlteracoes() {
        if (!currentUser) return;

        try {
            setLoading(true);

            await updateProfile(currentUser, { displayName: nome });

            const docRef = doc(db, "usuarios", currentUser.uid);
            await setDoc(
                docRef,
                { nome, email, telefone, endereco },
                { merge: true }
            );

            setTopBarNome(nome);
            setTopBarEndereco(endereco);

            setOriginalData({
                nome: nome,
                telefone: telefone,
                endereco: endereco
            });

            Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
            setEditing(false);
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            Alert.alert("Erro", "Não foi possível salvar as alterações.");
        } finally {
            setLoading(false);
        }
    }

    function cancelarEdicao() {
        console.log('Cancelando edição...');
        resetarCamposParaOriginais();
    }

    async function handleLogout() {
        if (editing && checkIsDirty()) {
            Alert.alert(
                "Alterações não salvas",
                "Você tem alterações não salvas. Deseja salvar antes de sair?",
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Sair mesmo assim",
                        style: "destructive",
                        onPress: () => {
                            resetarCamposParaOriginais();
                            alertShownRef.current = false;
                            confirmarLogout();
                        }
                    },
                    {
                        text: "Salvar e sair",
                        onPress: async () => {
                            await salvarAlteracoes();
                            confirmarLogout();
                        }
                    }
                ]
            );
        } else {
            confirmarLogout();
        }
    }

    function confirmarLogout() {
        Alert.alert(
            "Confirmar Logout",
            "Tem certeza que deseja sair da conta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: executarLogout,
                },
            ]
        );
    }

    async function executarLogout() {
        setLogoutInProgress(true);
        try {
            await signOut(auth);
            navigation.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
            );
        } catch (error) {
            Alert.alert("Erro", "Falha ao sair da conta.");
        } finally {
            setLogoutInProgress(false);
        }
    }

    if (loading) {
        return (
            <View style={[style.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={themes.colors.corTexto} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
                <TopBar
                    userName={topBarNome || "Usuário"}
                    location={topBarEndereco || "Endereço não informado"}
                />

                <Text style={style.sectionTitle}>Informações do Perfil</Text>

                <View style={{ margin: 20 }}>
                    <View style={style.inputGroup}>
                        <Text style={style.inputLabel}>Nome</Text>
                        <View style={style.selectInput}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color={themes.colors.secundary}
                                style={style.inputIcon}
                            />
                            <TextInput
                                style={style.selectInputText}
                                value={nome}
                                onChangeText={setNome}
                                placeholder="Seu nome completo"
                                placeholderTextColor="#888"
                                editable={editing}
                            />
                        </View>
                    </View>

                    <View style={style.inputGroup}>
                        <Text style={style.inputLabel}>E-mail</Text>
                        <View style={style.selectInput}>
                            <MaterialIcons
                                name="email"
                                size={20}
                                color={themes.colors.secundary}
                                style={style.inputIcon}
                            />
                            <TextInput
                                style={[style.selectInputText, { color: "#888" }]}
                                value={email}
                                editable={false}
                            />
                        </View>
                    </View>

                    <View style={style.inputGroup}>
                        <Text style={style.inputLabel}>Telefone</Text>
                        <View style={style.selectInput}>
                            <Ionicons
                                name="call-outline"
                                size={20}
                                color={themes.colors.secundary}
                                style={style.inputIcon}
                            />
                            <TextInput
                                style={style.selectInputText}
                                value={telefone}
                                onChangeText={setTelefone}
                                placeholder="(11) 99999-9999"
                                placeholderTextColor="#888"
                                keyboardType="phone-pad"
                                editable={editing}
                            />
                        </View>
                    </View>

                    <View style={style.inputGroup}>
                        <Text style={style.inputLabel}>Endereço</Text>
                        <View style={style.selectInput}>
                            <Ionicons
                                name="location-outline"
                                size={20}
                                color={themes.colors.secundary}
                                style={style.inputIcon}
                            />
                            <TextInput
                                style={style.selectInputText}
                                value={endereco}
                                onChangeText={setEndereco}
                                placeholder="Rua, número, bairro..."
                                placeholderTextColor="#888"
                                editable={editing}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: 5, gap: 10, margin: 20 }}>
                    {editing ? (
                        <>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                                <TouchableOpacity
                                    style={[style.buttonSave, { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]}
                                    onPress={salvarAlteracoes}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <>
                                            <MaterialIcons name="save" size={20} color="#FFF" />
                                            <Text style={style.textButton}>Salvar</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        style.buttonEdit,
                                        { flex: 1, backgroundColor: themes.colors.bgScreen, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
                                    ]}
                                    onPress={cancelarEdicao}
                                >
                                    <MaterialIcons name="cancel" size={20} color="#FFF" />
                                    <Text style={style.textButton}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[style.buttonLogout, { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]}
                                onPress={handleLogout}
                                disabled={logoutInProgress}
                            >
                                {logoutInProgress ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <>
                                        <MaterialIcons name="logout" size={20} color="#FFF" />
                                        <Text style={style.textButton}>Logout</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={[style.buttonEdit, { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]}
                                onPress={handleEditPress}
                            >
                                <MaterialIcons name="edit" size={20} color="#FFF" />
                                <Text style={style.textButton}>Editar Perfil</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[style.buttonLogout, { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]}
                                onPress={handleLogout}
                                disabled={logoutInProgress}
                            >
                                {logoutInProgress ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <>
                                        <MaterialIcons name="logout" size={20} color="#FFF" />
                                        <Text style={style.textButton}>Logout</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}