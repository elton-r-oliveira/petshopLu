// pages/Agendar/index.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Image } from "react-native";

import { style } from "./styles";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import TopBar from "../../components/topBar";

// 🔹 Importações do Firebase
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Agendar() {
    const [servico, setServico] = useState('');
    const [data, setData] = useState('');
    const [horario, setHorario] = useState('');

    // 🔹 Função para agendar
    const handleAgendar = async () => {
        // 🔹 Validação dos campos
        if (!servico || !data || !horario) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }

        const userId = auth.currentUser?.uid;
        if (!userId) {
            Alert.alert('Erro', 'Você precisa estar logado para agendar.');
            return;
        }

        try {
            // 🔹 Adiciona o documento na coleção 'agendamentos'
            await addDoc(collection(db, 'agendamentos'), {
                userId: userId,
                service: servico,
                date: data, // Por enquanto usamos string, mas o ideal é usar um DatePicker
                time: horario,
                status: 'Pendente',
                agendadoEm: serverTimestamp()
            });

            Alert.alert('Sucesso', 'Seu agendamento foi realizado!');
            // Limpa os campos após o agendamento
            setServico('');
            setData('');
            setHorario('');

        } catch (error) {
            console.error("Erro ao agendar: ", error);
            Alert.alert('Erro', 'Não foi possível agendar o serviço. Tente novamente.');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>

                <TopBar onLogoPress={() => console.log("Logo clicada")} />

                <Text style={style.sectionTitle}>Agendar Serviço</Text>

                <View style={style.petCard}>
                    <Image
                        source={require("../../assets/logo.png")}
                        style={style.petImage}
                    />
                    <View style={style.petInfo}>
                        <Text style={style.petName}>Banho e Tosa - Alfred</Text>
                        <Text style={style.petRace}>Agendado para 20/09 às 14:00</Text>
                    </View>

                    <View style={style.actions}>
                        <TouchableOpacity style={[style.iconButton, { backgroundColor: themes.colors.bgScreen }]}>
                            <MaterialIcons name="edit" size={20} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={[style.iconButton, { backgroundColor: "red" }]}>
                            <MaterialIcons name="delete" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}