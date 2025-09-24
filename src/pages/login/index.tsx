// Login.tsx
import React, { useState } from "react";
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";

import { style } from "./styles";
import Logo from "../..//assets/logo.png";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import { Input } from "../../components/input";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/types";

// 🔹 Import Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Ajuste o caminho se precisar

type LoginScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Login"
>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

export default function Login({ navigation }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() { // 🔹 Nome da função ajustado para maior clareza
        try {
            setLoading(true);

            if (!email || !password) {
                setLoading(false);
                return Alert.alert("Atenção", "Informe o e-mail e a senha!");
            }

            // 🔹 Função do Firebase para login
            await signInWithEmailAndPassword(auth, email, password);

            Alert.alert("Sucesso", "Login realizado!");
            navigation.replace("Home");

        } catch (error: any) {
            console.log("Erro no login:", error.message);
            
            // 🔹 Tratamento de erros específicos do Firebase
            let errorMessage = "Ocorreu um erro ao fazer login.";
            if (error.code === 'auth/invalid-email') {
                errorMessage = "O e-mail informado é inválido.";
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "E-mail ou senha incorretos.";
            }
            
            Alert.alert("Erro", errorMessage);

        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={style.container}>
            <View style={style.boxTop}>
                <Image source={Logo} />
                <Text style={style.titulo}>Cuidando do seu melhor amigo</Text>
            </View>

            <View style={style.boxMid}>
                <Text style={style.entrar}>Entrar</Text>

                {/* Input de e-mail */}
                <Input
                    placeholder="E-mail"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    IconRight={MaterialIcons}
                    IconRightName="email"
                />

                {/* Input de senha */}
                <Input
                    placeholder="Senha"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    IconRight={Octicons}
                    IconRightName="eye-closed"
                />

                {/* Botão de entrar */}
                <TouchableOpacity style={style.button} onPress={handleLogin}>
                    {loading ? (
                        <ActivityIndicator
                            color={themes.colors.lightGray}
                            size={"small"}
                        />
                    ) : (
                        <Text style={style.textButton}>Entrar</Text>
                    )}
                </TouchableOpacity>

                {/* Link para cadastro */}
                <Text style={style.textCadastro}>
                    Não tem conta?{" "}
                    <Text
                        style={style.linkCadastro}
                        onPress={() => navigation.navigate("Cadastro")}
                    >
                        Criar uma conta
                    </Text>
                </Text>
            </View>
        </View>
    );
}