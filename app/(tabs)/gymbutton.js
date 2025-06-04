import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

const GymButton = ({ label, onPress }) => {
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

  return (
    <Pressable
      onPress={onPress} // La acción principal del botón
      onPressIn={onPressIn} // Inicia la animación de presionar
      onPressOut={onPressOut} // Inicia la animación de soltar
      style={({ pressed }) => [
        styles.pressableRoot, // Estilos para el contenedor Pressable
        { backgroundColor: pressed ? '#5B8BFF' : '#4C6DFF' }, // Cambia el color de fondo si está presionado
      ]}
    >
      <Animated.View style={[styles.animatedContent, animatedStyle]}>
        <Text style={styles.buttonText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableRoot: { // Estilos para el componente Pressable (contenedor exterior)
    width: '80%', // Para que ocupe un buen ancho
    minWidth: 250, // Un ancho mínimo
    marginBottom: 12,
    borderRadius: 8, // Aplicar borderRadius aquí para que el backgroundColor se vea contenido
  },
  animatedContent: { // Estilos para el Animated.View (contenido interior que se anima)
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GymButton;
