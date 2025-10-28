// components/CarrosselNovidades/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { style } from './styles'

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 60;
const CARD_MARGIN = 10;

export interface NovidadeCard {
  id: string;
  titulo: string;
  descricao: string;
  imagem: any;
  corFundo: string;
  acao?: () => void;
}

interface CarrosselNovidadesProps {
  cards: NovidadeCard[];
  titulo?: string;
}

export const CarrosselNovidades: React.FC<CarrosselNovidadesProps> = ({
  cards,
//   titulo = 'Novidades e Promoções'
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Função para navegar entre os cards
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN * 2));
        setCurrentCardIndex(index);
      }
    }
  );

  // Função para ir para o próximo card
  const nextCard = () => {
    const nextIndex = (currentCardIndex + 1) % cards.length;
    scrollViewRef.current?.scrollTo({
      x: nextIndex * (CARD_WIDTH + CARD_MARGIN * 2),
      animated: true
    });
  };

  // Função para ir para um card específico
  const goToCard = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * (CARD_WIDTH + CARD_MARGIN * 2),
      animated: true
    });
  };

  // Auto-scroll dos cards
  useEffect(() => {
    if (cards.length <= 1) return; // Não faz auto-scroll se tiver apenas 1 card
    
    const interval = setInterval(() => {
      nextCard();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentCardIndex, cards.length]);

  // Se não houver cards, não renderiza nada
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <View style={style.carrosselContainer}>
      {/* {titulo && <Text style={style.carrosselTitle}>{titulo}</Text>} */}
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={style.carrosselContent}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
      >
        {cards.map((card, index) => (
          <TouchableOpacity
            key={card.id}
            style={[
              style.novidadeCard,
              { 
                width: CARD_WIDTH,
                marginHorizontal: CARD_MARGIN,
                backgroundColor: card.corFundo 
              }
            ]}
            onPress={card.acao}
            activeOpacity={0.9}
          >
            <View style={style.novidadeContent}>
              <View style={style.novidadeTextContainer}>
                <Text style={style.novidadeTitulo}>{card.titulo}</Text>
                <Text style={style.novidadeDescricao}>{card.descricao}</Text>
                <TouchableOpacity 
                  style={style.novidadeBotao}
                  onPress={card.acao}
                >
                  <Text style={style.novidadeBotaoTexto}>Saiba mais</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={style.novidadeImagemContainer}>
                <Image 
                  source={card.imagem} 
                  style={style.novidadeImagem}
                  resizeMode="cover"
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicadores de página - só mostra se tiver mais de 1 card */}
      {cards.length > 1 && (
        <View style={style.indicadoresContainer}>
          {cards.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToCard(index)}
            >
              <View
                style={[
                  style.indicador,
                  {
                    backgroundColor: index === currentCardIndex 
                      ? cards[currentCardIndex]?.corFundo || '#666'
                      : '#DDD'
                  }
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};