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
import { styles } from "./styles"
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

  // Dentro do componente CustomCalendar, antes do useEffect, adicione:
  const feriadosEDiasBloqueados = [
    '2024-12-25', // Natal
    '2024-12-31', // Véspera de Ano Novo
    '2025-01-01', // Ano Novo
    '2025-04-18', // Sexta-feira Santa (exemplo)
    '2025-04-21', // Tiradentes
    '2025-05-01', // Dia do Trabalho
    '2025-09-07', // Independência do Brasil
    '2025-10-12', // Nossa Senhora Aparecida
    '2025-11-02', // Finados
    '2025-11-15', // Proclamação da República
    '2025-11-20',
  ];

  // Você também pode bloquear dias específicos da semana (ex: segundas-feiras)
  const diasDaSemanaBloqueados = [0]; // 0 = Domingo, 1 = Segunda, etc.
  // Exemplo para bloquear segundas e domingos: [0, 1]

  // Simulação de dias disponíveis
  // Substitua o useEffect atual por este:
  useEffect(() => {
    const carregarDiasDisponiveis = () => {
      const hoje = new Date();
      const disponiveis: string[] = [];

      // Próximos 60 dias
      for (let i = 0; i < 60; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() + i);
        const dateStr = data.toISOString().split('T')[0];
        const diaDaSemana = data.getDay();

        // VERIFICAÇÕES PARA BLOQUEAR DIAS:
        const isDomingo = diaDaSemana === 0;
        const isDiaDaSemanaBloqueado = diasDaSemanaBloqueados.includes(diaDaSemana);
        const isFeriado = feriadosEDiasBloqueados.includes(dateStr);

        // Só adiciona como disponível se NÃO for nenhum dos bloqueados
        if (!isDomingo && !isDiaDaSemanaBloqueado && !isFeriado) {
          disponiveis.push(dateStr);
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
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>

        {/* Logo 3D FORA do container do calendário */}
        <View style={styles.logo3DContainer}>
          <Image
            source={require('../../assets/logoCalendario.png')}
            style={styles.logo3D}
            resizeMode="contain"
          />
        </View>

        <View style={styles.calendarContainer}>

          {/* Header Personalizado */}
          <View style={styles.calendarHeader}>
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>Selecione a Data</Text>
              </View>
            </View>

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