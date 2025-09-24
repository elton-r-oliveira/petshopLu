import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
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
    marginLeft: 10,
    alignItems: "flex-start",
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
  petnName: {
    fontSize: 12,
    color: themes.colors.bgScreen,
  },
    overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
  },
  // 🔴 Badge
  badge: {
    position: "absolute",
    right: -2, // ajusta posição horizontal
    top: -2, // ajusta posição vertical
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

});
