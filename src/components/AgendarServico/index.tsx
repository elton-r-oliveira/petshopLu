import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Image, Linking } from 'react-native';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import { style } from "./styles"
import { CustomCalendar } from "../CustomCalendar";
import PetSelectorModal from "../PetSelectorModal";
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../../lib/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { User } from 'firebase/auth';
import ServiceSelectorModal, { Service } from "../ServiceSelectorModal";

export interface AgendarServicoProps {
    servico: string;
    setServico: (servico: string) => void;
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
    unidades: any[];
    handleSelectService: (service: string) => void;
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

const SERVICOS: Service[] = [
    {
        id: '1',
        name: 'Banho e Tosa',
        price: '80,00',
        duration: '2-3 horas',
        icon: 'cut-outline', 
        description: 'Banho completo + tosa higiênica ou tosa completa'
    },
    {
        id: '2',
        name: 'Somente Tosa',
        price: '60,00',
        duration: '1-2 horas',
        icon: 'create-outline', 
        description: 'Apenas tosa higiênica ou completa'
    },
    {
        id: '3',
        name: 'Corte de Unha',
        price: '25,00',
        duration: '30 min',
        icon: 'hand-right-outline', 
        description: 'Corte e lixamento das unhas'
    },
    {
        id: '4',
        name: 'Hidratação',
        price: '45,00',
        duration: '1 hora',
        icon: 'water-outline', 
        description: 'Hidratação profunda para pelos'
    },
    {
        id: '5',
        name: 'Consulta Veterinária',
        price: '120,00',
        duration: '45 min',
        icon: 'medical-outline', 
        description: 'Consulta com veterinário especializado'
    },
    {
        id: '6',
        name: 'Limpeza de Ouvidos',
        price: '35,00',
        duration: '20 min',
        icon: 'ear-outline', 
        description: 'Limpeza e higienização dos ouvidos'
    },
    {
        id: '7',
        name: 'Escovação Dental',
        price: '40,00',
        duration: '25 min',
        icon: 'happy-outline', 
        description: 'Escovação e limpeza dental'
    },
];

// Adicione esta função para verificar se o dia está bloqueado
const isDiaBloqueado = (data: Date): boolean => {
    const diaDaSemana = data.getDay();
    const dateStr = data.toISOString().split('T')[0];

    // Lista de feriados (deve ser a mesma do CustomCalendar)
    const feriadosEDiasBloqueados = [
        '2024-12-25', // Natal
        '2024-12-31', // Véspera de Ano Novo
        '2025-01-01', // Ano Novo
        '2025-04-18', // Sexta-feira Santa
        '2025-04-21', // Tiradentes
        '2025-05-01', // Dia do Trabalho
        '2025-09-07', // Independência do Brasil
        '2025-10-12', // Nossa Senhora Aparecida
        '2025-11-02', // Finados
        '2025-11-15', // Proclamação da República
        '2025-11-20',
    ];

    const isDomingo = diaDaSemana === 0;
    const isFeriado = feriadosEDiasBloqueados.includes(dateStr);

    return isDomingo || isFeriado;
};

const isHorarioPassado = (dataAgendamento: Date, horario: string): boolean => {
    const hoje = new Date();
    const dataSelecionada = new Date(dataAgendamento);

    // VERIFICAÇÃO 1: É domingo ou feriado?
    if (isDiaBloqueado(dataSelecionada)) {
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
    showServiceList,
    setShowServiceList,
    petSelecionado,
    setPetSelecionado,
    showPetModal,
    setShowPetModal,
    unidadeSelecionada,
    setUnidadeSelecionada,
    unidades,
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
            const service = SERVICOS.find(s => s.name === servico);
            setSelectedService(service || null);
        } else {
            setSelectedService(null);
        }
    }, [servico]);

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
                {/* Serviço - AGORA COM CARDS */}
                <View style={[style.inputGroup, style.serviceDropdownContainer]}>
                    <Text style={style.inputLabel}>Tipo de Serviço</Text>
                    <TouchableOpacity
                        style={style.selectInput}
                        onPress={handleOpenServiceModal}
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
                            {selectedService ? (
                                // TUDO NA MESMA LINHA E ALINHADO VERTICALMENTE
                                <Text
                                    style={[
                                        style.selectInputText,
                                        {
                                            color: themes.colors.secundary,
                                            fontWeight: '600',
                                            textAlignVertical: 'center', // Adiciona alinhamento vertical
                                            includeFontPadding: false,   // Remove padding extra
                                            lineHeight: 20,              // Altura de linha consistente
                                        },
                                    ]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {selectedService.name} • R$ {selectedService.price} • {selectedService.duration}
                                </Text>
                            ) : (
                                // Texto centralizado quando não tem serviço
                                <Text
                                    style={[
                                        style.selectInputText,
                                        {
                                            color: '#888',
                                            fontWeight: '400',
                                            textAlignVertical: 'center',
                                            includeFontPadding: false,
                                            lineHeight: 20, // Mesma altura de linha
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

                {/* Modal de Seleção de Serviços */}
                <ServiceSelectorModal
                    visible={showServiceList}
                    services={SERVICOS}
                    selectedService={selectedService}
                    onSelectService={handleSelectServiceCard} // só atualiza selectedService
                    onConfirm={(service) => {
                        if (service) {
                            setSelectedService(service);   // garante que o state esteja atualizado
                            setServico(service.name);      // preenche o input com o nome do serviço
                        }
                        setShowServiceList(false);       // fecha o modal só aqui
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
                    <Text style={style.inputLabel}>Horários Disponíveis</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}
                    >
                        {horariosFixos.map((hora) => {
                            const isOcupado = horariosOcupados.includes(hora);
                            const isPassado = isHorarioPassado(dataAgendamento, hora);
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
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
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

                {/* Unidades */}
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
                                        borderTopColor: unidadeSelecionada?.nome === unidade.nome ? '#d1e7ff' : '#e9ecef',
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
                                            backgroundColor: unidadeSelecionada?.nome === unidade.nome
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
                </View>

                {/* Botão de Agendar */}
                <TouchableOpacity
                    style={[
                        style.button,
                        {
                            opacity: (!selectedService || !petSelecionado || !unidadeSelecionada) ? 0.6 : 1
                        }
                    ]}
                    onPress={handleAgendar}
                    disabled={!selectedService || !petSelecionado || !unidadeSelecionada}
                >
                    <Text style={style.buttonText}>Confirmar Agendamento</Text>
                    <MaterialIcons name="done-all" size={24} color="#fff" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            </View>
        </>
    );
};