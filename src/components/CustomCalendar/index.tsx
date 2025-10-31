// CustomCalendar.tsx - ATUALIZADO
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
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

// Configurar português (mantenha igual)
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
  const [diasBloqueados, setDiasBloqueados] = useState<string[]>([]);
  const [feriados, setFeriados] = useState<string[]>([]);
  const [configuracoesHorario, setConfiguracoesHorario] = useState<any[]>([]);

  // Buscar configurações do Firebase
  useEffect(() => {
    // Buscar configurações de datas
    const unsubscribeDatas = onSnapshot(
      query(collection(db, 'configuracoes_data'), where('ativo', '==', true)),
      (snapshot) => {
        const bloqueados: string[] = [];
        const feriadosList: string[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.tipo === 'diaBloqueado') {
            bloqueados.push(data.data);
          } else if (data.tipo === 'feriado') {
            feriadosList.push(data.data);
          }
        });

        setDiasBloqueados(bloqueados);
        setFeriados(feriadosList);
      }
    );

    // Buscar configurações de horário
    const unsubscribeHorarios = onSnapshot(
      query(collection(db, 'configuracoes_horario')),
      (snapshot) => {
        const horarios: any[] = [];
        snapshot.forEach((doc) => {
          horarios.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setConfiguracoesHorario(horarios);
      }
    );

    return () => {
      unsubscribeDatas();
      unsubscribeHorarios();
    };
  }, []);

  // ✅ CORREÇÃO: Agora usa os dados do Firebase para calcular dias disponíveis
  // CustomCalendar.tsx - ATUALIZE O USEEFFECT DE DIAS DISPONÍVEIS
  // CustomCalendar.tsx - ATUALIZE O USEEFFECT DE DIAS DISPONÍVEIS
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

        // VERIFICAÇÕES
        const isFeriado = feriados.includes(dateStr);
        const isDiaBloqueado = diasBloqueados.includes(dateStr);

        // ✅ NOVA LÓGICA: Verificar configuração do dia
        const configDia = configuracoesHorario.find(h => h.diaSemana === diaDaSemana);

        // Dia está disponível se:
        // 1. NÃO for feriado
        // 2. NÃO for dia bloqueado  
        // 3. E (não tem configuração OU está configurado como ABERTO)
        const isDiaDisponivel = !isFeriado && !isDiaBloqueado &&
          (!configDia || configDia.aberto === true);

        if (isDiaDisponivel) {
          disponiveis.push(dateStr);
        }
      }

      setDiasDisponiveis(disponiveis);
      console.log('Dias disponíveis:', disponiveis.length);
    };

    carregarDiasDisponiveis();
  }, [diasBloqueados, feriados, configuracoesHorario]);

  const createLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  };

  // ✅ CORREÇÃO: Preparar os dias marcados considerando Firebase
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

    // Marcar todos os dias nos próximos 60 dias
    const hoje = new Date();
    for (let i = 0; i < 60; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      const dateStr = data.toISOString().split('T')[0];
      const diaDaSemana = data.getDay();

      if (!marked[dateStr]) {
        const isDisponivel = diasDisponiveis.includes(dateStr);
        const isFeriado = feriados.includes(dateStr);
        const isDiaBloqueado = diasBloqueados.includes(dateStr);
        const isDomingo = diaDaSemana === 0;

        // Configurar cores baseadas no status
        if (isDisponivel) {
          // Dia disponível - ponto verde
          marked[dateStr] = {
            disabled: false,
            dotColor: '#4CAF50',
            activeOpacity: 0.7,
            customStyles: {
              text: {
                color: '#2d4150',
                fontWeight: '500',
              }
            }
          };
        } else {
          // Dia indisponível - ponto vermelho
          let motivo = '';
          if (isFeriado) motivo = ' (Feriado)';
          else if (isDiaBloqueado) motivo = ' (Bloqueado)';
          else if (isDomingo) motivo = ' (Domingo)';
          else motivo = ' (Fechado)';

          marked[dateStr] = {
            disabled: true,
            dotColor: '#F44336',
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
    }

    return marked;
  };

  const onDayPress = (day: any) => {
    const selectedDateLocal = createLocalDate(day.dateString);

    // Verificar se o dia está disponível
    const isDisponivel = diasDisponiveis.includes(day.dateString);
    if (!isDisponivel) {
      // Não permitir selecionar dias indisponíveis
      return;
    }

    // Manter o horário atual se já tiver um selecionado
    const horaAtual = selectedDate.getHours();
    const minutoAtual = selectedDate.getMinutes();
    selectedDateLocal.setHours(horaAtual, minutoAtual, 0, 0);

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
              firstDay={1}

              theme={{
                backgroundColor: '#FFFFFF',
                calendarBackground: '#FFFFFF',
                selectedDayBackgroundColor: themes.colors.secundary,
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: themes.colors.secundary,
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: themes.colors.secundary,
                monthTextColor: themes.colors.secundary,
                textMonthFontSize: 18,
                textMonthFontWeight: 'bold',
                textSectionTitleColor: themes.colors.secundary,
                textDayHeaderFontSize: 14,
                textDayHeaderFontWeight: '600',
                arrowColor: themes.colors.secundary,
                arrowStyle: { padding: 10 },
              }}

              dayComponent={({ date, state, marking }: any) => {
                const dateStr = date.dateString;
                const isSelected = marking?.selected;
                const isAvailable = marking?.dotColor === '#4CAF50';
                const isUnavailable = marking?.dotColor === '#F44336';
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                const isDisabled = marking?.disabled || state === 'disabled';

                return (
                  <TouchableOpacity
                    style={[
                      styles.dayContainer,
                      isSelected && styles.selectedDay,
                      isToday && !isSelected && styles.todayDay,
                      isDisabled && styles.disabledDay,
                    ]}
                    onPress={() => !isDisabled && onDayPress(date)}
                    disabled={isDisabled}
                  >
                    <Text style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                      isDisabled && styles.disabledDayText,
                      isToday && !isSelected && styles.todayDayText,
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
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>Disponível</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
                <Text style={styles.legendText}>Indisponível</Text>
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