import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { themes } from '../../global/themes';

interface TabSwitchProps {
    abaAtual: 'agendar' | 'meusAgendamentos';
    setAbaAtual: (aba: 'agendar' | 'meusAgendamentos') => void;
}

export const TabSwitch: React.FC<TabSwitchProps> = ({ abaAtual, setAbaAtual }) => {
    return (
        <View style={{
            flexDirection: 'row',
            // Ocupa a largura total da tela, com 20px de margem em cada lateral
            marginHorizontal: 10,
            // Mantém a margem superior de 50px
            marginTop: 50,
            marginVertical: 15,
        }}>
            <TouchableOpacity
                style={{
                    // Ocupa metade do espaço
                    flex: 1,
                    backgroundColor: abaAtual === 'agendar' ? themes.colors.secundary : '#ddd',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    alignItems: 'center', // Centraliza o texto
                }}
                onPress={() => setAbaAtual('agendar')}
            >
                <Text
                    style={{
                        color: abaAtual === 'agendar' ? '#fff' : '#555',
                        fontWeight: '600',
                    }}
                >
                    Agendar Serviço
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    // Ocupa metade do espaço
                    flex: 1,
                    backgroundColor: abaAtual === 'meusAgendamentos' ? themes.colors.secundary : '#ddd',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    alignItems: 'center', // Centraliza o texto
                }}
                onPress={() => setAbaAtual('meusAgendamentos')}
            >
                <Text
                    style={{
                        color: abaAtual === 'meusAgendamentos' ? '#fff' : '#555',
                        fontWeight: '600',
                    }}
                >
                    Meus Agendamentos
                </Text>
            </TouchableOpacity>
        </View>
    );
};