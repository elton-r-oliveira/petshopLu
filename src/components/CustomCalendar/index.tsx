import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Image, 
  StyleSheet,
  ScrollView 
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { themes } from "../../global/themes";
import { MaterialIcons } from "@expo/vector-icons";

// Configurar português
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

interface CustomCalendarProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export const CustomCalendar: React.FC<CustomCalendarProps> = ({
  visible,
  onClose,
  onDateSelect,
  selectedDate
}) => {
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);

  // Simulação de dias disponíveis
  useEffect(() => {
    const carregarDiasDisponiveis = () => {
      const hoje = new Date();
      const disponiveis: string[] = [];
      
      // Próximos 60 dias, exceto domingos (exemplo)
      for (let i = 0; i < 60; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() + i);
        
        // Não incluir domingos (exemplo de regra de negócio)
        if (data.getDay() !== 0) {
          disponiveis.push(data.toISOString().split('T')[0]);
        }
      }
      
      setDiasDisponiveis(disponiveis);
    };
    
    carregarDiasDisponiveis();
  }, []);

  // CORREÇÃO: Função para criar data no fuso horário local
  const createLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    // Criar data no fuso horário local
    return new Date(year, month - 1, day, 12, 0, 0); // Usar meio-dia para evitar problemas de fuso
  };

  // Preparar os dias marcados
  const prepareMarkedDates = () => {
    const marked: any = {};
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    // Marcar data selecionada
    marked[selectedDateStr] = {
      selected: true,
      selectedColor: themes.colors.secundary,
      selectedTextColor: '#FFFFFF',
      customStyles: {
        container: {
          borderRadius: 20,
          backgroundColor: themes.colors.secundary,
        },
        text: {
          color: '#FFFFFF',
          fontWeight: 'bold',
        }
      }
    };

    // Marcar dias disponíveis com ponto verde
    diasDisponiveis.forEach(dateStr => {
      if (!marked[dateStr]) {
        marked[dateStr] = {
          disabled: false,
          dotColor: '#4CAF50', // Ponto verde para disponível
          activeOpacity: 0.7,
          customStyles: {
            text: {
              color: '#2d4150',
              fontWeight: '500',
            }
          }
        };
      }
    });

    // Marcar dias indisponíveis (que não estão no array de disponíveis)
    const hoje = new Date();
    for (let i = 0; i < 60; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      const dateStr = data.toISOString().split('T')[0];
      
      if (!diasDisponiveis.includes(dateStr) && !marked[dateStr]) {
        marked[dateStr] = {
          disabled: true,
          dotColor: '#F44336', // Ponto vermelho para indisponível
          customStyles: {
            container: {
              backgroundColor: '#f5f5f5',
            },
            text: {
              color: '#d9e1e8',
            }
          }
        };
      }
    }

    return marked;
  };

  const onDayPress = (day: any) => {
    // CORREÇÃO: Usar a função createLocalDate para evitar problemas de fuso
    const selectedDateLocal = createLocalDate(day.dateString);
    
    // Manter o horário atual se já tiver um selecionado
    const horaAtual = selectedDate.getHours();
    const minutoAtual = selectedDate.getMinutes();
    
    selectedDateLocal.setHours(horaAtual, minutoAtual, 0, 0);
    
    console.log('Data selecionada no calendário:', {
      dateString: day.dateString,
      localDate: selectedDateLocal,
      formatted: selectedDateLocal.toLocaleDateString('pt-BR'),
      hours: selectedDateLocal.getHours(),
      minutes: selectedDateLocal.getMinutes()
    });
    
    onDateSelect(selectedDateLocal);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.calendarContainer}>
          
          {/* Header Personalizado */}
          <View style={styles.calendarHeader}>
            <Image 
              source={require('../../assets/logoCalendario.png')} // Sua logo
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Selecione a Data</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.calendarScroll}>
            {/* Calendário Customizado */}
            <Calendar
              current={selectedDate.toISOString().split('T')[0]}
              onDayPress={onDayPress}
              markedDates={prepareMarkedDates()}
              minDate={new Date().toISOString().split('T')[0]}
              hideExtraDays={true}
              firstDay={1} // Começa na segunda-feira
              
              // Customização do tema
              theme={{
                // Cores principais
                backgroundColor: '#FFFFFF',
                calendarBackground: '#FFFFFF',
                selectedDayBackgroundColor: themes.colors.secundary,
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: themes.colors.secundary,
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: themes.colors.secundary,
                
                // Header do mês
                monthTextColor: themes.colors.secundary,
                textMonthFontSize: 18,
                textMonthFontWeight: 'bold',
                
                // Dias da semana
                textSectionTitleColor: themes.colors.secundary,
                textDayHeaderFontSize: 14,
                textDayHeaderFontWeight: '600',
                
                // Setas de navegação
                arrowColor: themes.colors.secundary,
                arrowStyle: {
                  padding: 10,
                },
              }}
              
              // Day component customizado para melhor controle
              dayComponent={({ date, state, marking }: any) => {
                const dateStr = date.dateString;
                const isSelected = marking?.selected;
                const isAvailable = marking?.dotColor === '#4CAF50';
                const isUnavailable = marking?.dotColor === '#F44336';
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                
                return (
                  <TouchableOpacity
                    style={[
                      styles.dayContainer,
                      isSelected && styles.selectedDay,
                      isToday && !isSelected && styles.todayDay,
                      state === 'disabled' && styles.disabledDay,
                    ]}
                    onPress={() => !state && onDayPress(date)}
                    disabled={state === 'disabled' || isUnavailable}
                  >
                    <Text style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                      state === 'disabled' && styles.disabledDayText,
                      isToday && !isSelected && styles.todayDayText,
                      isUnavailable && styles.unavailableDayText
                    ]}>
                      {date.day}
                    </Text>
                    
                    {/* Indicador de disponibilidade */}
                    {isAvailable && !isSelected && (
                      <View style={styles.availableDot} />
                    )}
                    {isUnavailable && !isSelected && (
                      <View style={styles.unavailableDot} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />

            {/* Legenda */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.availableDot]} />
                <Text style={styles.legendText}>Disponível</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.unavailableDot]} />
                <Text style={styles.legendText}>Indisponível</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: themes.colors.secundary }]} />
                <Text style={styles.legendText}>Selecionado</Text>
              </View>
            </View>

            {/* Botão de Confirmar */}
            <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
              <Text style={styles.confirmButtonText}>Confirmar Data</Text>
              <MaterialIcons name="check" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarContainer: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calendarHeader: {
    backgroundColor: themes.colors.secundary,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    width: 80,
    height: 40,
    marginBottom: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
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