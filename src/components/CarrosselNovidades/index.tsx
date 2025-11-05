import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { style } from './styles';

const { width: screenWidth } = Dimensions.get('window');

export interface NovidadeCard {
  id: string;
  titulo: string;
  descricao: string;
  imagem: any;
  corFundo: string;
  acao: () => void;
}

interface CarrosselNovidadesProps {
  cards: NovidadeCard[];
  titulo?: string;
}

function hexToRgba(hex: string, alpha: number) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const int = parseInt(h, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const CarrosselNovidades: React.FC<CarrosselNovidadesProps> = ({
  cards,
  titulo = 'Novidades e Promoções',
}) => {
  const cardWidth = screenWidth * 0.9;
  const scrollViewRef = useRef<ScrollView>(null);
  const currentIndex = useRef(0);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  // Configura o auto-scroll
  const startAutoScroll = () => {
    if (cards.length <= 1) return;

    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }

    autoScrollTimer.current = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % cards.length;
      
      scrollViewRef.current?.scrollTo({
        x: currentIndex.current * (cardWidth + 16),
        animated: true,
      });
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  };

  // Detecta quando o scroll manual termina para atualizar o índice atual
  const handleScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / (cardWidth + 16));
    currentIndex.current = newIndex;
  };

  useEffect(() => {
    startAutoScroll();
    
    return () => {
      stopAutoScroll();
    };
  }, [cards.length]);

  return (
    <View style={style.carrosselContainer}>
      {titulo && <Text style={style.carrosselTitulo}>{titulo}</Text>}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.carrosselContent}
        snapToInterval={cardWidth + 16}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onTouchStart={stopAutoScroll}
        onTouchEnd={startAutoScroll}
      >
        {cards.map((card) => {
          return (
            <TouchableOpacity
              key={card.id}
              style={[style.novidadeCard, { width: cardWidth, height: 180 }]}
              onPress={card.acao}
              activeOpacity={0.9}
            >
              <View style={style.cardContainer}>
                {/* Fundo colorido sólido */}
                <View 
                  style={[
                    style.cardColorBackground, 
                    { backgroundColor: card.corFundo }
                  ]} 
                />
                
                {/* Imagem */}
                <Image 
                  source={card.imagem} 
                  style={style.cardImage} 
                  resizeMode="cover" 
                />
                
                {/* Gradiente de transição entre cor e imagem */}
                <LinearGradient
                  colors={[
                    card.corFundo,
                    hexToRgba(card.corFundo, 0.8),
                    hexToRgba(card.corFundo, 0.4),
                    hexToRgba(card.corFundo, 0.2),
                    'transparent'
                  ]}
                  locations={[0, 0.3, 0.5, 0.7, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={style.transitionGradient}
                />

                {/* Conteúdo de texto */}
                <View style={style.cardContent}>
                  <Text style={style.cardTitulo} numberOfLines={2}>
                    {card.titulo}
                  </Text>
                  <Text style={style.cardDescricao} numberOfLines={3}>
                    {card.descricao}
                  </Text>

                  <View style={style.cardAction}>
                    <Text style={style.cardActionText}>Saiba mais ›</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};