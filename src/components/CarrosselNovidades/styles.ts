import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  carrosselContainer: {
    marginBottom: 10,
    marginTop: 30
  },
  carrosselTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  carrosselContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  novidadeCard: {
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    position: 'relative',
  },
  
  // Fundo colorido (ocupa toda a largura)
  cardColorBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    zIndex: 1,
  },
  
  // Imagem (ocupa toda a largura também)
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
  },
  
  // Gradiente de transição
  transitionGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    zIndex: 3,
  },
  
  // Conteúdo de texto
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    zIndex: 4,
    width: '60%',
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardDescricao: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 16,
    marginBottom: 8,
  },
  cardAction: {
    marginTop: 'auto',
  },
  cardActionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
  },

  // Indicadores
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#666',
    width: 20,
  },
});