import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.telaHome.fundo,
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 50,
        marginBottom: 20,
        color: themes.colors.secundary,
        marginLeft: 15,
    },

    petCard: {
        backgroundColor: themes.colors.lightGray,
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        marginHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        // sombras
        elevation: 5,
        shadowColor: themes.colors.iconeQuickAcess1,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },

    petLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    petImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },

    petInfo: {
        justifyContent: "center",
    },

    petName: {
        fontSize: 18,
        fontWeight: "bold",
        color: themes.colors.bgScreen,
    },

    petRace: {
        fontSize: 14,
        color: themes.colors.bgScreen,
    },

    actions: {
        flexDirection: "row",
        gap: 10,
    },

    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        
    },
    headerWithButton: { // NOVO ESTILO
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 20, // Ajuste para o espaçamento
    },
    addButton: { // NOVO ESTILO para o botão "+"
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: themes.colors.secundary, // Cor de destaque
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30, // Alinhado com o Título
    },
    emptyStateText: { // NOVO ESTILO
        textAlign: 'center',
        marginHorizontal: 40,
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
});
