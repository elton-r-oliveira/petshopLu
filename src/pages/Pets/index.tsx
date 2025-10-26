import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, FlatList, } from "react-native";
import { style } from "./styles";
import { MaterialIcons, Fontisto } from "@expo/vector-icons";
import { themes } from "../../global/themes";

import { db, auth } from "../../lib/firebaseConfig";
import { collection, query, where, getDocs, QuerySnapshot, DocumentData, doc, deleteDoc, } from "firebase/firestore";

// Import do utilitário
import { getPetImage } from "../../utils/petUtils";

// 🔹 Interface do Pet
interface Pet {
    id: string;
    name: string;
    breed: string;
    age: number;
    weight: number;
    animalType: string;
}

export default function Pets({ navigation }: any) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGrid, setIsGrid] = useState(false);

    // Navegar para o cadastro
    const navigateToRegisterPet = () => {
        navigation.navigate("CadastrarPet");
    };

    // Buscar pets do usuário logado
    const fetchPets = async () => {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const q = query(collection(db, "cadastrarPet"), where("userId", "==", userId));
            const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

            const petsList: Pet[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                petsList.push({
                    id: doc.id,
                    name: data.name || "",
                    breed: data.breed || "",
                    age: data.age || 0,
                    weight: data.weight || 0,
                    animalType: data.animalType || "dog",
                });
            });

            setPets(petsList);
        } catch (error) {
            console.error("Erro ao carregar pets: ", error);
        } finally {
            setLoading(false);
        }
    };

    // Excluir pet
    const handleDeletePet = async (petId: string, petName: string) => {
        Alert.alert(
            "Excluir Pet",
            `Tem certeza que deseja excluir ${petName}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "cadastrarPet", petId));
                            Alert.alert("Sucesso", `${petName} foi removido.`);
                            fetchPets();
                        } catch (error) {
                            console.error("Erro ao excluir pet:", error);
                            Alert.alert("Erro", "Não foi possível excluir o pet.");
                        }
                    },
                },
            ]
        );
    };

    // Editar pet
    const handleEditPet = (pet: Pet) => {
        navigation.navigate("CadastrarPet", { pet });
    };

    // Atualiza ao focar
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchPets();
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={style.container}>
            <View style={style.headerWithButton}>
                <Text style={style.sectionTitle}>Meus Pets</Text>

                {/* Alternância entre lista e grade */}
                <View
                    style={{
                        flexDirection: "row",
                        backgroundColor: themes.telaPets.fundoCard,
                        borderRadius: 45,
                        overflow: "hidden",
                        alignSelf: "flex-start",
                        marginTop: 45,
                        marginLeft: 80
                    }}
                >
                    {/* Ícone de lista */}
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            backgroundColor: !isGrid ? themes.telaPets.switchButtom : "transparent",
                            alignItems: "center",
                            justifyContent: "center",
                            borderTopLeftRadius: 12,
                            borderBottomLeftRadius: 12,
                        }}
                        onPress={() => setIsGrid(false)}
                    >
                        <MaterialIcons
                            name="view-list"
                            size={22}
                            color={!isGrid ? "#fff" : themes.telaPets.switchButtom}
                        />
                    </TouchableOpacity>

                    {/* Ícone de grade */}
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            backgroundColor: isGrid ? themes.colors.secundary : "transparent",
                            alignItems: "center",
                            justifyContent: "center",
                            borderTopRightRadius: 12,
                            borderBottomRightRadius: 12,
                        }}
                        onPress={() => setIsGrid(true)}
                    >
                        <Fontisto
                            name="nav-icon-grid"
                            size={15}
                            color={isGrid ? "#fff" : themes.telaPets.switchButtom}
                        />
                    </TouchableOpacity>
                </View>

                <View>
                    {/* Botão adicionar */}
                    <TouchableOpacity style={style.addButton} onPress={navigateToRegisterPet}>
                        <MaterialIcons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={themes.colors.secundary}
                    style={{ marginTop: 20 }}
                />
            ) : pets.length === 0 ? (
                <Text style={style.emptyStateText}>
                    Você não tem pets cadastrados. Clique em "+" para adicionar um!
                </Text>

            ) : isGrid ? (
                //  Visualização em Grade
                <FlatList
                    data={pets}
                    key={"grid"}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        padding: 10,
                    }}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flex: 1,
                                margin: 8,
                                backgroundColor: themes.colors.lightGray,
                                borderRadius: 12,
                                alignItems: "center",
                                padding: 15,
                                elevation: 3,
                            }}
                        >
                            <Image
                                source={getPetImage(item.animalType)}
                                style={{ width: 80, height: 80, marginBottom: 10 }}
                            />
                            <Text style={style.petName}>{item.name}</Text>
                            <Text style={style.petRace}>{item.breed}</Text>
                            <Text style={style.petRace}>
                                {item.age} anos • {item.weight}Kg
                            </Text>

                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginTop: 10,
                                    gap: 8,
                                }}
                            >
                                <TouchableOpacity style={style.iconButton} onPress={() => handleEditPet(item)}>
                                    <MaterialIcons name="edit" size={20} style={style.icon} />
                                </TouchableOpacity>

                                <TouchableOpacity style={[style.iconButton, { backgroundColor: themes.telaPets.deleteButtom }]} onPress={() => handleDeletePet(item.id, item.name)}>
                                    <MaterialIcons name="delete" size={20} style={{ color: themes.telaPets.fundo }} />
                                </TouchableOpacity>

                            </View>
                        </View>
                    )}
                />
            ) : (
                //  Visualização em Lista
                <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
                    {pets.map((pet) => (
                        <View key={pet.id} style={style.petCard}>
                            <View style={style.petLeft}>
                                <Image
                                    source={getPetImage(pet.animalType)} 
                                    style={style.petImage}
                                />
                                <View style={style.petInfo}>
                                    <Text style={style.petName}>{pet.name}</Text>
                                    <Text style={style.petRace}>{pet.breed}</Text>
                                    <Text style={style.petRace}>
                                        {pet.age} anos • {pet.weight}Kg
                                    </Text>
                                </View>
                            </View>

                            <View style={style.actions}>

                                <TouchableOpacity style={style.iconButton} onPress={() => handleEditPet(pet)}>
                                    <MaterialIcons name="edit" size={20} style={style.icon} />
                                </TouchableOpacity>

                                <TouchableOpacity style={[style.iconButton, { backgroundColor: themes.telaPets.deleteButtom }]} onPress={() => handleDeletePet(pet.id, pet.name)}>
                                    <MaterialIcons name="delete" size={20} style={{ color: themes.telaPets.fundo }} />
                                </TouchableOpacity>

                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}