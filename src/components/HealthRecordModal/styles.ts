import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.telaHome.fundo,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 22, 
        fontFamily: 'Inter_700Bold',
        marginTop: 50,
        marginBottom: 20,
        color: themes.colors.secundary,
        textAlign: 'left',
    },

    // Seletor de Pet
    petSelector: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    petSelectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    petSelectorImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    petSelectorInfo: {
        flex: 1,
    },
    petSelectorName: {
        fontSize: 16,
        fontFamily: 'Baloo2_700Bold',
        color: themes.colors.bgScreen,
    },
    petSelectorDetails: {
        fontSize: 14,
        color: '#666',
    },
    petSelectorPlaceholder: {
        flex: 1,
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
    },

    // Cards de Saúde
    healthCardsContainer: {
        marginBottom: 20,
    },
    healthCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    healthCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    healthIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    healthCardTitle: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Baloo2_700Bold',
        color: themes.colors.bgScreen,
    },
    addButton: {
        backgroundColor: themes.colors.secundary,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Itens dos registros
    recordItem: {
        backgroundColor: themes.colors.lightGray,
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    recordName: {
        fontSize: 16,
        fontFamily: 'Baloo2_600SemiBold',
        color: themes.colors.bgScreen,
        marginBottom: 5,
    },
    recordDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    recordDate: {
        fontSize: 12,
        color: '#666',
    },
    recordNextDate: {
        fontSize: 12,
        color: themes.colors.secundary,
        fontFamily: 'Baloo2_600SemiBold',
    },
    recordNotes: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
        marginTop: 5,
    },

    // Estados vazios
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
        paddingVertical: 10,
    },
    emptyStateText: {
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
        paddingVertical: 30,
        fontSize: 16,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Baloo2_700Bold',
        color: themes.colors.bgScreen,
        marginBottom: 15,
        textAlign: 'center',
    },
    petOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    petOptionImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    petOptionInfo: {
        flex: 1,
    },
    petOptionName: {
        fontSize: 16,
        fontFamily: 'Baloo2_600SemiBold',
        color: themes.colors.bgScreen,
    },
    petOptionDetails: {
        fontSize: 12,
        color: '#666',
    },
    closeButton: {
        backgroundColor: themes.colors.secundary,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Baloo2_600SemiBold',
    },
        recordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    recordActions: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        backgroundColor: themes.colors.secundary,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Modal de formulário
    formModalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
        marginHorizontal: 20,
    },
    formContainer: {
        maxHeight: 400,
    },
    textInput: {
        height: 50,
        backgroundColor: themes.colors.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    inputHelp: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontStyle: 'italic',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    confirmButton: {
        backgroundColor: themes.colors.secundary,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontFamily: 'Baloo2_600SemiBold',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Baloo2_600SemiBold',
    },
        inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        color: themes.colors.bgScreen,
        marginBottom: 8,
        fontFamily: 'Baloo2_600SemiBold'
    },

});