import { Dimensions, StyleSheet, Platform } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: themes.login_cadastro.fundo,
    },
    boxTop: {
        height: Dimensions.get('window').height / 4, //dimensiona a tela de forma responsiva
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxMid: {
        height: Dimensions.get('window').height / 2.2,
        width: '100%',
        backgroundColor: themes.login_cadastro.fundoBox,
        paddingHorizontal: 20,
        borderRadius: 30,

        // 👉 Android
        elevation: 5,

        // 👉 iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    boxBottom: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 15,
        marginTop: 20,
        marginBottom: 40,
        color: themes.login_cadastro.titulo,
        fontFamily: 'Inter_600SemiBold'
    },
    entrar: {
        fontSize: 25,
        marginTop: 20,
        textAlign: 'center',
        color: themes.login_cadastro.titulo,
        fontFamily: 'Inter_600SemiBold'
    },
    button: {
        marginTop: 40,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
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
        fontFamily: 'Inter_600SemiBold',
        fontSize: 15,
    },
    textCadastro: {
        marginTop: 31,
        textAlign: "center",
        color: themes.login_cadastro.titulo,
        fontSize: 15,
        fontFamily: 'Baloo2_400Regular',
    },
    linkCadastro: {
        fontSize: 15,
        fontFamily: 'Baloo2_800ExtraBold',
    }
})