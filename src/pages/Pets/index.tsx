// pages/Pets/index.tsx (Substitua o conteúdo do seu arquivo inicial de listagem)

import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
    Image, 
    ActivityIndicator // Para loading
} from "react-native";
import { style } from "./styles"; // Ou o caminho correto para seus estilos
import { MaterialIcons } from "@expo/vector-icons";
import { themes } from "../../global/themes";

// 🔹 Importações do Firebase para leitura
import { db, auth } from '../../firebaseConfig';
import { collection, query, where, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';

// 🔹 Defina a interface do Pet para tipagem (opcional, mas recomendado)
interface Pet {
    id: string;
    name: string;
    breed: string;
    age: number;
    weight: number;
    photoURL: string;
}

// O componente deve receber `navigation` se estiver usando o React Navigation
export default function Pets({ navigation }: any) { 
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Função para navegar para a tela de cadastro
    const navigateToRegisterPet = () => {
        // Certifique-se que o nome da tela no seu Navigator é 'CadastrarPet'
        navigation.navigate('CadastrarPet'); 
    };
    
    // 🔹 Função para carregar os pets do Firebase
    const fetchPets = async () => {
        setLoading(true);
        const userId = auth.currentUser?.uid;

        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            // 1. Cria uma consulta (query) na coleção 'pets'
            // 2. Filtra pelos pets onde o userId é igual ao usuário logado
            const q = query(collection(db, 'cadastrarPet'), where('userId', '==', userId));
            
            // 3. Executa a consulta
            const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
            
            // 4. Mapeia os resultados para o estado 'pets'
            const petsList: Pet[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                petsList.push({
                    id: doc.id, // O ID do documento é crucial para ações futuras (editar/deletar)
                    name: data.name,
                    breed: data.breed,
                    age: data.age,
                    weight: data.weight,
                    photoURL: data.photoURL,
                });
            });

            setPets(petsList);
        } catch (error) {
            console.error("Erro ao carregar pets: ", error);
            // Alert.alert('Erro', 'Não foi possível carregar seus pets.');
        } finally {
            setLoading(false);
        }
    };
    
    // 🔹 Efeito para carregar os pets quando a tela é montada ou focada
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchPets(); // Recarrega a lista toda vez que a tela for focada (útil após cadastro)
        });

        return unsubscribe; // Limpeza do listener
    }, [navigation]); // Dependência da navegação


    return (
        <View style={{ flex: 1, backgroundColor: themes.colors.lightGray }}>
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
                
                <View style={style.headerWithButton}>
                    <Text style={style.sectionTitle}>Meus Pets</Text>
                    {/* 🔹 Botão de Cadastro */}
                    <TouchableOpacity style={style.addButton} onPress={navigateToRegisterPet}>
                        <MaterialIcons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                
                {/* 🔹 Exibição de Loading */}
                {loading && <ActivityIndicator size="large" color={themes.colors.secundary} style={{ marginTop: 20 }} />}
                
                {/* 🔹 Exibição da Lista de Pets */}
                {!loading && pets.length === 0 && (
                    <Text style={style.emptyStateText}>Você não tem pets cadastrados. Clique em "+" para adicionar um!</Text>
                )}

                {pets.map((pet) => (
                    <View key={pet.id} style={style.petCard}>
                        <View style={style.petLeft}>
                            {/* Ajuste o caminho da imagem se necessário, ou use a URL do Firebase */}
                            <Image
                                source={pet.photoURL ? { uri: pet.photoURL } : require("../../assets/alfred.png")}
                                style={style.petImage}
                            />
                            <View style={style.petInfo}>
                                <Text style={style.petName}>{pet.name}</Text>
                                <Text style={style.petRace}>{pet.breed}</Text>
                                <Text style={style.petRace}>{pet.age} anos • {pet.weight}Kg</Text>
                            </View>
                        </View>

                        <View style={style.actions}>
                            <TouchableOpacity style={[style.iconButton, { backgroundColor: themes.colors.bgScreen }]}>
                                <MaterialIcons name="edit" size={20} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity style={[style.iconButton, { backgroundColor: themes.colors.bgScreen }]}>
                                <MaterialIcons name="delete" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                
            </ScrollView>
        </View>
    );
}