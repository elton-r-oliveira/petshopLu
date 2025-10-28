// components/CarrosselNovidades/styles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 60;
const CARD_MARGIN = 10;

export const style = StyleSheet.create({
  carrosselContainer: {
    marginBottom: 30,
    marginTop: 10,
  },

  carrosselTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    marginLeft: 20,
  },

  carrosselContent: {
    paddingLeft: 10,
    paddingRight: 10,
  },

  novidadeCard: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  novidadeContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },

  novidadeTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15,
  },

  novidadeTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    lineHeight: 24,
  },

  novidadeDescricao: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 15,
    lineHeight: 20,
    fontWeight: '500',
  },

  novidadeBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  novidadeBotaoTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },

  novidadeImagemContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
  },

  novidadeImagem: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  indicadoresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 8,
  },

  indicador: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});