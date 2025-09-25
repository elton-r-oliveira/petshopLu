import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.lightGray,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        backgroundColor: themes.colors.lightGray,
        marginBottom: 20,
        borderRadius: 25,

        // sombra Android
        elevation: 15,

        // sombra iOS
        shadowColor: themes.colors.iconeQuickAcess1,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },

    headerText: {
        flex: 1,
        // alignItems: "center",
        marginLeft: 10,
        alignItems: 'flex-start'
    },
    hello: {
        fontSize: 14,
        color: themes.colors.bgScreen,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: themes.colors.bgScreen,
    },
    location: {
        fontSize: 12,
        color: themes.colors.bgScreen,
    },

    quickActions: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginHorizontal: 15,
    },
    actionBox: {
        width: "48%",
        height: 120,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },

    actionText: {
        marginTop: 5,
        color: themes.colors.iconeQuickAcess1,
        fontWeight: "bold",
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 20,
        color: themes.colors.secundary,
        marginLeft: 15
    },
    petCard: {
        backgroundColor: themes.colors.lightGray,
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        position: "relative",
        marginLeft: 15,
        marginRight: 15,

        // sombra Android
        elevation: 5,

        // sombra iOS
        shadowColor: themes.colors.iconeQuickAcess1,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    petInfo: {
        marginBottom: 10,
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
    petDetails: {
        fontSize: 12,
        color: themes.colors.bgScreen,
        marginVertical: 5,
    },
    petDescription: {
        fontSize: 13,
        color: themes.colors.bgScreen,
    },
    favoriteButton: {
        position: "absolute",
        top: 25,
        right: 25,
        backgroundColor: themes.colors.lightGray,
        padding: 5,
        borderRadius: 50,
    },
    favoriteTextContainer: {
        position: "absolute",
        top: 25,
        right: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 50,
        alignItems: "center",  // centraliza horizontalmente o conteúdo
        justifyContent: "center", // centraliza verticalmente
    },
    bottomBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    bottomButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    bottomText: {
        fontSize: 12,
        color: "#333",
        marginTop: 2,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: themes.colors.bgScreen,
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
