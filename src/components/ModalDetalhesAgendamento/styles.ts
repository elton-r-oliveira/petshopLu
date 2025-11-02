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
        flex: 1,
        marginRight: 10,
    },
    closeButton: {
        padding: 5,
        flexShrink: 0,
    },
    // --- Destaque Status/Serviço - AGORA IGUAL AO MEUSAGENDAMENTOS ---
    highlightSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    serviceHighlight: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
        minWidth: 0,
    },
    serviceHighlightText: {
        fontSize: 18, // Mesmo tamanho do MeusAgendamentos
        fontWeight: '700',
        color: themes.colors.secundary || '#B8860B',
        marginLeft: 10,
        flex: 1,
        flexShrink: 1,
    },
    // STATUS PILL IDÊNTICO AO MEUSAGENDAMENTOS
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        flexShrink: 0,
    },
    statusPillText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    sectionDivider: {
        height: 1,
        backgroundColor: '#eee', // Mesma cor do MeusAgendamentos
        marginBottom: 10,
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
        flexShrink: 0,
    },
    petName: {
        fontSize: 18,
        fontWeight: '600',
        color: themes.colors.corTexto || '#333',
        flex: 1,
        flexShrink: 1,
    },
    
    // --- NOVOS ESTILOS PARA VALOR E TEMPO EM LINHA ---
    priceTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 15,
        justifyContent: 'space-between',
    },
    priceTimeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    priceTimeIcon: {
        marginRight: 10,
        flexShrink: 0,
    },
    priceTimeContent: {
        flexDirection: 'column',
        flex: 1,
    },
    priceTimeLabel: {
        fontSize: 12,
        color: '#777',
        fontWeight: '500',
        marginBottom: 2,
    },
    priceTimeValue: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        flexShrink: 1,
    },
    separator: {
        width: 1,
        height: 30,
        backgroundColor: '#ddd',
        marginHorizontal: 15,
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
        minWidth: 0,
    },
    detailIcon: {
        marginRight: 15,
        flexShrink: 0,
    },
    detailTextContent: {
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
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
        flex: 1,
        flexShrink: 1,
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
        flex: 1,
        flexShrink: 1,
    },
    locationAddress: {
        fontSize: 14,
        color: "#777",
        marginTop: 5,
        flex: 1,
        flexShrink: 1,
    },
    mapContainer: {
        height: 150,
        minWidth: 0,
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
        minWidth: 0,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        flexShrink: 1,
    },
    // --- Botão Principal ---
    closeButtonPrimary: {
        backgroundColor: themes.colors.secundary || '#B8860B',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        minWidth: 0,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        flexShrink: 1,
    },
});