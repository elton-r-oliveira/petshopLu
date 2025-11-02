import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    Image,
    StyleSheet,
    Linking,
    Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { themes } from "../../global/themes";
import { style } from "./styles"

interface ModalDetalhesAgendamentoProps {
    modalDetalhesVisible: boolean;
    setModalDetalhesVisible: (visible: boolean) => void;
    agendamentoSelecionado: any;
    unidades: any[];
    getPetImage: (type: string) => any;
    onCancelarAgendamento?: (agendamentoId: string) => void;
}

// Replicando as funções auxiliares para que o modal seja auto-suficiente
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pendente':
            return themes.colors.warning || '#FFC300';
        case 'confirmado':
            return themes.colors.success || '#4CAF50';
        case 'concluído':
            return themes.colors.bgScreen || '#3F51B5';
        case 'cancelado':
            return themes.colors.cancelado || '#F44336';
        default:
            return '#666';
    }
};

const getServiceIcon = (service: string) => {
    const lowerService = service.toLowerCase();
    if (lowerService.includes('tosa') || lowerService.includes('banho')) {
        return 'content-cut';
    }
    if (lowerService.includes('vacina') || lowerService.includes('consulta')) {
        return 'needle';
    }
    return 'star-four-points-outline';
};

// Função para formatar telefone
const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
    }
    return phone;
};

// Função para abrir WhatsApp
const openWhatsApp = (phone: string) => {
    const cleanedPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/55${cleanedPhone}`;
    Linking.openURL(url).catch(err => console.error('Erro ao abrir WhatsApp:', err));
};

// Função para fazer ligação
const makePhoneCall = (phone: string) => {
    const url = `tel:${phone}`;
    Linking.openURL(url).catch(err => console.error('Erro ao fazer ligação:', err));
};

// Função para abrir no Google Maps
const openInGoogleMaps = (lat: number, lng: number, label: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(label)}`;
    Linking.openURL(url);
};

