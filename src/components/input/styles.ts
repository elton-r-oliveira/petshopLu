import { Dimensions, StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    boxInput: {
        width: '100%',
        height: 50,
        borderWidth: 0.1,
        borderRadius: 20,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: themes.login_cadastro.campo_input,

        // 👉 Android
        elevation: 5,

        // 👉 iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Inter_500Medium'
    },
    Icon: {
        width: '100%'
    }
})