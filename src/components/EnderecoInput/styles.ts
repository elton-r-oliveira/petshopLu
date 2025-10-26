import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    inputLabel: {
        color: themes.telaPerfil.titulos_labels,
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
    },
    selectInput: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: themes.telaPerfil.fundo_inputs,
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 45,
    },
    inputIcon: {
        marginRight: 8,
    },
    selectInputText: {
        flex: 1,
        color: themes.telaPerfil.textos_labels,
        fontSize: 14,
    },
});
