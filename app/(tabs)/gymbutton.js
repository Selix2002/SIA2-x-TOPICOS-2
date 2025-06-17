import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

const GymButton = ({ label, onPress, style }) => {
  // useRef para mantener la instancia de Animated.Value entre renders
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const onPressIn = () => {
    // Animación para escalar hacia abajo cuando se presiona
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true, // Es bueno para el rendimiento
    }).start();
  };
  
  const onPressOut = () => {
    // Animación para escalar de vuelta a la normalidad cuando se suelta
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3, // Controla la "elasticidad" del resorte
      tension: 40, // Controla la velocidad del resorte
      useNativeDriver: true,
    }).start();
  };
  
  // Estilo animado que se aplicará
  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };
  
  // Determinar el color de fondo basado en el estilo personalizado
  const getBackgroundColor = (pressed) => {
    if (style?.backgroundColor) {
      return pressed ? darkenColor(style.backgroundColor) : style.backgroundColor;
    }
    return pressed ? '#45A049' : '#4CAF50'; // Verde por defecto
  };
  
  // Función para oscurecer el color cuando se presiona
  const darkenColor = (color) => {
    // Mapeo simple de colores verdes comunes
    const colorMap = {
      '#4CAF50': '#45A049',
      '#2E7D32': '#1B5E20',
      '#A5D6A7': '#81C784',
    };
    return colorMap[color] || '#45A049';
  };
  
  return (
    <Pressable
      onPress={onPress} // La acción principal del botón
      onPressIn={onPressIn} // Inicia la animación de presionar
      onPressOut={onPressOut} // Inicia la animación de soltar
      style={({ pressed }) => [
        styles.pressableRoot,
        { backgroundColor: getBackgroundColor(pressed) },
        style, // Aplicar estilos personalizados
      ]}
    >
      <Animated.View style={[styles.animatedContent, animatedStyle]}>
        <Text style={styles.buttonText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableRoot: {
    width: '80%',
    minWidth: 250,
    marginBottom: 12,
    borderRadius: 12, // Bordes más redondeados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  animatedContent: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default GymButton;