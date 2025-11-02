import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

// --- ESTILOS ---
export const style = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        width: '100%',
        maxHeight: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 15
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: themes.colors.secundary || '#B8860B',
        flex: 1, // Permite que o título ocupe espaço
        marginRight: 10, // Espaço entre título e botão fechar
    },
    closeButton: {
        padding: 5,
        flexShrink: 0, // Impede que o botão encolha
    },
    // --- Destaque Status/Serviço - CORRIGIDO ---
    highlightSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Alinha ao topo para evitar desalinhamento
        paddingVertical: 10,
        marginBottom: 10,
    },
    serviceHighlight: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Ocupa espaço disponível
        marginRight: 8, // Espaço entre serviço e status
        minWidth: 0, // IMPORTANTE: Permite que o flex shrink funcione
    },
    serviceHighlightText: {
        fontSize: 20,
        fontWeight: '700',
        color: themes.colors.secundary || '#B8860B',
        marginLeft: 10,
        flex: 1, // Ocupa espaço restante
        flexShrink: 1, // Permite encolher se necessário
    },
    statusPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexShrink: 0, // IMPEDE que o status encolha
        minWidth: 0, // Importante para funcionar com flex
    },
    statusPillText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    sectionDivider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 10,
    },
    // --- Seção Geral ---
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#555',
        marginBottom: 10,
    },
    // --- Pet Card ---
    petCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 12
    },
    petImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        flexShrink: 0, // Impede que a imagem encolha
    },
    petName: {
        fontSize: 18,
        fontWeight: '600',
        color: themes.colors.corTexto || '#333',
        flex: 1, // Ocupa espaço restante
        flexShrink: 1, // Permite encolher se necessário
    },
    // --- Linha de Detalhes (Data/Contato) ---
    detailsBlock: {
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        paddingHorizontal: 15,
    },
    detailItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        minWidth: 0, // Importante para flexbox
    },
    detailIcon: {
        marginRight: 15,
        flexShrink: 0, // Impede que ícone encolha
    },
    detailTextContent: {
        flexDirection: 'column',
        flex: 1, // Ocupa espaço disponível
        minWidth: 0, // Importante para flexbox
    },
    detailLabel: {
        fontSize: 12,
        color: '#777',
        fontWeight: '500'
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1, // Ocupa espaço restante
        flexShrink: 1, // Permite encolher se necessário
    },
    disabledText: {
        color: '#999',
        fontStyle: 'italic'
    },
    // --- Localização e Mapa ---
    locationCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: themes.colors.secundary || '#B8860B',
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    locationDetails: {
        padding: 15,
        paddingBottom: 10,
    },
    locationName: {
        fontWeight: "700",
        fontSize: 18,
        color: themes.colors.secundary || '#B8860B',
        flex: 1, // Ocupa espaço disponível
        flexShrink: 1, // Permite encolher se necessário
    },
    locationAddress: {
        fontSize: 14,
        color: "#777",
        marginTop: 5,
        flex: 1, // Ocupa espaço disponível
        flexShrink: 1, // Permite encolher se necessário
    },
    mapContainer: {
        height: 150,
        minWidth: 0, // Importante para flexbox
    },
    map: {
        flex: 1
    },
    // --- Botão Cancelar ---
    cancelButton: {
        backgroundColor: '#F44336',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        minWidth: 0, // Importante para flexbox
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        flexShrink: 1, // Permite encolher se necessário
    },
    // --- Botão Principal ---
    closeButtonPrimary: {
        backgroundColor: themes.colors.secundary || '#B8860B',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        minWidth: 0, // Importante para flexbox
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        flexShrink: 1, // Permite encolher se necessário
    }
});