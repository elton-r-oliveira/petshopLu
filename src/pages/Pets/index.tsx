// pages/Pets/index.tsx

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    Alert,
} from "react-native";
import { style } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { themes } from "../../global/themes";

// 🔹 Firebase
import { db, auth, } from "../../firebaseConfig";
import {
    collection,
    query,
    where,
    getDocs,
    QuerySnapshot,
    DocumentData,
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";

// 🔹 Interface do Pet
interface Pet {
    id: string;
    name: string;
    breed: string;
    age: number;
    weight: number;
    animalType: string; // tipo do animal (ex: "dog", "cat", "hamster", "turtle")
}

// 🔹 Componente principal
export default function Pets({ navigation }: any) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    // Função de navegação
    const navigateToRegisterPet = () => {
        navigation.navigate("CadastrarPet");
    };

    // Função que busca os pets cadastrados do usuário logado
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
                    animalType: data.animalType || "dog", // padrão caso não tenha o campo
                });
            });

            setPets(petsList);
        } catch (error) {
            console.error("Erro ao carregar pets: ", error);
        } finally {
            setLoading(false);
        }
    };
    // 🔹 Excluir Pet
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
                            fetchPets(); // atualiza a lista
                        } catch (error) {
                            console.error("Erro ao excluir pet:", error);
                            Alert.alert("Erro", "Não foi possível excluir o pet.");
                        }
                    },
                },
            ]
        );
    };

    const handleEditPet = (pet: Pet) => {
        navigation.navigate("CadastrarPet", { pet }); // envia o pet como parâmetro
    };

    // Atualiza a lista sempre que a tela for focada
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchPets();
        });
        return unsubscribe;
    }, [navigation]);

    // 🔹 Função auxiliar: retorna a imagem correta com base no tipo de animal
    const getPetImage = (type: string) => {
        switch (type.toLowerCase()) {
            case "dog":
                return require("../../assets/pets/dog.png");
            case "cat":
                return require("../../assets/pets/cat.png");
            case "hamster":
                return require("../../assets/pets/hamster.png");
            case "turtle":
                return require("../../assets/pets/turtle.png");
            case "bird":
                return require("../../assets/pets/bird.png");
            case "rabbit":
                return require("../../assets/pets/rabbit.png");
            default:
                return require("../../assets/pets/pet.png");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: themes.colors.lightGray }}>
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
                {/* Cabeçalho com botão de adicionar */}
                <View style={style.headerWithButton}>
                    <Text style={style.sectionTitle}>Meus Pets</Text>
                    <TouchableOpacity style={style.addButton} onPress={navigateToRegisterPet}>
                        <MaterialIcons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Estado de carregamento */}
                {loading && (
                    <ActivityIndicator
                        size="large"
                        color={themes.colors.secundary}
                        style={{ marginTop: 20 }}
                    />
                )}

                {/* Caso não existam pets */}
                {!loading && pets.length === 0 && (
                    <Text style={style.emptyStateText}>
                        Você não tem pets cadastrados. Clique em "+" para adicionar um!
                    </Text>
                )}

                {/* Lista de Pets */}
                {pets.map((pet) => (
                    <View key={pet.id} style={style.petCard}>
                        <View style={style.petLeft}>
                            <Image source={getPetImage(pet.animalType)} style={style.petImage} />
                            <View style={style.petInfo}>
                                <Text style={style.petName}>{pet.name}</Text>
                                <Text style={style.petRace}>{pet.breed}</Text>
                                <Text style={style.petRace}>
                                    {pet.age} anos • {pet.weight}Kg
                                </Text>
                            </View>
                        </View>

                        <View style={style.actions}>
                            <TouchableOpacity
                                style={[style.iconButton, { backgroundColor: themes.colors.bgScreen }]}
                                onPress={() => handleEditPet(pet)}
                            >
                                <MaterialIcons name="edit" size={20} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[style.iconButton, { backgroundColor: "#c62828" }]}
                                onPress={() => handleDeletePet(pet.id, pet.name)}
                            >
                                <MaterialIcons name="delete" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
