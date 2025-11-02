import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { themes } from "../../global/themes";
import { style } from './styles';

interface MeusAgendamentosProps {
    meusAgendamentos: any[];
    loadingAgendamentos: boolean;
    abrirDetalhesAgendamento: (agendamento: any) => void;
}

// Função utilitária para pegar a cor do status
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pendente':
            return themes.colors.warning || '#FFC300'; // Amarelo
        case 'confirmado':
            return themes.colors.success || '#4CAF50'; // Verde
        case 'concluído':
            return themes.colors.info || '#2196F3'; // Azul para concluído
        case 'cancelado':
            return themes.colors.cancelado || '#F44336'; // Vermelho
        default:
            return '#666';
    }
};

// Adicione ícones específicos para cada status
const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pendente':
            return 'clock-outline';
        case 'confirmado':
            return 'check-circle-outline';
        case 'concluído':
            return 'star-check-outline';
        case 'cancelado':
            return 'close-circle-outline';
        default:
            return 'information-outline';
    }
};

// Função utilitária para pegar o ícone do serviço
const getServiceIcon = (service: string) => {
    const lowerService = service.toLowerCase();
    if (lowerService.includes('tosa') || lowerService.includes('banho')) {
        return 'content-cut'; // Tesoura para Tosa/Banho
    }
    if (lowerService.includes('vacina') || lowerService.includes('consulta')) {
        return 'needle'; // Agulha para Saúde/Vacina
    }
    return 'star-four-points-outline'; // Ícone padrão
};

export const MeusAgendamentos: React.FC<MeusAgendamentosProps> = ({
    meusAgendamentos,
    loadingAgendamentos,
    abrirDetalhesAgendamento
}) => {
    return (
        <View style={style.container}>
            <Text style={style.sectionTitle}>Meus Agendamentos</Text>

            {loadingAgendamentos ? (
                <ActivityIndicator
                    size="large"
                    color={themes.colors.secundary}
                    style={{ marginTop: 20 }}
                />
            ) : meusAgendamentos.length === 0 ? (
                <Text style={style.emptyText}>
                    Você ainda não possui agendamentos.
                </Text>
            ) : (
                meusAgendamentos
                    .slice()
                    .sort((a, b) => {
                        const timeA = a.dataHoraAgendamento instanceof Date ? a.dataHoraAgendamento.getTime() : 0;
                        const timeB = b.dataHoraAgendamento instanceof Date ? b.dataHoraAgendamento.getTime() : 0;
                        return timeB - timeA; // mais recente primeiro
                    })
                    .map((item) => {
                        const statusColor = getStatusColor(item.status);
                        const statusIcon = getStatusIcon(item.status);
                        const serviceIcon = getServiceIcon(item.service);

                        const date = item.dataHoraAgendamento instanceof Date ? item.dataHoraAgendamento : null;
                        const formattedDate = date ? date.toLocaleDateString('pt-BR') : 'Data Indisponível';
                        const formattedTime = date ? date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={style.card}
                                onPress={() => abrirDetalhesAgendamento(item)}
                            >
                                <View style={style.headerRow}>
                                    <View style={style.serviceInfo}>
                                        <MaterialCommunityIcons
                                            name={serviceIcon}
                                            size={20}
                                            color={themes.colors.secundary || '#B8860B'}
                                        />
                                        <Text
                                            style={style.serviceText}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {item.service}
                                        </Text>
                                    </View>

                                    {/* Status fixo à direita */}
                                    <View style={[style.statusPill, {
                                        backgroundColor: statusColor + '20',
                                        borderColor: statusColor
                                    }]}>
                                        <MaterialCommunityIcons
                                            name={statusIcon}
                                            size={14}
                                            color={statusColor}
                                            style={{ marginRight: 4 }}
                                        />
                                        <Text style={[style.statusText, { color: statusColor }]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </View>

                                <View style={style.divider} />

                                {/* LINHA 2 e 3: Pet, Data e Local (Conteúdo Principal) */}
                                {item.petNome && (
                                    <View style={style.detailRow}>
                                        <MaterialCommunityIcons name="paw" size={18} color="#777" />
                                        <Text style={style.detailLabel}>Pet:</Text>
                                        <Text style={style.detailValue}>{item.petNome}</Text>
                                    </View>
                                )}

                                {date && (
                                    <View style={style.detailRow}>
                                        <MaterialCommunityIcons name="calendar-clock" size={18} color="#777" />
                                        <Text style={style.detailValue}> {formattedDate} às {formattedTime}</Text>
                                    </View>
                                )}

                                {item.unidade && (
                                    <View style={style.detailRow}>
                                        <MaterialCommunityIcons name="map-marker" size={18} color="#777" />
                                        <Text style={style.detailValue}> {item.unidade}</Text>
                                        <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" style={style.arrow} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })
            )}
        </View>
    );
};