export const ModalDetalhesAgendamento: React.FC<ModalDetalhesAgendamentoProps> = ({
    modalDetalhesVisible,
    setModalDetalhesVisible,
    agendamentoSelecionado,
    unidades,
    getPetImage,
    onCancelarAgendamento
}) => {
    if (!agendamentoSelecionado) return null;

    const unidade = unidades.find(u => u.nome === agendamentoSelecionado.unidade);
    const statusColor = getStatusColor(agendamentoSelecionado.status);
    const serviceIconName = getServiceIcon(agendamentoSelecionado.service);

    // CORREÇÃO: Garantir que é um objeto Date válido
    let date: Date | null = null;

    if (agendamentoSelecionado.dataHoraAgendamento instanceof Date) {
        date = agendamentoSelecionado.dataHoraAgendamento;
    } else if (agendamentoSelecionado.dataHoraAgendamento &&
        agendamentoSelecionado.dataHoraAgendamento.toDate) {
        date = agendamentoSelecionado.dataHoraAgendamento.toDate();
    } else if (agendamentoSelecionado.dataHoraAgendamento) {
        date = new Date(agendamentoSelecionado.dataHoraAgendamento);
    }

    const formattedDate = date
        ? date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        : 'Data Indisponível';

    const formattedTime = date
        ? date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
        })
        : '';

    // Use os telefones salvos diretamente do agendamento
    const telefoneUnidade = agendamentoSelecionado.unidadeTelefone;
    const whatsappUnidade = agendamentoSelecionado.unidadeWhatsapp;

    const hasTelefone = telefoneUnidade && telefoneUnidade.trim() !== '';
    const hasWhatsapp = whatsappUnidade && whatsappUnidade.trim() !== '';

    const telefoneFormatado = hasTelefone ? formatPhoneNumber(telefoneUnidade) : '';
    const whatsappFormatado = hasWhatsapp ? formatPhoneNumber(whatsappUnidade) : '';

    // Função para mostrar alerta de confirmação de cancelamento
    const handleCancelarAgendamento = () => {
        Alert.alert(
            "Cancelar Agendamento",
            "Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.",
            [
                {
                    text: "Manter Agendamento",
                    style: "cancel"
                },
                {
                    text: "Cancelar Agendamento",
                    style: "destructive",
                    onPress: () => {
                        if (onCancelarAgendamento && agendamentoSelecionado.id) {
                            onCancelarAgendamento(agendamentoSelecionado.id);
                        }
                        setModalDetalhesVisible(false);
                    }
                }
            ]
        );
    };

    // Verificar se o agendamento pode ser cancelado (não pode estar cancelado ou concluído)
    const podeCancelar = agendamentoSelecionado.status !== 'cancelado' &&
        agendamentoSelecionado.status !== 'concluído';

    return (
        <Modal
            visible={modalDetalhesVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setModalDetalhesVisible(false)}
        >
            <View style={style.overlay}>
                <View style={style.modalContent}>
                    {/* Header do Modal */}
                    <View style={style.modalHeader}>
                        <Text style={style.modalTitle}>
                            Detalhes do Agendamento
                        </Text>
                        <TouchableOpacity onPress={() => setModalDetalhesVisible(false)} style={style.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                        {/* Status e Serviço Destacados */}
                        <View style={style.highlightSection}>
                            <View style={style.serviceHighlight}>
                                <MaterialCommunityIcons name={serviceIconName} size={24} color={themes.colors.secundary} />
                                <Text style={style.serviceHighlightText}>
                                    {agendamentoSelecionado.service}
                                </Text>
                            </View>

                            <View style={[style.statusPill, { backgroundColor: statusColor }]}>
                                <Text style={style.statusPillText}>
                                    {agendamentoSelecionado.status}
                                </Text>
                            </View>
                        </View>

                        <View style={style.sectionDivider} />

                        {/* Pet com Foto - PRIMEIRA SEÇÃO */}
                        <View style={style.section}>
                            <Text style={style.sectionTitle}>Pet Agendado</Text>
                            <View style={style.petCard}>
                                <Image
                                    source={getPetImage(agendamentoSelecionado.petAnimalType || "dog")}
                                    style={style.petImage}
                                />
                                <Text style={style.petName}>
                                    {agendamentoSelecionado.petNome || 'Pet não especificado'}
                                </Text>
                            </View>
                        </View>

                        {/* VALOR E TEMPO - EM UMA LINHA SÓ */}
                        {(agendamentoSelecionado.preco || agendamentoSelecionado.tempoServico) && (
                            <View style={style.section}>
                                <Text style={style.sectionTitle}>Informações do Serviço</Text>
                                <View style={style.priceTimeRow}>
                                    {/* Valor */}
                                    {agendamentoSelecionado.preco && (
                                        <View style={style.priceTimeItem}>
                                            <MaterialCommunityIcons
                                                name="cash"
                                                size={20}
                                                color={themes.colors.success || '#4CAF50'}
                                                style={style.priceTimeIcon}
                                            />
                                            <View style={style.priceTimeContent}>
                                                <Text style={style.priceTimeLabel}>Valor</Text>
                                                <Text style={[style.priceTimeValue, { color: themes.colors.success || '#4CAF50' }]}>
                                                    R$ {agendamentoSelecionado.preco}
                                                </Text>
                                            </View>
                                        </View>
                                    )}

                                    {/* Separador */}
                                    {agendamentoSelecionado.preco && agendamentoSelecionado.tempoServico && (
                                        <View style={style.separator} />
                                    )}

                                    {/* Tempo do Serviço */}
                                    {agendamentoSelecionado.tempoServico && (
                                        <View style={style.priceTimeItem}>
                                            <MaterialCommunityIcons
                                                name="clock-outline"
                                                size={20}
                                                color={themes.colors.info || '#2196F3'}
                                                style={style.priceTimeIcon}
                                            />
                                            <View style={style.priceTimeContent}>
                                                <Text style={style.priceTimeLabel}>Tempo</Text>
                                                <Text style={[style.priceTimeValue, { color: themes.colors.info || '#2196F3' }]}>
                                                    {agendamentoSelecionado.tempoServico}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Detalhes de Data e Horário */}
                        <View style={style.section}>
                            <Text style={style.sectionTitle}>Data e Horário</Text>
                            <View style={style.priceTimeRow}>
                                {/* Data */}
                                <View style={style.priceTimeItem}>
                                    <MaterialCommunityIcons
                                        name="calendar-month"
                                        size={20}
                                        color={themes.colors.secundary || '#B8860B'}
                                        style={style.priceTimeIcon}
                                    />
                                    <View style={style.priceTimeContent}>
                                        <Text style={style.priceTimeLabel}>Data</Text>
                                        <Text style={[style.priceTimeValue, { color: themes.colors.secundary || '#B8860B' }]}>
                                            {formattedDate}
                                        </Text>
                                    </View>
                                </View>

                                {/* Separador */}
                                <View style={style.separator} />

                                {/* Horário */}
                                <View style={style.priceTimeItem}>
                                    <Ionicons
                                        name="time"
                                        size={20}
                                        color={themes.colors.secundary || '#B8860B'}
                                        style={style.priceTimeIcon}
                                    />
                                    <View style={style.priceTimeContent}>
                                        <Text style={style.priceTimeLabel}>Horário</Text>
                                        <Text style={[style.priceTimeValue, { color: themes.colors.secundary || '#B8860B' }]}>
                                            {formattedTime}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>


                        {/* Local */}
                        {unidade?.lat && unidade?.lng ? (
                            <View style={style.section}>
                                <Text style={style.sectionTitle}>Local da Unidade</Text>
                                <View style={style.locationCard}>
                                    <View style={style.locationDetails}>
                                        <Text style={style.locationName}>{unidade.nome}</Text>
                                        <Text style={style.locationAddress}>{unidade.endereco}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={style.mapContainer}
                                        onPress={() => openInGoogleMaps(unidade.lat, unidade.lng, unidade.nome)}
                                    >
                                        <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 8,
                                            borderWidth: 2,
                                            borderColor: '#e9ecef',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            height: 140
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
                                                backgroundColor: 'rgba(0, 0, 0, 0.4)'
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
                                                    fontSize: 16,
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
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginTop: 12,
                                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 6,
                                                    borderRadius: 20
                                                }}>
                                                    <Ionicons name="navigate" size={16} color="#fff" />
                                                    <Text style={{
                                                        fontSize: 12,
                                                        color: '#fff',
                                                        fontWeight: '500',
                                                        marginLeft: 6
                                                    }}>
                                                        Rotas • Navegação • Horários
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={style.section}>
                                <Text style={[style.sectionTitle, { color: '#999' }]}>
                                    Local não disponível
                                </Text>
                            </View>
                        )}

                        {/* Contato da Unidade */}
                        <View style={style.section}>
                            <Text style={style.sectionTitle}>Contato</Text>
                            <View style={style.detailsBlock}>
                                <TouchableOpacity
                                    style={style.detailItemContainer}
                                    onPress={() => hasTelefone && makePhoneCall(telefoneUnidade)}
                                    disabled={!hasTelefone}
                                >
                                    <MaterialCommunityIcons
                                        name="phone-outline"
                                        size={22}
                                        color={hasTelefone ? (themes.colors.secundary || '#B8860B') : '#CCC'}
                                        style={style.detailIcon}
                                    />
                                    <View style={style.detailTextContent}>
                                        <Text style={style.detailLabel}>Telefone</Text>
                                        <Text style={[
                                            style.detailValue,
                                            !hasTelefone && style.disabledText
                                        ]}>
                                            {hasTelefone ? telefoneFormatado : 'Telefone não disponível'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={style.detailItemContainer}
                                    onPress={() => hasWhatsapp && openWhatsApp(whatsappUnidade)}
                                    disabled={!hasWhatsapp}
                                >
                                    <MaterialCommunityIcons
                                        name="whatsapp"
                                        size={22}
                                        color={hasWhatsapp ? "#25D366" : '#CCC'}
                                        style={style.detailIcon}
                                    />
                                    <View style={style.detailTextContent}>
                                        <Text style={style.detailLabel}>WhatsApp</Text>
                                        <Text style={[
                                            style.detailValue,
                                            !hasWhatsapp && style.disabledText
                                        ]}>
                                            {hasWhatsapp ? whatsappFormatado : 'WhatsApp não disponível'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Botão Cancelar Agendamento */}
                        {podeCancelar && (
                            <TouchableOpacity
                                style={style.cancelButton}
                                onPress={handleCancelarAgendamento}
                            >
                                <Text style={style.cancelButtonText}>
                                    CANCELAR AGENDAMENTO
                                </Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>

                    {/* Botão Fechar */}
                    <TouchableOpacity
                        style={style.closeButtonPrimary}
                        onPress={() => setModalDetalhesVisible(false)}
                    >
                        <Text style={style.closeButtonText}>
                            Fechar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};