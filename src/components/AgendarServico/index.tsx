import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Image, Linking } from 'react-native';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import { style } from "./styles"
import { CustomCalendar } from "../CustomCalendar";
import PetSelectorModal from "../PetSelectorModal";
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../../lib/firebaseConfig';
import { collection, getDocs, query, where, onSnapshot, orderBy } from 'firebase/firestore'; // ✅ ADICIONE orderBy
import { User } from 'firebase/auth';
import ServiceSelectorModal, { Service } from "../ServiceSelectorModal";
import { PawLoader } from '../PawLoader';

export interface AgendarServicoProps {
    servico: string;
    setServico: (servico: string) => void;
    servicoSelecionado: any;
    setServicoSelecionado: (servico: any) => void;
    dataAgendamento: Date;
    setDataAgendamento: (date: Date) => void;
    showServiceList: boolean;
    setShowServiceList: (show: boolean) => void;
    pets: any[];
    petSelecionado: any;
    setPetSelecionado: (pet: any) => void;
    showPetModal: boolean;
    setShowPetModal: (show: boolean) => void;
    unidadeSelecionada: any;
    setUnidadeSelecionada: (unidade: any) => void;
    unidades: any[]; // ✅ ESTÁ NAS PROPS, MAS VAMOS SOBRESCREVER
    handleSelectService: (service: any) => void;
    onChangeDate: (event: any, selectedDate?: Date) => void;
    handleAgendar: () => void;
    getPetImage: (animalType: string) => any;
    formatDate: (date: Date) => string;
    formatTime: (date: Date) => string;
    horariosFixos: string[];
    horariosOcupados: string[];
}

interface Pet {
    id: string;
    name: string;
    breed: string;
    age: number;
    weight: number;
    animalType: string;
}

// Serviços mockados como fallback
const SERVICOS: Service[] = [
    {
        id: '1',
        name: 'Banho e Tosa',
        price: '80,00',
        duration: '2-3 horas',
        icon: 'cut-outline',
        description: 'Banho completo + tosa higiênica ou tosa completa'
    },
    // ... outros serviços
];

// Unidades mockadas como fallback
const UNIDADES_FALLBACK = [
    {
        nome: "Petshop Lu - Santo André",
        endereco: "Av. Loreto, 238 - Jardim Santo André, Santo André - SP, 09132-410",
        lat: -23.706598,
        lng: -46.500752,
        telefone: "(11) 95075-2980",
        whatsapp: "(11) 97591-1800"
    }
];

// Adicione esta função para verificar se o dia está bloqueado
const isDiaBloqueado = (data: Date, diasBloqueados: string[], feriados: string[]): boolean => {
    const diaDaSemana = data.getDay();
    const dateStr = data.toISOString().split('T')[0];

    const isDomingo = diaDaSemana === 0;
    const isFeriado = feriados.includes(dateStr);
    const isDiaBloqueado = diasBloqueados.includes(dateStr);

    return isDomingo || isFeriado || isDiaBloqueado;
};

const isHorarioPassado = (dataAgendamento: Date, horario: string, diasBloqueados: string[], feriados: string[]): boolean => {
    const hoje = new Date();
    const dataSelecionada = new Date(dataAgendamento);

    // VERIFICAÇÃO 1: É domingo, feriado ou dia bloqueado?
    if (isDiaBloqueado(dataSelecionada, diasBloqueados, feriados)) {
        return true; // Bloqueia completamente
    }

    // VERIFICAÇÃO 2: Horário já passou (apenas se for hoje)
    const mesmoDia =
        dataSelecionada.getDate() === hoje.getDate() &&
        dataSelecionada.getMonth() === hoje.getMonth() &&
        dataSelecionada.getFullYear() === hoje.getFullYear();

    if (!mesmoDia) {
        return false; // Só bloqueia horários passados se for HOJE
    }

    const [horaStr, minutoStr] = horario.split(':');
    const hora = parseInt(horaStr, 10);
    const minuto = parseInt(minutoStr, 10);

    const horarioCompleto = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate(),
        hora,
        minuto
    );

    return horarioCompleto < hoje;
};

