import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    // Estilos de Container e Layout Principal
    container: {
        flex: 1,
        backgroundColor: themes.telaHome.fundo,
    },
    containerScroll: { // NOVO: Estilo para o ScrollView da tela Agendar
        flex: 1,
    },
    formContainer: { // NOVO: Container para o formulário
        marginHorizontal: 15,
        paddingBottom: 50,
    },

    // Estilos de Cabeçalho (MANTIDOS)
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
    serviceDropdownContainer: { // NOVO
        // Usamos position: 'relative' para que o dropdown se posicione
        // em relação a este container
        position: 'relative',
        zIndex: 10, // Garante que a lista fique acima de outros elementos
    },
    dropdownList: { // NOVO
        position: 'absolute',
        top: 55 + 8 + 4, // Altura do input (55) + marginBottom do Label (8) + Pequeno offset (4)
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        // Sombra para destacar a lista
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        maxHeight: 200, // Limita a altura para ser scrollável se a lista for longa
        overflow: 'hidden',
    },
    dropdownItem: { // NOVO
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemText: { // NOVO
        fontSize: 16,
        color: '#333',
    },
    // Estilos de Título e Subtítulo (AJUSTADOS para a tela Agendar)
    sectionTitle: {
        fontSize: 22, // Aumentado um pouco
        fontWeight: "bold",
        marginTop: 50,
        marginBottom: 5,
        color: themes.colors.secundary,
        marginLeft: 15
    },
    sectionSubtitle: { // NOVO
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
        marginLeft: 15,
        marginRight: 15,
    },

    // Estilos de Inputs e Seletores (NOVOS)
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: themes.colors.secundary,
        marginBottom: 8,
    },
    selectInput: {
        height: 55,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',

        // Sombra leve para destacar os campos de interação
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    inputIcon: {
        marginRight: 10,
    },
    selectInputText: {
        flex: 1,
        fontSize: 16,
    },

    // Estilos para Data e Hora (Lado a Lado)
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    halfInput: {
        width: '48%',
        marginBottom: 0,
    },

    // Estilos de Botão (AJUSTADO)
    button: {
        backgroundColor: themes.colors.bgScreen,
        height: 55,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        flexDirection: 'row', // Para alinhar o ícone de confirmação

        // Sombra mais forte para o botão principal
        elevation: 5,
        shadowColor: themes.colors.bgScreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },


    // Estilos antigos (MANTIDOS para outros componentes e telas)
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
    actions: {
        flexDirection: "row",
        gap: 10,
        marginLeft: 20,
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    petCard: {
        backgroundColor: themes.colors.lightGray,
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        position: "relative",
        marginLeft: 15,
        marginRight: 15,
        elevation: 5,
        shadowColor: themes.colors.iconeQuickAcess1,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        flexDirection: "row",
        alignItems: "center",
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
        alignItems: "center",
        justifyContent: "center",
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
    // Removido o 'input' original, que foi substituído por 'selectInput'
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
    // Estilos para o Upload de Foto
photoPickerButton: { // NOVO
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden', // Importante para o preview da foto
},
petPhotoPreview: { // NOVO
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 10,
},
photoPickerText: { // NOVO
    marginTop: 8,
    fontSize: 14,
    color: '#888',
    backgroundColor: 'rgba(255,255,255,0.7)', // Fundo para o texto sobre a imagem
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    zIndex: 1,
},
});