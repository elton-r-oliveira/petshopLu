// pages/Agendar/index.tsx

import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform, // Importado para lidar com o DatePicker
} from "react-native";
// Removendo TextInput não usado para Data/Hora/Serviço
import { style } from "./styles";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import TopBar from "../../components/topBar";

// 🔹 Importações do Firebase
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// 🔹 Componentes de seleção de data/hora (Assumindo que você instalou)
import DateTimePicker from '@react-native-community/datetimepicker';

// 🔹 Lista de serviços fixos
const SERVICOS = [
    'Banho e Tosa',
    'Somente Tosa',
    'Corte de Unha',
    'Hidratação',
    'Consulta Veterinária',
];

// 🔹 Funções auxiliares para formatação
const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
};

const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export default function Agendar() {
    // 🔹 Alteração: Servico agora é selecionado de uma lista
    const [servico, setServico] = useState('');

    // 🔹 Alteração: Data e Horário agora serão um objeto Date
    const [dataAgendamento, setDataAgendamento] = useState(new Date());

    // 🔹 Estados para controlar a visibilidade dos seletores (DatePicker)
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showServiceList, setShowServiceList] = useState(false);

    const handleSelectService = (selectedService: string) => {
        setServico(selectedService);
        setShowServiceList(false); // Fecha a lista após a seleção
    };

    // 🔹 Função para lidar com a mudança no DatePicker
    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dataAgendamento;
        setShowDatePicker(Platform.OS === 'ios'); // Fecha se for iOS
        setDataAgendamento(currentDate);

        // Se o usuário selecionou a data, abre o seletor de hora
        if (event.type === 'set' && Platform.OS !== 'ios') {
            setShowTimePicker(true);
        }
    };

    // 🔹 Função para lidar com a mudança no TimePicker
    const onChangeTime = (event: any, selectedTime?: Date) => {
        const currentTime = selectedTime || dataAgendamento;
        setShowTimePicker(Platform.OS === 'ios'); // Fecha se for iOS

        // Mantém a data, mas atualiza a hora
        setDataAgendamento(new Date(
            dataAgendamento.getFullYear(),
            dataAgendamento.getMonth(),
            dataAgendamento.getDate(),
            currentTime.getHours(),
            currentTime.getMinutes()
        ));
    };


    // 🔹 Função para agendar
    const handleAgendar = async () => {
        // 🔹 Validação dos campos
        if (!servico) {
            Alert.alert('Atenção', 'Por favor, selecione o serviço.');
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
                // 🔹 ALTERAÇÃO CRUCIAL: Armazena o objeto Date. O Firebase/Firestore
                // irá converter isso automaticamente para o tipo 'timestamp'.
                dataHoraAgendamento: dataAgendamento,

                status: 'Pendente',
                agendadoEm: serverTimestamp() // Data de criação do registro
            });

            Alert.alert('Sucesso', 'Seu agendamento foi realizado!');
            // Limpa os campos após o agendamento
            setServico('');
            setDataAgendamento(new Date());

        } catch (error) {
            console.error("Erro ao agendar: ", error);
            Alert.alert('Erro', 'Não foi possível agendar o serviço. Tente novamente.');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={style.container} showsVerticalScrollIndicator={false}>

                <Text style={style.sectionTitle}>Agendar Serviço</Text>
                <Text style={style.sectionSubtitle}>Selecione o tipo de serviço, a data e o horário desejados para o seu pet.</Text>

                <View style={style.formContainer}>
                    {/* 🔹 Serviço - Agora dentro de uma View que será o Container do Dropdown */}
                    <View style={[style.inputGroup, style.serviceDropdownContainer]}>
                        <Text style={style.inputLabel}>Tipo de Serviço</Text>

                        {/* 1. INPUT DE SELEÇÃO */}
                        <TouchableOpacity
                            style={style.selectInput}
                            // 🔹 ALTERAÇÃO: Alterna a visibilidade da lista
                            onPress={() => setShowServiceList(!showServiceList)}
                        >
                            <Ionicons
                                name="cut-outline"
                                size={20}
                                color={themes.colors.secundary}
                                style={style.inputIcon}
                            />
                            <Text style={[
                                style.selectInputText,
                                {
                                    color: servico ? themes.colors.secundary : '#888',
                                    fontWeight: servico ? '600' : '400',
                                }
                            ]}>
                                {servico || "Escolha o Serviço..."}
                            </Text>
                            <MaterialIcons
                                // 🔹 ALTERAÇÃO: Altera o ícone de seta para refletir o estado aberto/fechado
                                name={showServiceList ? "arrow-drop-up" : "arrow-drop-down"}
                                size={24}
                                color="#888"
                            />
                        </TouchableOpacity>

                        {/* 2. LISTA DE SERVIÇOS (Dropdown) */}
                        {showServiceList && (
                            <View style={style.dropdownList}>
                                {SERVICOS.map((s) => (
                                    <TouchableOpacity
                                        key={s}
                                        style={style.dropdownItem}
                                        onPress={() => handleSelectService(s)} // Seleciona e fecha
                                    >
                                        <Text style={style.dropdownItemText}>{s}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* 🔹 Data e Horário (Organizados lado a lado) */}
                    <View style={style.dateTimeContainer}>

                        {/* Data */}
                        <View style={[style.inputGroup, style.halfInput]}>
                            <Text style={style.inputLabel}>Data</Text>
                            <TouchableOpacity
                                style={style.selectInput}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <MaterialIcons
                                    name="date-range"
                                    size={20}
                                    color={themes.colors.secundary}
                                    style={style.inputIcon}
                                />
                                {/* CORRIGIDO: Mostra a data formatada. A cor pode ser fixa já que a data inicial sempre existirá. */}
                                <Text style={[
                                    style.selectInputText,
                                    {
                                        color: themes.colors.secundary,
                                        fontWeight: '600',
                                    }
                                ]}>
                                    {formatDate(dataAgendamento)}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Horário */}
                        <View style={[style.inputGroup, style.halfInput]}>
                            <Text style={style.inputLabel}>Horário</Text>
                            <TouchableOpacity
                                style={style.selectInput}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <MaterialIcons
                                    name="access-time"
                                    size={20}
                                    color={themes.colors.secundary}
                                    style={style.inputIcon}
                                />
                                {/* CORRIGIDO: Mostra a hora formatada. A cor pode ser fixa. */}
                                <Text style={[
                                    style.selectInputText,
                                    {
                                        color: themes.colors.secundary,
                                        fontWeight: '600',
                                    }
                                ]}>
                                    {formatTime(dataAgendamento)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Seletor de Data */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={dataAgendamento}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                            minimumDate={new Date()}
                        />
                    )}

                    {/* Seletor de Hora */}
                    {showTimePicker && (
                        <DateTimePicker
                            value={dataAgendamento}
                            mode="time"
                            display="default"
                            onChange={onChangeTime}
                        />
                    )}

                    {/* Botão de Agendar */}
                    <TouchableOpacity style={style.button} onPress={handleAgendar}>
                        <Text style={style.buttonText}>Confirmar Agendamento</Text>
                        <MaterialIcons name="done-all" size={24} color="#fff" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}