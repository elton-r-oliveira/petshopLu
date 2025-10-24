import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
  inputLabel: {
    color: themes.colors.corTexto,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themes.colors.bgScreen,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
  },
  inputIcon: {
    marginRight: 8,
  },
  selectInputText: {
    flex: 1,
    color: themes.colors.corTexto,
    fontSize: 14,
  },
});
