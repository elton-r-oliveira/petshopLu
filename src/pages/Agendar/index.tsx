// pages/Agendar/index.tsx
import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, Platform } from "react-native";
import { style } from "./styles";

// Importações do Firebase
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

// Componentes
import { TabSwitch } from "../../components/TabSwitch";
import { AgendarServico } from "../../components/AgendarServico";
import { MeusAgendamentos } from "../../components/MeusAgendamentos";
import { ModalDetalhesAgendamento } from "../../components/ModalDetalhesAgendamento"

// Funções auxiliares
const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');
const formatTime = (date: Date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

// Função para converter Date local para Timestamp do Firestore
// Função para converter Date local para Timestamp do Firestore
const localDateToFirestoreTimestamp = (localDate: Date) => {
    // Simplesmente retorna a data local - o Firestore vai armazenar como Timestamp
    // e cuidar da conversão para UTC internamente
    return localDate;
};

// Função para converter Timestamp do Firestore para Date local
const firestoreTimestampToLocalDate = (timestamp: any) => {
    if (!timestamp) return new Date();

    // Se for um Timestamp do Firestore, converte para Date
    if (timestamp.toDate) {
        return timestamp.toDate();
    }

    // Se já for uma Date, retorna diretamente
    if (timestamp instanceof Date) {
        return timestamp;
    }

    // Para outros casos, cria nova Date
    return new Date(timestamp);
};

export default function Agendar() {
    // Estados
    const [servico, setServico] = useState('');
    const [dataAgendamento, setDataAgendamento] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showServiceList, setShowServiceList] = useState(false);
    const [pets, setPets] = useState<any[]>([]);
    const [petSelecionado, setPetSelecionado] = useState<any>(null);
    const [showPetModal, setShowPetModal] = useState(false);
    const [abaAtual, setAbaAtual] = useState<'agendar' | 'meusAgendamentos'>('agendar');
    const [meusAgendamentos, setMeusAgendamentos] = useState<any[]>([]);
    const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);
    const [unidadeSelecionada, setUnidadeSelecionada] = useState<any>(null);
    const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<any>(null);
    const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
    const horariosFixos = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

    useEffect(() => {
        const carregarHorariosOcupados = async () => {
            try {
                // Usa datas locais diretamente
                const inicioDoDia = new Date(dataAgendamento);
                inicioDoDia.setHours(0, 0, 0, 0);

                const fimDoDia = new Date(dataAgendamento);
                fimDoDia.setHours(23, 59, 59, 999);

                const q = query(
                    collection(db, "agendamentos"),
                    where("dataHoraAgendamento", ">=", inicioDoDia),
                    where("dataHoraAgendamento", "<=", fimDoDia)
                );

                const querySnapshot = await getDocs(q);
                const ocupados: string[] = [];

                querySnapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    // ✅ Filtra no cliente
                    if (data.status === "Cancelado" || data.status === "Concluído") {
                        return; // ignora
                    }

                    const dateObj = firestoreTimestampToLocalDate(data.dataHoraAgendamento);
                    const horaLocal = dateObj.getHours().toString().padStart(2, '0') + ':' +
                        dateObj.getMinutes().toString().padStart(2, '0');
                    ocupados.push(horaLocal);
                });

                setHorariosOcupados(ocupados);

            } catch (error) {
                console.error("Erro ao carregar horários ocupados:", error);
            }
        };

        if (abaAtual === 'agendar') {
            carregarHorariosOcupados();
        }
    }, [dataAgendamento, abaAtual]);

    const unidades = [
        {
            nome: "Petshop Lu - Santo André",
            endereco: "Av. Loreto, 238 - Jardim Santo André, Santo André - SP, 09132-410",
            lat: -23.706598,
            lng: -46.500752,
            telefone: "(11) 95075-2980",
            whatsapp: " (11) 97591-1800"
        },
        {
            nome: "Petshop Lu - São Bernardo",
            endereco: "Av. Loreto, 238 - Jardim Santo André, Santo André - SP, 09132-410",
            lat: -23.601231,
            lng: -46.661432,
            telefone: "(11) 9999-9999",
            whatsapp: " (11) 97591-1800"
        },
        {
            nome: "Petshop Lu - São Caetano",
            endereco: "Av. Loreto, 238 - Jardim Santo André, Santo André - SP, 09132-410",
            lat: -23.589432,
            lng: -46.636232,
            telefone: "(11) 9999-9999",
            whatsapp: " (11) 97591-1800"
        },
    ];

    // Funções
    const handleSelectService = (selectedService: string) => {
        setServico(selectedService);
        setShowServiceList(false);
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dataAgendamento;
        setShowDatePicker(Platform.OS === 'ios');
        setDataAgendamento(currentDate);

        if (event.type === 'set' && Platform.OS !== 'ios') {
            setShowTimePicker(true);
        }
    };

    const handleAgendar = async () => {
        if (!servico) {
            Alert.alert('Atenção', 'Por favor, selecione o serviço.');
            return;
        }

        const userId = auth.currentUser?.uid;
        if (!userId) {
            Alert.alert('Erro', 'Você precisa estar logado para agendar.');
            return;
        }

        // 🔒 VALIDAÇÃO: horário já passou?
        const agora = new Date();
        if (dataAgendamento < agora) {
            Alert.alert('Atenção', 'Não é possível agendar em um horário que já passou.');
            return;
        }

        // 🔒 VALIDAÇÃO: horário está ocupado?
        const horarioSelecionado = formatTime(dataAgendamento); // "10:00", etc.
        if (horariosOcupados.includes(horarioSelecionado)) {
            Alert.alert('Atenção', 'Este horário já está ocupado. Por favor, escolha outro.');
            return;
        }

        try {
            // Usa a data local diretamente - Firestore cuida da conversão
            await addDoc(collection(db, 'agendamentos'), {
                userId: userId,
                service: servico,
                dataHoraAgendamento: dataAgendamento, // Agora está correto
                unidade: unidadeSelecionada?.nome || null,
                enderecoUnidade: unidadeSelecionada?.endereco || null,
                unidadeTelefone: unidadeSelecionada?.telefone || null,
                unidadeWhatsapp: unidadeSelecionada?.whatsapp || null,
                petId: petSelecionado?.id || null,
                petNome: petSelecionado?.name || null,
                petAnimalType: petSelecionado?.animalType || null,
                status: 'Pendente',
                agendadoEm: serverTimestamp(),
            });

            Alert.alert('Sucesso', 'Seu agendamento foi realizado com sucesso!');
            setServico('');
            setDataAgendamento(new Date());
            setPetSelecionado(null);
            setUnidadeSelecionada(null);

        } catch (error) {
            console.error("Erro ao agendar: ", error);
            Alert.alert('Erro', 'Não foi possível agendar o serviço. Tente novamente.');
        }
    };

    const getPetImage = (type?: string) => {
        // Se type for falsy ou não for string, retorna imagem padrão
        if (!type || typeof type !== 'string') {
            return require("../../assets/pets/pet.png");
        }

        const t = type.toLowerCase();

        switch (t) {
            case "dog": return require("../../assets/pets/dog.png");
            case "cat": return require("../../assets/pets/cat.png");
            case "hamster": return require("../../assets/pets/hamster.png");
            case "turtle": return require("../../assets/pets/turtle.png");
            case "bird": return require("../../assets/pets/bird.png");
            case "rabbit": return require("../../assets/pets/rabbit.png");
            default: return require("../../assets/pets/pet.png");
        }
    };

    const abrirDetalhesAgendamento = (agendamento: any) => {
        // Converte a data do Firestore para local antes de exibir
        const agendamentoComDataLocal = {
            ...agendamento,
            dataHoraAgendamento: firestoreTimestampToLocalDate(agendamento.dataHoraAgendamento)
        };
        setAgendamentoSelecionado(agendamentoComDataLocal);
        setModalDetalhesVisible(true);
    };

    // Effects
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

    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const carregarAgendamentos = async () => {
            try {
                setLoadingAgendamentos(true);
                const q = query(collection(db, "agendamentos"), where("userId", "==", userId));
                const querySnapshot = await getDocs(q);

                const listaAgendamentos = querySnapshot.docs.map(doc => {
                    const data = doc.data();

                    // CORREÇÃO: Converter corretamente o Timestamp para Date local
                    let dataHoraAgendamento;

                    if (data.dataHoraAgendamento && data.dataHoraAgendamento.toDate) {
                        // Se for um Timestamp do Firestore
                        dataHoraAgendamento = data.dataHoraAgendamento.toDate();
                    } else if (data.dataHoraAgendamento instanceof Date) {
                        // Se já for uma Date
                        dataHoraAgendamento = data.dataHoraAgendamento;
                    } else {
                        // Para outros casos
                        dataHoraAgendamento = new Date(data.dataHoraAgendamento);
                    }

                    return {
                        id: doc.id,
                        ...data,
                        dataHoraAgendamento: dataHoraAgendamento
                    };
                });

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

    const cancelarAgendamento = async (agendamentoId: string) => {
        try {
            Alert.alert(
                "Cancelar Agendamento",
                "Tem certeza de que deseja cancelar este agendamento?",
                [
                    { text: "Não", style: "cancel" },
                    {
                        text: "Sim, cancelar",
                        style: "destructive",
                        onPress: async () => {
                            await updateDoc(doc(db, "agendamentos", agendamentoId), {
                                status: "Cancelado",
                            });

                            // Atualiza o estado local sem recarregar
                            setMeusAgendamentos(prev =>
                                prev.map(item =>
                                    item.id === agendamentoId
                                        ? { ...item, status: "Cancelado" }
                                        : item
                                )
                            );

                            setModalDetalhesVisible(false);
                            Alert.alert("Agendamento cancelado com sucesso!");
                        },
                    },
                ]
            );
        } catch (error) {
            console.error("Erro ao cancelar agendamento:", error);
            Alert.alert("Erro", "Não foi possível cancelar o agendamento.");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={style.container} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                <TabSwitch abaAtual={abaAtual} setAbaAtual={setAbaAtual} />

                {abaAtual === 'agendar' ? (
                    <AgendarServico
                        servico={servico}
                        setServico={setServico}
                        dataAgendamento={dataAgendamento}
                        setDataAgendamento={setDataAgendamento}
                        showDatePicker={showDatePicker}
                        setShowDatePicker={setShowDatePicker}
                        showServiceList={showServiceList}
                        setShowServiceList={setShowServiceList}
                        pets={pets}
                        petSelecionado={petSelecionado}
                        setPetSelecionado={setPetSelecionado}
                        showPetModal={showPetModal}
                        setShowPetModal={setShowPetModal}
                        unidadeSelecionada={unidadeSelecionada}
                        setUnidadeSelecionada={setUnidadeSelecionada}
                        unidades={unidades}
                        handleSelectService={handleSelectService}
                        onChangeDate={onChangeDate}
                        handleAgendar={handleAgendar}
                        getPetImage={getPetImage}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        horariosFixos={horariosFixos}
                        horariosOcupados={horariosOcupados}
                    />
                ) : (
                    <MeusAgendamentos
                        meusAgendamentos={meusAgendamentos}
                        loadingAgendamentos={loadingAgendamentos}
                        abrirDetalhesAgendamento={abrirDetalhesAgendamento}
                    />
                )}
            </ScrollView>
            {modalDetalhesVisible && agendamentoSelecionado && (
                <ModalDetalhesAgendamento
                    modalDetalhesVisible={modalDetalhesVisible}
                    setModalDetalhesVisible={setModalDetalhesVisible}
                    agendamentoSelecionado={agendamentoSelecionado}
                    unidades={unidades}
                    getPetImage={getPetImage}
                    onCancelarAgendamento={cancelarAgendamento}
                />
            )}
        </View>
    );
}