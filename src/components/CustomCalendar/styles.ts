import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative', // Para posicionar a logo absolutamente
  },
  calendarContainer: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    // REMOVI o overflow: 'hidden' para não cortar a logo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Logo 3D POSICIONADA FORA do calendário
  logo3DContainer: {
    position: 'absolute',
    top: 90, // Posiciona acima do calendário
    left: 20, // Ajuste para alinhar com a borda
    zIndex: 1000, // Z-index muito alto para ficar acima de tudo
    // shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 20,
  },
  logo3D: {
    width: 160, // Tamanho aumentado
    height: 190, // Tamanho aumentado
  },
  calendarHeader: {
    backgroundColor: themes.colors.secundary,
    padding: 20,
    paddingTop: 30, // Mais espaço no topo
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 140, // Espaço para a logo não sobrepor o título
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  closeButton: {
    padding: 5,
    marginTop: 5,
  },
  calendarScroll: {
    maxHeight: 500,
  },
  dayContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: themes.colors.secundary,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: themes.colors.secundary,
  },
  disabledDay: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  disabledDayText: {
    color: '#d9e1e8',
  },
  todayDayText: {
    color: themes.colors.secundary,
    fontWeight: 'bold',
  },
  unavailableDayText: {
    color: '#999',
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 3,
  },
  unavailableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F44336',
    position: 'absolute',
    bottom: 3,
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: themes.colors.secundary,
    padding: 15,
    margin: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});