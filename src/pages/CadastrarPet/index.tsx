import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    Image
} from "react-native";
import { style } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import { db, auth } from '../../lib/firebaseConfig';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

// Lista de tipos de animais com imagens
const animalTypes = [
    { label: "Cão", value: "dog", image: require("../../assets/pets/dog.png") },
    { label: "Gato", value: "cat", image: require("../../assets/pets/cat.png") },
    { label: "Roedores", value: "Roedores", image: require("../../assets/pets/hamster.png") },
    // { label: "Coelho", value: "rabbit", image: require("../../assets/pets/rabbit.png") },
    // { label: "Reptéis", value: "turtle", image: require("../../assets/pets/turtle.png") },
    { label: "Pássaro", value: "bird", image: require("../../assets/pets/bird.png") },
];

export default function CadastrarPet({ route, navigation }: any) {
    const existingPet = route?.params?.pet; // Pet recebido para edição
    const [isEditing, setIsEditing] = useState(!!existingPet);

    const [name, setName] = useState(existingPet?.name || '');
    const [breed, setBreed] = useState(existingPet?.breed || '');
    const [age, setAge] = useState(existingPet?.age?.toString() || '');
    const [weight, setWeight] = useState(existingPet?.weight?.toString() || '');
    const [animalType, setAnimalType] = useState(existingPet?.animalType || 'dog');

    const handleRegisterPet = async () => {
        if (!name || !breed || !age || !weight) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const userId = auth.currentUser?.uid;
        if (!userId) {
            Alert.alert('Erro', 'Você precisa estar logado para cadastrar um pet.');
            return;
        }

        const petData = {
            userId,
            name,
            breed,
            age: parseInt(age),
            weight: parseFloat(weight.replace(',', '.')),
            animalType,
            createdAt: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, 'cadastrarPet'), petData);
            Alert.alert('Sucesso', `${name} foi cadastrado com sucesso!`);

            setName('');
            setBreed('');
            setAge('');
            setWeight('');
            setAnimalType('dog');

        } catch (error) {
            console.error("Erro ao cadastrar pet:", error);
            Alert.alert('Erro', 'Não foi possível cadastrar o pet.');
        }
    };

    const handleUpdatePet = async () => {
        if (!existingPet) return;

        try {
            const petRef = doc(db, "cadastrarPet", existingPet.id);
            await updateDoc(petRef, {
                name,
                breed,
                age: parseInt(age),
                weight: parseFloat(weight.replace(',', '.')),
                animalType,
            });

            Alert.alert("Sucesso", `${name} foi atualizado com sucesso!`);
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao atualizar pet:", error);
            Alert.alert("Erro", "Não foi possível atualizar o pet.");
        }
    };

    return (
        <View style={style.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={style.sectionTitle}>Cadastrar Pet</Text>
                {/* <Text style={style.sectionSubtitle}>Adicione as informações do seu companheiro.</Text> */}

                <View style={style.formContainer}>

                    {/* Tipo do Animal com carrossel horizontal */}
                    <View style={style.inputGroup}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 10,
                                gap: 20,
                            }}
                        >
                            {animalTypes.map((item) => (
                                <TouchableOpacity
                                    key={item.value}
                                    onPress={() => setAnimalType(item.value)}
                                    activeOpacity={0.8}
                                    style={{
                                        alignItems: "center",
                                        opacity: animalType === item.value ? 1 : 0.6,

                                    }}
                                >
                                    <View
                                        style={{
                                            width: 90,
                                            height: 90,
                                            borderRadius: 45,
                                            backgroundColor:
                                                animalType === item.value
                                                    ? themes.colors.secundary
                                                    : "#ddd",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginBottom: 8,
                                            borderWidth: 2,
                                            borderColor:
                                                animalType === item.value
                                                    ? themes.colors.corTexto
                                                    : "transparent",
                                            shadowColor: "#000",
                                            shadowOpacity: 0.15,
                                            shadowRadius: 4,
                                            elevation: 3,

                                        }}
                                    >
                                        <Image
                                            source={item.image}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                resizeMode: "contain",
                                                borderRadius: 50

                                            }}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            color: animalType === item.value ? themes.telaPets.petName : themes.telaPets.petName,
                                            fontFamily: 'Baloo2_700Bold',
                                        }}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Nome */}
                    <View style={style.inputGroup}>
                        <Text style={style.inputLabel}>Nome do Pet</Text>
                        <TextInput
                            style={style.selectInput}
                            placeholder="Ex: Totó"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* Raça */}
                    <View style={style.inputGroup}>
                        <Text style={style.inputLabel}>Raça</Text>
                        <TextInput
                            style={style.selectInput}
                            placeholder="Ex: Labrador, Vira-Lata"
                            value={breed}
                            onChangeText={setBreed}
                        />
                    </View>

                    {/* Idade e Peso */}
                    <View style={style.dateTimeContainer}>
                        <View style={[style.inputGroup, style.halfInput]}>
                            <Text style={style.inputLabel}>Idade (anos)</Text>
                            <TextInput
                                style={style.selectInput}
                                placeholder="Ex: 5"
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={[style.inputGroup, style.halfInput]}>
                            <Text style={style.inputLabel}>Peso (Kg)</Text>
                            <TextInput
                                style={style.selectInput}
                                placeholder="Ex: 15.5"
                                value={weight}
                                onChangeText={setWeight}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Botão */}
                    <TouchableOpacity
                        style={style.button}
                        onPress={isEditing ? handleUpdatePet : handleRegisterPet}
                    >
                        <Text style={style.buttonText}>
                            {isEditing ? "Salvar Alterações" : "Cadastrar Pet"}
                        </Text>
                        <MaterialIcons
                            name={isEditing ? "save" : "pets"}
                            size={24}
                            color="#fff"
                            style={{ marginLeft: 10 }}
                        />
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
}
