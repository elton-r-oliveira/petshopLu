// pages/CadastrarPet/index.tsx

import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    Image, // Se for usar a lógica de imagem
    ActivityIndicator
} from "react-native";
import { style } from "../Agendar/styles"; // Reutilizando os estilos que você já tem
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import * as ImagePicker from 'expo-image-picker';

// 🔹 Importações do Firebase
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// 🔹 Importação do Firebase Storage
import { storage } from '../../firebaseConfig'; // Certifique-se que o storage foi exportado em firebaseConfig
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';

export default function CadastrarPet() {
    // 🔹 Estados para o formulário do Pet
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // 🔹 1. Função para selecionar a imagem
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhotoUrl(result.assets[0].uri);
        }
    };
    const testRef = ref(storage, `pets/${auth.currentUser?.uid}/`);
    listAll(testRef)
        .then(() => console.log("✅ Conseguiu listar — Storage OK"))
        .catch((err) => console.error("❌ Sem permissão:", err));
    // 🔹 2. Função para fazer o upload para o Firebase Storage (CORRIGIDA)
    const uploadImage = async (uri: string, petName: string): Promise<string> => {
        setIsUploading(true);
        const userId = auth.currentUser?.uid;

        // Uso de XMLHttpRequest para criar o Blob de forma compatível
        const blob = await new Promise<Blob>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.error("XHR Network Request Failed:", e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        // Cria a referência no Storage: pets/USER_ID/PET_NAME_TIMESTAMP.jpg
        const storageRef = ref(storage, `cadastrarPet/${userId}/${petName}_${Date.now()}.jpg`);

        try {
            // Faz o upload do blob
            const snapshot = await uploadBytes(storageRef, blob);

            // Pega a URL pública
            const downloadURL = await getDownloadURL(snapshot.ref);
            setIsUploading(false);

            // 🚀 CORREÇÃO DO ERRO 'close'
            // Chama 'close' se o método existir no objeto, satisfazendo a segurança do TS.
            if ((blob as any).close) {
                (blob as any).close();
            }

            return downloadURL;

        } catch (error: any) {
            console.error("Erro no upload da foto (Storage API):", JSON.stringify(error, null, 2));
            Alert.alert("Erro no upload", error.message || "Erro desconhecido");
            setIsUploading(false);
            throw error;
        }
    };

    // 🔹 Função para lidar com o cadastro (handleRegisterPet)
    const handleRegisterPet = async () => {
        // ... (Validação básica - MANTIDA)
        if (!name || !breed || !age || !weight) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const userId = auth.currentUser?.uid;
        if (!userId) {
            Alert.alert('Erro', 'Você precisa estar logado para cadastrar um pet.');
            return;
        }

        let finalPhotoURL = '';

        // 🔹 NOVO: Se tiver foto selecionada, faz o upload primeiro
        if (photoUrl) {
            try {
                finalPhotoURL = await uploadImage(photoUrl, name);
            } catch (e) {
                // O erro já foi reportado no uploadImage
                return;
            }
        }

        const petData = {
            userId: userId,
            name: name,
            breed: breed,
            age: parseInt(age),
            weight: parseFloat(weight.replace(',', '.')),
            photoURL: finalPhotoURL, // 🔹 ALTERADO: Usa a URL retornada do Storage
            createdAt: serverTimestamp(),
        };

        try {
            // 🔹 ALTERADO: Usando a coleção do Firebase que você criou
            await addDoc(collection(db, 'cadastrarPet'), petData);

            Alert.alert('Sucesso', `${name} foi cadastrado com sucesso!`);

            // Limpa o formulário e a foto
            setName('');
            setBreed('');
            setAge('');
            setWeight('');
            setPhotoUrl(''); // Limpa a URI local

        } catch (error) {
            // ... (log de erro - MANTIDO)
            Alert.alert('Erro', 'Não foi possível cadastrar o pet. Tente novamente.');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: themes.colors.lightGray }}>
            <ScrollView style={style.containerScroll} showsVerticalScrollIndicator={false}>

                <Text style={style.sectionTitle}>Cadastrar Novo Pet</Text>
                <Text style={style.sectionSubtitle}>Adicione as informações do seu companheiro para agendar serviços.</Text>

                <View style={style.formContainer}>
                    {/* 🔹 NOVO BLOCO: Seleção de Foto */}
                    <View style={style.inputGroup}>
                        <Text style={style.inputLabel}>Foto do Pet (Opcional)</Text>
                        <TouchableOpacity style={style.photoPickerButton} onPress={pickImage} disabled={isUploading}>
                            {photoUrl ? (
                                <Image source={{ uri: photoUrl }} style={style.petPhotoPreview} />
                            ) : (
                                <MaterialIcons name="photo-camera" size={30} color="#888" />
                            )}
                            <Text style={style.photoPickerText}>
                                {photoUrl ? 'Trocar Foto' : 'Selecionar Foto'}
                            </Text>
                        </TouchableOpacity>
                        {isUploading && <ActivityIndicator size="small" color={themes.colors.secundary} style={{ marginTop: 10 }} />}
                    </View>
                    {/* Campo Nome */}
                    <View style={style.inputGroup}>
                        <Text style={style.inputLabel}>Nome do Pet</Text>
                        <TextInput
                            style={style.selectInput} // Reutilizando o estilo visual de input
                            placeholder="Ex: Rex"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* Campo Raça */}
                    <View style={style.inputGroup}>
                        <Text style={style.inputLabel}>Raça</Text>
                        <TextInput
                            style={style.selectInput}
                            placeholder="Ex: Labrador, Vira-Lata"
                            value={breed}
                            onChangeText={setBreed}
                        />
                    </View>

                    {/* Idade e Peso (Lado a Lado) */}
                    <View style={style.dateTimeContainer}>
                        {/* Idade */}
                        <View style={[style.inputGroup, style.halfInput]}>
                            <Text style={style.inputLabel}>Idade (anos)</Text>
                            <TextInput
                                style={style.selectInput}
                                placeholder="Ex: 5"
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric" // Apenas números
                            />
                        </View>

                        {/* Peso */}
                        <View style={[style.inputGroup, style.halfInput]}>
                            <Text style={style.inputLabel}>Peso (Kg)</Text>
                            <TextInput
                                style={style.selectInput}
                                placeholder="Ex: 15.5"
                                value={weight}
                                onChangeText={setWeight}
                                keyboardType="numeric" // Apenas números
                            />
                        </View>
                    </View>

                    {/* Campo Foto (Opcional, se você implementar o upload) */}
                    <View style={style.inputGroup}>
                        <Text style={style.inputLabel}>URL da Foto (Opcional)</Text>
                        <TextInput
                            style={style.selectInput}
                            placeholder="https://exemplo.com/foto.jpg"
                            value={photoUrl}
                            onChangeText={setPhotoUrl}
                        />
                    </View>

                    {/* Botão de Cadastro */}
                    <TouchableOpacity style={style.button} onPress={handleRegisterPet}>
                        <Text style={style.buttonText}>Cadastrar Pet</Text>
                        <MaterialIcons name="pets" size={24} color="#fff" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
}