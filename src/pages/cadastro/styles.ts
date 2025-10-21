import { StyleSheet, Platform } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start", // Mantém o card mais pra cima
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 60,
        backgroundColor: themes.login_cadastro.fundo,
    },

    boxTop: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },

    boxMid: {
        width: "100%",
        backgroundColor: themes.login_cadastro.fundoBox,
        paddingHorizontal: 20,
        paddingVertical: 25,
        borderRadius: 30,

        // Alinhamento e espaçamento interno
        alignSelf: "center",
        justifyContent: "center",

        // 👉 Android
        elevation: 5,

        // 👉 iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },

    boxBottom: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
    },

    titulo: {
        fontSize: 15,
        marginTop: 10,
        marginBottom: 30,
        color: themes.login_cadastro.titulo,
        fontFamily: "Inter_600SemiBold",
        textAlign: "center",
    },

    entrar: {
        fontSize: 25,
         marginTop: 20,
        marginBottom: 10,
        textAlign: "center",
        color: themes.login_cadastro.titulo,
        fontFamily: "Inter_600SemiBold",
    },

    button: {
        marginTop: 30,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 50,
        backgroundColor: themes.login_cadastro.titulo,
        borderRadius: 20,

        // 👉 Android
        elevation: 5,

        // 👉 iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },

    textButton: {
        color: themes.login_cadastro.fundoBox,
        fontFamily: "Inter_600SemiBold",
        fontSize: 15,
    },

    textCadastro: {
        marginTop: 25,
        textAlign: "center",
        color: themes.login_cadastro.titulo,
        fontSize: 15,
        fontFamily: "Baloo2_400Regular",
    },

    linkCadastro: {
        fontSize: 15,
        fontFamily: "Baloo2_800ExtraBold",
    },
});