const openInGoogleMaps = (lat: number, lng: number, label: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(label)}`;
    Linking.openURL(url);
};

export const AgendarServico: React.FC<AgendarServicoProps> = ({
    servico,
    setServico,
    dataAgendamento,
    setDataAgendamento,
    setServicoSelecionado,
    showServiceList,
    setShowServiceList,
    petSelecionado,
    setPetSelecionado,
    showPetModal,
    setShowPetModal,
    unidadeSelecionada,
    setUnidadeSelecionada,
    unidades: unidadesProp, // ✅ RENOMEIE PARA EVITAR CONFLITO
    handleSelectService,
    onChangeDate,
    handleAgendar,
    getPetImage,
    formatDate,
    formatTime,
    horariosFixos,
    horariosOcupados
}) => {
    const [showCustomCalendar, setShowCustomCalendar] = useState(false);
    const [localPets, setLocalPets] = useState<Pet[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [servicosDisponiveis, setServicosDisponiveis] = useState<Service[]>([]);
    const [loadingServicos, setLoadingServicos] = useState(true);

    // ✅ NOVOS ESTADOS PARA CONFIGURAÇÕES DE DATA
    const [diasBloqueados, setDiasBloqueados] = useState<string[]>([]);
    const [feriados, setFeriados] = useState<string[]>([]);
    const [loadingConfiguracoes, setLoadingConfiguracoes] = useState(true);

    // ✅ NOVO ESTADO para horários dinâmicos
    const [horariosDinamicos, setHorariosDinamicos] = useState<string[]>([]);
    const [configuracoesHorario, setConfiguracoesHorario] = useState<any[]>([]);

    // ✅ NOVO ESTADO para unidades (substitui o das props)
    const [unidades, setUnidades] = useState<any[]>([]);
    const [loadingUnidades, setLoadingUnidades] = useState(true);

    // ✅ BUSCAR UNIDADES DO FIREBASE
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(db, 'unidades'),
                where('ativo', '==', true),
                orderBy('ordem', 'asc')
            ),
            (snapshot) => {
                const unidadesList: any[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    unidadesList.push({
                        id: doc.id,
                        ...data
                    });
                });
                setUnidades(unidadesList);
                setLoadingUnidades(false);
                console.log('Unidades carregadas:', unidadesList.length);
            },
            (error) => {
                console.error("Erro ao carregar unidades:", error);
                setLoadingUnidades(false);
                // Fallback para unidades mockadas em caso de erro
                setUnidades(UNIDADES_FALLBACK);
            }
        );

        return () => unsubscribe();
    }, []);

    // ✅ Buscar configurações de horário do Firebase
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'configuracoes_horario')),
            (snapshot) => {
                const horariosConfig: any[] = [];
                snapshot.forEach((doc) => {
                    horariosConfig.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                setConfiguracoesHorario(horariosConfig);

                // Atualizar horários dinâmicos baseado no dia selecionado
                atualizarHorariosDinamicos(dataAgendamento, horariosConfig);
            }
        );

        return () => unsubscribe();
    }, []);

    // ✅ Função para atualizar horários baseado no dia selecionado
    const atualizarHorariosDinamicos = (data: Date, configs: any[]) => {
        const diaDaSemana = data.getDay();
        const configDia = configs.find(h => h.diaSemana === diaDaSemana);

        if (configDia && configDia.aberto) {
            // Usar horários configurados para este dia
            setHorariosDinamicos(configDia.horariosDisponiveis || []);
        } else if (!configDia) {
            // Dia não configurado - considerar FECHADO
            setHorariosDinamicos([]);
        } else {
            // Dia configurado mas FECHADO
            setHorariosDinamicos([]);
        }
    };

    // ✅ Quando trocar de unidade, limpa a seleção de horário
    useEffect(() => {
        const novaData = new Date(dataAgendamento);
        novaData.setHours(0, 0, 0, 0); // Reseta para início do dia
        setDataAgendamento(novaData);
    }, [unidadeSelecionada]);

    // ✅ Atualizar horários quando mudar a data
    useEffect(() => {
        atualizarHorariosDinamicos(dataAgendamento, configuracoesHorario);
    }, [dataAgendamento, configuracoesHorario]);

    // ✅ BUSCAR SERVIÇOS DO FIREBASE
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'services'), where('active', '==', true)),
            (snapshot) => {
                const servicos: Service[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    servicos.push({
                        id: doc.id,
                        name: data.name,
                        price: data.priceDisplay,
                        duration: data.duration,
                        icon: data.icon,
                        description: data.description
                    });
                });

                // Ordenar por ordem definida no admin
                servicos.sort((a, b) => {
                    const dataA = snapshot.docs.find(doc => doc.id === a.id)?.data();
                    const dataB = snapshot.docs.find(doc => doc.id === b.id)?.data();
                    return (dataA?.order || 0) - (dataB?.order || 0);
                });

                setServicosDisponiveis(servicos);
                setLoadingServicos(false);
            },
            (error) => {
                console.error("Erro ao carregar serviços:", error);
                setLoadingServicos(false);
                // Fallback para serviços mockados em caso de erro
                setServicosDisponiveis(SERVICOS);
            }
        );

        return () => unsubscribe();
    }, []);

    // ✅ Buscar configurações de datas do Firebase
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'configuracoes_data'), where('ativo', '==', true)),
            (snapshot) => {
                const bloqueados: string[] = [];
                const feriadosList: string[] = [];

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.tipo === 'diaBloqueado') {
                        bloqueados.push(data.data);
                    } else if (data.tipo === 'feriado') {
                        feriadosList.push(data.data);
                    }
                });

                setDiasBloqueados(bloqueados);
                setFeriados(feriadosList);
                setLoadingConfiguracoes(false);
            },
            (error) => {
                console.error("Erro ao carregar configurações de data:", error);
                setLoadingConfiguracoes(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // ✅ Função para selecionar serviço
    const handleSelectServiceCard = (service: Service) => {
        setSelectedService(service);
    };

    // ✅ Função para abrir o modal de serviços
    const handleOpenServiceModal = () => {
        setShowServiceList(true);
    };

    // ✅ Encontre o serviço selecionado baseado no nome
    useEffect(() => {
        if (servico) {
            const service = servicosDisponiveis.find(s => s.name === servico);
            setSelectedService(service || null);
        } else {
            setSelectedService(null);
        }
    }, [servico, servicosDisponiveis]);

    // ✅ Função para buscar pets atualizada
    const fetchPets = async (userId: string) => {
        try {
            const q = query(collection(db, "cadastrarPet"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

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

            setLocalPets(petsList);

            // ✅ Se o pet selecionado foi excluído, limpe a seleção
            if (petSelecionado && !petsList.find(pet => pet.id === petSelecionado.id)) {
                setPetSelecionado(null);
            }
        } catch (error: any) {
            console.error("Erro ao carregar pets: ", error);
        }
    };

    // ✅ Verifica autenticação e carrega pets
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setCurrentUser(user);
            fetchPets(user.uid);
        }
    }, []);

    // ✅ Recarrega quando a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            if (currentUser) {
                fetchPets(currentUser.uid);
            }
        }, [currentUser])
    );

    const handleDateSelect = (date: Date) => {
        setDataAgendamento(date);
        setShowCustomCalendar(false);
    };

    return (
        <>
            <Text style={style.sectionTitle}>Agendar Serviço</Text>
            <Text style={style.sectionSubtitle}>Selecione o tipo de serviço, a data e o horário desejados para o seu pet.</Text>

            <View style={style.formContainer}>
                {/* Serviço - AGORA DINÂMICO */}
                <View style={[style.inputGroup, style.serviceDropdownContainer]}>
                    <Text style={style.inputLabel}>Tipo de Serviço</Text>
                    <TouchableOpacity
                        style={style.selectInput}
                        onPress={handleOpenServiceModal}
                        disabled={loadingServicos}
                    >
                        <Ionicons
                            name={(selectedService?.icon ?? "cut-outline") as React.ComponentProps<typeof Ionicons>['name']}
                            size={20}
                            color={themes.colors.secundary}
                            style={style.inputIcon}
                        />

                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            minHeight: 40,
                        }}>
                            {loadingServicos ? (
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flex: 1,
                                    minHeight: 40,
                                }}>
                                    <View style={{ marginTop: 45 }}>
                                        <PawLoader size={15} color={themes.colors.secundary} />
                                    </View>
                                    <Text style={{
                                        marginLeft: 8,
                                        color: '#888',
                                        fontSize: 12,
                                        fontWeight: '400',
                                        marginTop: 8 // Ajuste o texto também se necessário
                                    }}>
                                    </Text>
                                </View>
                            ) : selectedService ? (
                                <Text
                                    style={[
                                        style.selectInputText,
                                        {
                                            color: themes.colors.secundary,
                                            fontWeight: '600',
                                            textAlignVertical: 'center',
                                            includeFontPadding: false,
                                            lineHeight: 20,
                                        },
                                    ]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {selectedService.name} • R$ {selectedService.price} • {selectedService.duration}
                                </Text>
                            ) : (
                                <Text
                                    style={[
                                        style.selectInputText,
                                        {
                                            color: '#888',
                                            fontWeight: '400',
                                            textAlignVertical: 'center',
                                            includeFontPadding: false,
                                            lineHeight: 20,
                                        }
                                    ]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    Escolha o Serviço...
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Modal de Seleção de Serviços - AGORA COM DADOS DINÂMICOS */}
                <ServiceSelectorModal
                    visible={showServiceList}
                    services={servicosDisponiveis}
                    selectedService={selectedService}
                    onSelectService={handleSelectServiceCard}
                    onConfirm={(service) => {
                        if (service) {
                            setSelectedService(service);
                            setServico(service.name);
                            setServicoSelecionado(service);
                        }
                        setShowServiceList(false);
                    }}
                    onClose={() => setShowServiceList(false)}
                />

                {/* Data e Pet lado a lado */}
                <View style={style.dateTimeContainer}>
                    {/* Data - AGORA COM CALENDÁRIO CUSTOMIZADO */}
                    <View style={[style.inputGroup, style.halfInput]}>
                        <Text style={style.inputLabel}>Data</Text>
                        <TouchableOpacity
                            style={style.selectInput}
                            onPress={() => setShowCustomCalendar(true)}
                        >
                            <MaterialIcons
                                name="date-range"
                                size={20}
                                color={themes.colors.secundary}
                                style={style.inputIcon}
                            />
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

                    {/* Pet */}
                    <View style={[style.inputGroup, style.halfInput]}>
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
                </View>

                {/* Calendário Customizado */}
                <CustomCalendar
                    visible={showCustomCalendar}
                    onClose={() => setShowCustomCalendar(false)}
                    onDateSelect={handleDateSelect}
                    selectedDate={dataAgendamento}
                />

                {/* Horários Disponíveis */}
                <View style={style.inputGroup}>
                    <Text style={style.inputLabel}>
                        Horários Disponíveis {unidadeSelecionada ? `- ${unidadeSelecionada.nome}` : ''}
                    </Text>

                    {!unidadeSelecionada ? (
                        <Text style={{ color: '#888', textAlign: 'center', marginVertical: 20 }}>
                            Selecione uma unidade para ver os horários disponíveis
                        </Text>
                    ) : horariosDinamicos.length === 0 ? (
                        <Text style={{ color: '#888', textAlign: 'center', marginVertical: 20 }}>
                            Nenhum horário disponível para este dia
                        </Text>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}
                        >
                            {horariosDinamicos.map((hora) => {
                                const isOcupado = horariosOcupados.includes(hora);
                                const isPassado = isHorarioPassado(dataAgendamento, hora, diasBloqueados, feriados);
                                const isDesabilitado = isOcupado || isPassado;
                                const isSelecionado = formatTime(dataAgendamento) === hora;

                                return (
                                    <TouchableOpacity
                                        key={hora}
                                        disabled={isDesabilitado}
                                        onPress={() => {
                                            if (!isDesabilitado) {
                                                const [h, m] = hora.split(':');
                                                const novaData = new Date(dataAgendamento);
                                                novaData.setHours(Number(h));
                                                novaData.setMinutes(Number(m));
                                                setDataAgendamento(novaData);
                                            }
                                        }}
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 18,
                                            borderRadius: 8,
                                            backgroundColor: isSelecionado
                                                ? themes.colors.secundary
                                                : isDesabilitado
                                                    ? '#ccc'
                                                    : '#fff',
                                            borderWidth: 1,
                                            borderColor: isSelecionado
                                                ? themes.colors.secundary
                                                : '#ddd',
                                            opacity: isDesabilitado ? 0.6 : 1,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: isDesabilitado
                                                    ? '#999'
                                                    : isSelecionado
                                                        ? '#fff'
                                                        : themes.colors.corTexto,
                                                fontWeight: isSelecionado ? '700' : '500',
                                            }}
                                        >
                                            {hora}
                                            {isOcupado && " 🔒"}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>

                {/* Modal de Pets */}
                <PetSelectorModal
                    visible={showPetModal}
                    pets={localPets}
                    onSelectPet={(pet) => {
                        setPetSelecionado(pet);
                        setShowPetModal(false);
                    }}
                    onClose={() => setShowPetModal(false)}
                />

                {/* Unidades - AGORA DINÂMICO */}
                <View style={style.inputGroup}>
                    <Text style={style.inputLabel}>Selecione a Unidade</Text>

                    {loadingUnidades ? (
                        <View style={{ alignItems: 'center', marginVertical: 20 }}>
                            <PawLoader size={40} color={themes.colors.secundary} />
                            <Text style={{ color: '#888', marginTop: 10 }}>
                                {/* Carregando unidades... */}
                            </Text>
                        </View>
                    ) : unidades.length === 0 ? (
                        <Text style={{ color: '#888', textAlign: 'center', marginVertical: 20 }}>
                            Nenhuma unidade disponível no momento
                        </Text>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexDirection: "row", gap: 16, paddingVertical: 10 }}
                        >
                            {unidades.map((unidade, index) => (
                                <TouchableOpacity
                                    key={unidade.id || index} // ✅ USA id DO FIREBASE
                                    activeOpacity={0.9}
                                    onPress={() => setUnidadeSelecionada(unidade)}
                                    style={{
                                        width: 250,
                                        backgroundColor:
                                            unidadeSelecionada?.id === unidade.id // ✅ COMPARA POR id
                                                ? themes.colors.secundary
                                                : "#fff",
                                        borderRadius: 16,
                                        overflow: "hidden",
                                        borderWidth: 2,
                                        borderColor:
                                            unidadeSelecionada?.id === unidade.id // ✅ COMPARA POR id
                                                ? themes.colors.corTexto
                                                : "#ddd",
                                        shadowColor: "#000",
                                        shadowOpacity: 0.15,
                                        shadowRadius: 4,
                                        elevation: 3,
                                    }}
                                >
                                    <View style={{ padding: 10 }}>
                                        <Text
                                            style={{
                                                fontWeight: "700",
                                                fontSize: 16,
                                                color:
                                                    unidadeSelecionada?.id === unidade.id
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
                                                    unidadeSelecionada?.id === unidade.id
                                                        ? "#f1f1f1"
                                                        : "#777",
                                            }}
                                        >
                                            {unidade.endereco}
                                        </Text>
                                    </View>

                                    {/* DEEP LINK (MAPS) */}
                                    <TouchableOpacity
                                        style={{ height: 140 }}
                                        onPress={() => openInGoogleMaps(unidade.lat, unidade.lng, unidade.nome)}
                                    >
                                        <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderTopWidth: 1,
                                            borderTopColor: unidadeSelecionada?.id === unidade.id ? '#d1e7ff' : '#e9ecef',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}>
                                            <Image
                                                source={require('../../assets/map-background.png')}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    position: 'absolute'
                                                }}
                                                resizeMode="cover"
                                            />

                                            <View style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: unidadeSelecionada?.id === unidade.id
                                                    ? 'rgba(0, 0, 0, 0.7)'
                                                    : ''
                                            }} />

                                            <View style={{
                                                alignItems: 'center',
                                                zIndex: 1
                                            }}>
                                                <Ionicons
                                                    name="map"
                                                    size={32}
                                                    color="#fff"
                                                />
                                                <Text style={{
                                                    marginTop: 8,
                                                    fontSize: 14,
                                                    fontWeight: '600',
                                                    color: '#fff',
                                                    textAlign: 'center'
                                                }}>
                                                    Ver no Mapa
                                                </Text>
                                                <Text style={{
                                                    fontSize: 12,
                                                    color: 'rgba(255,255,255,0.9)',
                                                    marginTop: 4,
                                                    textAlign: 'center'
                                                }}>
                                                    Toque para navegar
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Botão de Agendar */}
                <TouchableOpacity
                    style={[
                        style.button,
                        {
                            opacity: (!selectedService || !petSelecionado || !unidadeSelecionada || horariosOcupados.includes(formatTime(dataAgendamento))) ? 0.6 : 1
                        }
                    ]}
                    onPress={handleAgendar}
                    disabled={!selectedService || !petSelecionado || !unidadeSelecionada || horariosOcupados.includes(formatTime(dataAgendamento))}
                >
                    <Text style={style.buttonText}>
                        {horariosOcupados.includes(formatTime(dataAgendamento))
                            ? "Horário Indisponível"
                            : "Confirmar Agendamento"
                        }
                    </Text>
                    <MaterialIcons name="done-all" size={24} color="#fff" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            </View>
        </>
    );
};