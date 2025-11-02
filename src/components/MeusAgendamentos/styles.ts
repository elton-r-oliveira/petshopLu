import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

// --- ESTILOS ---
export const style = StyleSheet.create({
    container: {
        // Estilos do container principal, se houver
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
        marginTop: 15,
        marginBottom: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#fff',
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    // --- Header (Serviço e Status) - CORRIGIDO ---
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    serviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
        minWidth: 0, // IMPORTANTE: Permite que o flex shrink funcione
    },
    serviceText: {
        fontSize: 18,
        fontWeight: '700',
        color: themes.colors.secundary || '#B8860B',
        marginLeft: 8,
        flex: 1, // Ocupa o espaço restante
        flexShrink: 1, // Permite encolher se necessário
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 15,
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        flexShrink: 0, // IMPEDE que o status encolha
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 5,
    },
    statusText: {
        fontSize: 12, // Reduzido para caber melhor
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 10,
    },
    // --- Detalhes (Pet, Data, Local) ---
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 15,
        color: '#777',
        marginLeft: 6,
        marginRight: 4,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        flex: 1,
    },
    arrow: {
        marginLeft: 'auto',
    }
});