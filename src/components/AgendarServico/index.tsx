import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    Image,
    Linking
} from 'react-native';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import { style } from "./styles"
import { CustomCalendar } from "../CustomCalendar";

interface AgendarServicoProps {
    servico: string;
    setServico: (servico: string) => void;
    dataAgendamento: Date;
    setDataAgendamento: (date: Date) => void;
    // REMOVA estas linhas:
    // showDatePicker: boolean;
    // setShowDatePicker: (show: boolean) => void;
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
    getPetImage: (type: string) => any;
    formatDate: (date: Date) => string;
    formatTime: (date: Date) => string;
    horariosFixos: string[];
    horariosOcupados: string[];
}

const SERVICOS = [
    'Banho e Tosa',
    'Somente Tosa',
    'Corte de Unha',
    'Hidratação',
    'Consulta Veterinária',
];

const isHorarioPassado = (dataAgendamento: Date, horario: string): boolean => {
    const hoje = new Date();
    const dataSelecionada = new Date(dataAgendamento);

    const mesmoDia =
        dataSelecionada.getDate() === hoje.getDate() &&
        dataSelecionada.getMonth() === hoje.getMonth() &&
        dataSelecionada.getFullYear() === hoje.getFullYear();

    if (!mesmoDia) {
        return false;
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
    pets,
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

    const handleDateSelect = (date: Date) => {
        setDataAgendamento(date);
        setShowCustomCalendar(false);
    };

    return (
        <>
            <Text style={style.sectionTitle}>Agendar Serviço</Text>
            <Text style={style.sectionSubtitle}>Selecione o tipo de serviço, a data e o horário desejados para o seu pet.</Text>

            <View style={style.formContainer}>
                {/* Serviço */}
                <View style={[style.inputGroup, style.serviceDropdownContainer]}>
                    <Text style={style.inputLabel}>Tipo de Serviço</Text>
                    <TouchableOpacity
                        style={style.selectInput}
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
                            onPressOut={() => setShowServiceList(false)}
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
                                            width: '30%',
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
                <TouchableOpacity style={style.button} onPress={handleAgendar}>
                    <Text style={style.buttonText}>Confirmar Agendamento</Text>
                    <MaterialIcons name="done-all" size={24} color="#fff" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            </View>
        </>
    );
};