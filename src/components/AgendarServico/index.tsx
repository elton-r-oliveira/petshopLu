// components/AgendarServico.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    Image
} from 'react-native';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from "react-native-maps";
import { style } from "./styles"

interface AgendarServicoProps {
    servico: string;
    setServico: (servico: string) => void;
    dataAgendamento: Date;
    setDataAgendamento: (date: Date) => void;
    showDatePicker: boolean;
    setShowDatePicker: (show: boolean) => void;
    showTimePicker: boolean;
    setShowTimePicker: (show: boolean) => void;
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
    onChangeTime: (event: any, selectedTime?: Date) => void;
    handleAgendar: () => void;
    getPetImage: (type: string) => any;
    formatDate: (date: Date) => string;
    formatTime: (date: Date) => string;
}

const SERVICOS = [
    'Banho e Tosa',
    'Somente Tosa',
    'Corte de Unha',
    'Hidratação',
    'Consulta Veterinária',
];

export const AgendarServico: React.FC<AgendarServicoProps> = ({
    servico,
    setServico,
    dataAgendamento,
    setDataAgendamento,
    showDatePicker,
    setShowDatePicker,
    showTimePicker,
    setShowTimePicker,
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
    onChangeTime,
    handleAgendar,
    getPetImage,
    formatDate,
    formatTime
}) => {
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

                {/* Data e Horário */}
                <View style={style.dateTimeContainer}>
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

                {/* Pickers */}
                {showDatePicker && (
                    <DateTimePicker
                        value={dataAgendamento}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                        minimumDate={new Date()}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={dataAgendamento}
                        mode="time"
                        display="default"
                        onChange={onChangeTime}
                    />
                )}

                {/* Pet */}
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
    );
};