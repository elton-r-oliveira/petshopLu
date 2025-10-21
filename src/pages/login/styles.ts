import { StyleSheet, Platform, Dimensions } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: themes.login_cadastro.fundo,
    },
    boxTop: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    boxMid: {
        width: "100%",
        backgroundColor: themes.login_cadastro.fundoBox,
        padding: 20,
        borderRadius: 30,

        // Deixa o tamanho dinâmico (sem altura fixa)
        alignSelf: "center",

        // 👉 Sombra Android
        elevation: 5,
        // 👉 Sombra iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    titulo: {
        fontSize: 15,
        marginTop: 20,
        marginBottom: 30,
        color: themes.login_cadastro.titulo,
        fontFamily: "Inter_600SemiBold",
    },
    entrar: {
        fontSize: 25,
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

        elevation: 5,
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
    logo: {
        width: 150,
        height: 150,
        resizeMode: "contain",
    },
    biometricButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: themes.colors.corTexto,
        marginTop: 10,
        borderRadius: 20,
        height: 50,
    },
});
