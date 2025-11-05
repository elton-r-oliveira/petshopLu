import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Path, Ellipse } from 'react-native-svg';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  withDelay 
} from 'react-native-reanimated';

interface PawLoaderProps {
  size?: number;
  color?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const PawLoader: React.FC<PawLoaderProps> = ({ 
  size = 28, 
  color = '#d31145' 
}) => {
  const PawIcon = () => (
    <Svg width={size} height={size} viewBox="0 0 249 209.32" fill={color}>
      <Ellipse cx="27.917" cy="106.333" strokeWidth="0" rx="27.917" ry="35.833"/>
      <Ellipse cx="84.75" cy="47.749" strokeWidth="0" rx="34.75" ry="47.751"/>
      <Ellipse cx="162" cy="47.749" strokeWidth="0" rx="34.75" ry="47.751"/>
      <Ellipse cx="221.083" cy="106.333" strokeWidth="0" rx="27.917" ry="35.833"/>
      <Path strokeWidth="0" d="M43.98 165.39s9.76-63.072 76.838-64.574c0 0 71.082-6.758 83.096 70.33 0 0 2.586 19.855-12.54 31.855 0 0-15.75 17.75-43.75-6.25 0 0-7.124-8.374-24.624-7.874 0 0-12.75-.125-21.5 6.625 0 0-16.375 18.376-37.75 12.75 0 0-28.29-7.72-19.77-42.86z"/>
    </Svg>
  );

  const createPawAnimation = (index: number) => {
    const animationStyle = useAnimatedStyle(() => {
      const baseDelay = index * 180; // Delay um pouco menor para ser mais rápido
      
      return {
        opacity: withRepeat(
          withSequence(
            withTiming(0, { duration: 0 }),
            withDelay(baseDelay, 
              withSequence(
                withTiming(1, { duration: 80 }),
                withTiming(1, { duration: 300 }),
                withTiming(0, { duration: 150 })
              )
            ),
            withDelay(1080 - baseDelay, withTiming(0, { duration: 0 }))
          ),
          -1,
          false
        ),
      };
    });

    return animationStyle;
  };

  // Posições alternadas para parecer caminhada
  const getPawStyle = (index: number) => {
    const isLeftPaw = index % 2 === 0;
    
    return {
      left: index * (size + 12),
      top: isLeftPaw ? 5 : -5, // Alterna entre um pouco acima e abaixo
      transform: [
        { rotate: isLeftPaw ? '-8deg' : '8deg' }, // Patas esquerda viram para um lado, direita para outro
      ],
    };
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <AnimatedView
          key={index}
          style={[
            styles.paw,
            createPawAnimation(index),
            getPawStyle(index),
          ]}
        >
          <PawIcon />
        </AnimatedView>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 280,
  },
  paw: {
    position: 'absolute',
  },
});