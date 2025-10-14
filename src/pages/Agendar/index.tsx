// pages/Agendar/index.tsx

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
    Image,
    Modal,
    ActivityIndicator
} from "react-native";

// Removendo TextInput não usado para Data/Hora/Serviço
import { style } from "./styles";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";

//  Importações do Firebase
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

//  Componentes de seleção de data/hora (Assumindo que você instalou)
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from "react-native-maps";

//  Lista de serviços fixos
const SERVICOS = [
    'Banho e Tosa',
    'Somente Tosa',
    'Corte de Unha',
    'Hidratação',
    'Consulta Veterinária',
];

//  Funções auxiliares para formatação
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

    // 🔹 Novos estados para pets
    const [pets, setPets] = useState<any[]>([]);
    const [petSelecionado, setPetSelecionado] = useState<any>(null);
    const [showPetModal, setShowPetModal] = useState(false);

    // 🔹 Novos estados do código 2
    const [abaAtual, setAbaAtual] = useState<'agendar' | 'meusAgendamentos'>('agendar');
    const [meusAgendamentos, setMeusAgendamentos] = useState<any[]>([]);
    const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);

    const [unidadeSelecionada, setUnidadeSelecionada] = useState<any>(null);

    const unidades = [
        {
            nome: "Petshop Lu - Santo André",
            endereco: "Av. Loreto, 238 - Jardim Santo André, Santo André - SP, 09132-410",
            lat: -23.706585,
            lng: -46.500750,
        },
        {
            nome: "Petshop Lu - São Bernardo",
            endereco: "Av. Ibirapuera, 1000 - Moema",
            lat: -23.601231,
            lng: -46.661432,
        },
        {
            nome: "Petshop Lu - São Caetano",
            endereco: "Rua Domingos de Morais, 1500 - Vila Mariana",
            lat: -23.589432,
            lng: -46.636232,
        },
    ];

    const handleSelectService = (selectedService: string) => {
        setServico(selectedService);
        setShowServiceList(false);
    };

    //  Função para lidar com a mudança no DatePicker
    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dataAgendamento;
        setShowDatePicker(Platform.OS === 'ios');
        setDataAgendamento(currentDate);

        // Se o usuário selecionou a data, abre o seletor de hora
        if (event.type === 'set' && Platform.OS !== 'ios') {
            setShowTimePicker(true);
        }
    };

    //  Função para lidar com a mudança no TimePicker
    const onChangeTime = (event: any, selectedTime?: Date) => {
        const currentTime = selectedTime || dataAgendamento;
        setShowTimePicker(Platform.OS === 'ios');

        // Mantém a data, mas atualiza a hora
        setDataAgendamento(new Date(
            dataAgendamento.getFullYear(),
            dataAgendamento.getMonth(),
            dataAgendamento.getDate(),
            currentTime.getHours(),
            currentTime.getMinutes()
        ));
    };

    //  Função para agendar
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
            // Adiciona o documento na coleção 'agendamentos'
            await addDoc(collection(db, 'agendamentos'), {
                userId: userId,
                service: servico,
                dataHoraAgendamento: dataAgendamento,
                unidade: unidadeSelecionada?.nome || null,
                enderecoUnidade: unidadeSelecionada?.endereco || null,
                petId: petSelecionado?.id || null,
                petNome: petSelecionado?.name || null,
                status: 'Pendente',
                agendadoEm: serverTimestamp(),
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

    // Busca os pets do usuário logado
    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const carregarPets = async () => {
            try {
                const q = query(collection(db, "cadastrarPet"), where("userId", "==", userId));
                const querySnapshot = await getDocs(q);
                const listaPets = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPets(listaPets);
            } catch (error) {
                console.error("Erro ao buscar pets:", error);
                Alert.alert("Erro", "Não foi possível carregar seus pets.");
            }
        };

        carregarPets();
    }, []);

    //  Função para retornar a imagem do pet
    const getPetImage = (type: string) => {
        switch (type.toLowerCase()) {
            case "dog": return require("../../assets/pets/dog.png");
            case "cat": return require("../../assets/pets/cat.png");
            case "hamster": return require("../../assets/pets/hamster.png");
            case "turtle": return require("../../assets/pets/turtle.png");
            case "bird": return require("../../assets/pets/bird.png");
            case "rabbit": return require("../../assets/pets/rabbit.png");
            default: return require("../../assets/pets/pet.png");
        }
    };

    // 🔹 Novo useEffect do código 2 para carregar agendamentos
    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const carregarAgendamentos = async () => {
            try {
                setLoadingAgendamentos(true);
                const q = query(collection(db, "agendamentos"), where("userId", "==", userId));
                const querySnapshot = await getDocs(q);

                const listaAgendamentos = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setMeusAgendamentos(listaAgendamentos);
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
                Alert.alert("Erro", "Não foi possível carregar seus agendamentos.");
            } finally {
                setLoadingAgendamentos(false);
            }
        };

        if (abaAtual === 'meusAgendamentos') {
            carregarAgendamentos();
        }
    }, [abaAtual]);

    const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<any>(null);

    // Função para abrir o modal com os detalhes
    const abrirDetalhesAgendamento = (agendamento: any) => {
        setAgendamentoSelecionado(agendamento);
        setModalDetalhesVisible(true);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={style.container} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

                {/* 🔹 SWITCH DE ABAS - Adicionado do código 2 */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 15, marginTop: 50 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: abaAtual === 'agendar' ? themes.colors.secundary : '#ddd',
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                        }}
                        onPress={() => setAbaAtual('agendar')}
                    >
                        <Text
                            style={{
                                color: abaAtual === 'agendar' ? '#fff' : '#555',
                                fontWeight: '600',
                            }}
                        >
                            Agendar Serviço
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: abaAtual === 'meusAgendamentos' ? themes.colors.secundary : '#ddd',
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                        }}
                        onPress={() => setAbaAtual('meusAgendamentos')}
                    >
                        <Text
                            style={{
                                color: abaAtual === 'meusAgendamentos' ? '#fff' : '#555',
                                fontWeight: '600',
                            }}
                        >
                            Meus Agendamentos
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 🔹 CONTEÚDO CONDICIONAL - Adicionado do código 2 */}
                {abaAtual === 'agendar' ? (
                    <>
                        {/* 🔸 CONTEÚDO ORIGINAL DA ABA "AGENDAR" */}
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
                                </TouchableOpacity>

                                {/* Dropdown de Serviço usando Modal */}
                                <Modal
                                    visible={showServiceList}
                                    transparent={true}
                                    animationType="fade"
                                    onRequestClose={() => setShowServiceList(false)}
                                >
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'rgba(0,0,0,0.2)',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingHorizontal: 20,
                                        }}
                                        activeOpacity={1}
                                        onPressOut={() => setShowServiceList(false)} // fecha ao clicar fora
                                    >
                                        <View
                                            style={{
                                                width: '100%',
                                                maxHeight: '50%',
                                                backgroundColor: '#fff',
                                                borderRadius: 12,
                                                paddingVertical: 10,
                                            }}
                                        >
                                            <ScrollView showsVerticalScrollIndicator={true}>
                                                {SERVICOS.map((s) => (
                                                    <TouchableOpacity
                                                        key={s}
                                                        style={{
                                                            paddingVertical: 15,
                                                            paddingHorizontal: 20,
                                                        }}
                                                        onPress={() => {
                                                            handleSelectService(s);
                                                            setShowServiceList(false);
                                                        }}
                                                    >
                                                        <Text style={{ fontSize: 16 }}>{s}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </TouchableOpacity>
                                </Modal>

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

                            {/* Seletor de Pet */}
                            <View style={[style.inputGroup, style.serviceDropdownContainer]}>
                                <Text style={style.inputLabel}>Selecione o Pet</Text>

                                <TouchableOpacity
                                    style={style.selectInput}
                                    onPress={() => setShowPetModal(true)}
                                >
                                    <Ionicons
                                        name="paw-outline"
                                        size={20}
                                        color={themes.colors.secundary}
                                        style={style.inputIcon}
                                    />
                                    {petSelecionado ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image
                                                source={getPetImage(petSelecionado?.animalType || "dog")}
                                                style={{ width: 24, height: 24, marginRight: 8, borderRadius: 12 }}
                                            />
                                            <Text style={[style.selectInputText, { color: themes.colors.secundary, fontWeight: '600' }]}>
                                                {petSelecionado.name}
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text style={[style.selectInputText, { color: '#888', fontWeight: '400' }]}>
                                            Escolha o Pet...
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <Modal
                                visible={showPetModal}
                                animationType="fade"
                                transparent={true}
                                onRequestClose={() => setShowPetModal(false)}
                            >
                                <View style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={{
                                        width: '90%',
                                        maxHeight: '70%',
                                        backgroundColor: '#fff',
                                        borderRadius: 10,
                                        padding: 10
                                    }}>
                                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Selecione o Pet</Text>

                                        {/* Scroll vertical correto */}
                                        <ScrollView
                                            showsVerticalScrollIndicator={true}
                                            contentContainerStyle={{
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                                justifyContent: 'space-between',
                                                paddingBottom: 10
                                            }}
                                        >
                                            {pets.map((pet) => (
                                                <TouchableOpacity
                                                    key={pet.id}
                                                    style={{
                                                        width: '30%', // 3 colunas
                                                        marginBottom: 15,
                                                        alignItems: 'center'
                                                    }}
                                                    onPress={() => {
                                                        setPetSelecionado(pet);
                                                        setShowPetModal(false);
                                                    }}
                                                >
                                                    <Image
                                                        source={getPetImage(pet.animalType || "dog")}
                                                        style={{ width: 60, height: 60, borderRadius: 30, marginBottom: 5 }}
                                                    />
                                                    <Text style={{ textAlign: 'center' }}>{pet.name}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>

                                        <TouchableOpacity
                                            style={{
                                                marginTop: 10,
                                                alignSelf: 'flex-end',
                                                padding: 8
                                            }}
                                            onPress={() => setShowPetModal(false)}
                                        >
                                            <Text style={{ color: 'red', fontWeight: '600' }}>Fechar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            <View style={style.inputGroup}>
                                <Text style={style.inputLabel}>Selecione a Unidade</Text>

                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ flexDirection: "row", gap: 16, paddingVertical: 10 }}
                                >
                                    {unidades.map((unidade, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            activeOpacity={0.9}
                                            onPress={() => setUnidadeSelecionada(unidade)}
                                            style={{
                                                width: 250,
                                                backgroundColor:
                                                    unidadeSelecionada?.nome === unidade.nome
                                                        ? themes.colors.secundary
                                                        : "#fff",
                                                borderRadius: 16,
                                                overflow: "hidden",
                                                borderWidth: 2,
                                                borderColor:
                                                    unidadeSelecionada?.nome === unidade.nome
                                                        ? themes.colors.corTexto
                                                        : "#ddd",
                                                shadowColor: "#000",
                                                shadowOpacity: 0.15,
                                                shadowRadius: 4,
                                                elevation: 3,
                                            }}
                                        >
                                            {/* Nome da Unidade */}
                                            <View style={{ padding: 10 }}>
                                                <Text
                                                    style={{
                                                        fontWeight: "700",
                                                        fontSize: 16,
                                                        color:
                                                            unidadeSelecionada?.nome === unidade.nome
                                                                ? "#fff"
                                                                : "#333",
                                                    }}
                                                >
                                                    {unidade.nome}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 13,
                                                        color:
                                                            unidadeSelecionada?.nome === unidade.nome
                                                                ? "#f1f1f1"
                                                                : "#777",
                                                    }}
                                                >
                                                    {unidade.endereco}
                                                </Text>
                                            </View>

                                            {/* Mapa Miniatura */}
                                            <View style={{ height: 140 }}>
                                                <MapView
                                                    style={{ flex: 1 }}
                                                    initialRegion={{
                                                        latitude: unidade.lat,
                                                        longitude: unidade.lng,
                                                        latitudeDelta: 0.01,
                                                        longitudeDelta: 0.01,
                                                    }}
                                                    scrollEnabled={false}
                                                    zoomEnabled={false}
                                                >
                                                    <Marker
                                                        coordinate={{
                                                            latitude: unidade.lat,
                                                            longitude: unidade.lng,
                                                        }}
                                                        title={unidade.nome}
                                                    />
                                                </MapView>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>


                            </View>
                            {/* Botão de Agendar */}
                            <TouchableOpacity style={style.button} onPress={handleAgendar}>
                                <Text style={style.buttonText}>Confirmar Agendamento</Text>
                                <MaterialIcons name="done-all" size={24} color="#fff" style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        {/* 🔸 CONTEÚDO DA ABA "MEUS AGENDAMENTOS" - Adicionado do código 2 */}
                        <Text style={style.sectionTitle}>Meus Agendamentos</Text>

                        {loadingAgendamentos ? (
                            <ActivityIndicator
                                size="large"
                                color={themes.colors.secundary}
                                style={{ marginTop: 20 }}
                            />
                        ) : meusAgendamentos.length === 0 ? (
                            <Text
                                style={{
                                    textAlign: 'center',
                                    marginTop: 20,
                                    color: '#666',
                                }}
                            >
                                Você ainda não possui agendamentos.
                            </Text>
                        ) : (
                            meusAgendamentos.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={{
                                        backgroundColor: '#fff',
                                        marginVertical: 10,
                                        marginHorizontal: 10,
                                        borderRadius: 12,
                                        padding: 15,
                                        shadowColor: '#000',
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 2,
                                    }}
                                    onPress={() => abrirDetalhesAgendamento(item)}
                                >
                                    {/* O conteúdo do card permanece o mesmo */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontWeight: '700', color: themes.colors.secundary }}>
                                            {item.service}
                                        </Text>
                                        <Text style={{ color: '#555' }}>{item.status}</Text>
                                    </View>

                                    {item.petNome && (
                                        <Text style={{ marginTop: 5 }}>
                                            🐾 Pet:{' '}
                                            <Text style={{ fontWeight: '600' }}>{item.petNome}</Text>
                                        </Text>
                                    )}

                                    {item.dataHoraAgendamento?.seconds && (
                                        <Text style={{ marginTop: 3 }}>
                                            📅{' '}
                                            {new Date(
                                                item.dataHoraAgendamento.seconds * 1000
                                            ).toLocaleDateString('pt-BR')}{' '}
                                            às{' '}
                                            {new Date(
                                                item.dataHoraAgendamento.seconds * 1000
                                            ).toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </Text>
                                    )}

                                    {item.unidade && (
                                        <Text style={{ marginTop: 3 }}>📍 {item.unidade}</Text>
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                    </>
                )}

            </ScrollView>

            // Modal de Detalhes do Agendamento
            <Modal
                visible={modalDetalhesVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalDetalhesVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <View style={{
                        width: '100%',
                        maxHeight: '80%',
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 20,
                        shadowColor: '#000',
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}>
                        {/* Header do Modal */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee',
                            paddingBottom: 15
                        }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: themes.colors.secundary
                            }}>
                                Detalhes do Agendamento
                            </Text>
                            <TouchableOpacity onPress={() => setModalDetalhesVisible(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Nome do Serviço */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: 5
                                }}>
                                    Serviço
                                </Text>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: themes.colors.secundary
                                }}>
                                    {agendamentoSelecionado?.service}
                                </Text>
                            </View>

                            {/* Pet com Foto */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: 10
                                }}>
                                    Pet
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#f8f8f8',
                                    padding: 15,
                                    borderRadius: 12
                                }}>
                                    <Image
                                        source={getPetImage(agendamentoSelecionado?.petAnimalType || "dog")}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            marginRight: 15
                                        }}
                                    />
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: themes.colors.secundary
                                    }}>
                                        {agendamentoSelecionado?.petNome || 'Pet não especificado'}
                                    </Text>
                                </View>
                            </View>

                            {/* Data e Horário */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: 10
                                }}>
                                    Data e Horário
                                </Text>
                                <View style={{
                                    backgroundColor: '#f8f8f8',
                                    padding: 15,
                                    borderRadius: 12
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: themes.colors.secundary
                                    }}>
                                        📅 {agendamentoSelecionado?.dataHoraAgendamento?.seconds ?
                                            new Date(agendamentoSelecionado.dataHoraAgendamento.seconds * 1000).toLocaleDateString('pt-BR')
                                            : 'Data não disponível'}
                                    </Text>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: themes.colors.secundary,
                                        marginTop: 5
                                    }}>
                                        🕒 {agendamentoSelecionado?.dataHoraAgendamento?.seconds ?
                                            new Date(agendamentoSelecionado.dataHoraAgendamento.seconds * 1000).toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : 'Horário não disponível'}
                                    </Text>
                                </View>
                            </View>

                            {/* Local com Mapa */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: 10
                                }}>
                                    Local
                                </Text>

                                {/* Encontrar a unidade correspondente */}
                                {(() => {
                                    const unidade = unidades.find(u => u.nome === agendamentoSelecionado?.unidade);
                                    if (!unidade) return null;

                                    return (
                                        <View style={{
                                            backgroundColor: '#fff',
                                            borderRadius: 16,
                                            overflow: "hidden",
                                            borderWidth: 2,
                                            borderColor: themes.colors.secundary,
                                            shadowColor: "#000",
                                            shadowOpacity: 0.15,
                                            shadowRadius: 4,
                                            elevation: 3,
                                        }}>
                                            {/* Nome da Unidade */}
                                            <View style={{ padding: 15 }}>
                                                <Text style={{
                                                    fontWeight: "700",
                                                    fontSize: 16,
                                                    color: themes.colors.secundary,
                                                }}>
                                                    {unidade.nome}
                                                </Text>
                                                <Text style={{
                                                    fontSize: 13,
                                                    color: "#777",
                                                    marginTop: 5
                                                }}>
                                                    {unidade.endereco}
                                                </Text>
                                            </View>

                                            {/* Mapa Miniatura */}
                                            <View style={{ height: 150 }}>
                                                <MapView
                                                    style={{ flex: 1 }}
                                                    initialRegion={{
                                                        latitude: unidade.lat,
                                                        longitude: unidade.lng,
                                                        latitudeDelta: 0.01,
                                                        longitudeDelta: 0.01,
                                                    }}
                                                    scrollEnabled={false}
                                                    zoomEnabled={false}
                                                >
                                                    <Marker
                                                        coordinate={{
                                                            latitude: unidade.lat,
                                                            longitude: unidade.lng,
                                                        }}
                                                        title={unidade.nome}
                                                    />
                                                </MapView>
                                            </View>
                                        </View>
                                    );
                                })()}
                            </View>

                            {/* Contato da Unidade */}
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: 10
                                }}>
                                    Contato da Unidade
                                </Text>
                                <View style={{
                                    backgroundColor: '#f8f8f8',
                                    padding: 15,
                                    borderRadius: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Ionicons name="call" size={20} color={themes.colors.secundary} style={{ marginRight: 10 }} />
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: themes.colors.secundary
                                    }}>
                                        📞 (11) 1234-5678
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>

                        {/* Botão Fechar */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: themes.colors.secundary,
                                padding: 15,
                                borderRadius: 12,
                                alignItems: 'center',
                                marginTop: 20
                            }}
                            onPress={() => setModalDetalhesVisible(false)}
                        >
                            <Text style={{
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: '600'
                            }}>
                                Fechar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}