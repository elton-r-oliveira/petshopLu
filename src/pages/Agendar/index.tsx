// pages/Agendar/index.tsx

import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput
} from "react-native";
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

                <View style={style.quickActions}>
                    {/* Campo de Serviço */}
                    <TextInput
                        style={style.input}
                        placeholder="Tipo de Serviço (Banho, Tosa, etc.)"
                        value={servico}
                        onChangeText={setServico}
                    />
                    
                    {/* Campo de Data */}
                    <TextInput
                        style={style.input}
                        placeholder="Data (Ex: 24/09/2025)"
                        value={data}
                        onChangeText={setData}
                    />

                    {/* Campo de Horário */}
                    <TextInput
                        style={style.input}
                        placeholder="Horário (Ex: 14:00)"
                        value={horario}
                        onChangeText={setHorario}
                    />
                    
                    {/* Botão de Agendar */}
                    <TouchableOpacity style={style.button} onPress={handleAgendar}>
                        <Text style={style.buttonText}>Agendar</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}