import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

/**
 * Componente de botón personalizado para aplicaciones de gimnasio con animaciones de escala
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Texto que se mostrará en el botón
 * @param {function} props.onPress - Función que se ejecuta al presionar el botón
 * @param {Object} [props.style] - Estilos personalizados adicionales para el botón
 * @returns {JSX.Element} Componente de botón animado
 */
const GymButton = ({ label, onPress, style }) => {
  // useRef para mantener la instancia de Animated.Value entre renders
  // Esto previene que se recree el valor animado en cada render
  const scaleAnim = useRef(new Animated.Value(1)).current;
 
  /**
   * Maneja el evento cuando el usuario comienza a presionar el botón
   * Inicia la animación de escala hacia abajo (efecto de presión)
   */
  const onPressIn = () => {
    // Animación para escalar hacia abajo cuando se presiona
    Animated.spring(scaleAnim, {
      toValue: 0.95, // Escala el botón al 95% de su tamaño original
      useNativeDriver: true, // Optimización de rendimiento usando el driver nativo
    }).start();
  };
 
  /**
   * Maneja el evento cuando el usuario deja de presionar el botón
   * Restaura el botón a su tamaño original con un efecto de resorte
   */
  const onPressOut = () => {
    // Animación para escalar de vuelta a la normalidad cuando se suelta
    Animated.spring(scaleAnim, {
      toValue: 1, // Restaura el tamaño original (100%)
      friction: 3, // Controla la "elasticidad" del resorte (mayor = menos rebote)
      tension: 40, // Controla la velocidad del resorte (mayor = más rápido)
      useNativeDriver: true, // Optimización de rendimiento
    }).start();
  };
 
  // Estilo animado que se aplicará al contenido del botón
  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };
 
  /**
   * Determina el color de fondo del botón basado en el estado y estilos personalizados
   * 
   * @param {boolean} pressed - Indica si el botón está siendo presionado
   * @returns {string} Color hexadecimal para el fondo del botón
   */
  const getBackgroundColor = (pressed) => {
    if (style?.backgroundColor) {
      // Si hay un color personalizado, lo oscurece cuando está presionado
      return pressed ? darkenColor(style.backgroundColor) : style.backgroundColor;
    }
    // Colores por defecto: verde normal o verde oscuro cuando está presionado
    return pressed ? '#45A049' : '#4CAF50';
  };
 
  /**
   * Oscurece un color dado para el efecto de botón presionado
   * Utiliza un mapeo predefinido para colores verdes comunes
   * 
   * @param {string} color - Color hexadecimal a oscurecer
   * @returns {string} Versión oscurecida del color
   */
  const darkenColor = (color) => {
    // Mapeo simple de colores verdes comunes a sus versiones oscuras
    const colorMap = {
      '#4CAF50': '#45A049', // Verde principal -> Verde oscuro
      '#2E7D32': '#1B5E20', // Verde medio -> Verde muy oscuro
      '#A5D6A7': '#81C784', // Verde claro -> Verde medio
    };
    // Retorna el color mapeado o un verde oscuro por defecto
    return colorMap[color] || '#45A049';
  };
 
  return (
    <Pressable
      onPress={onPress} // La acción principal del botón
      onPressIn={onPressIn} // Inicia la animación de presionar
      onPressOut={onPressOut} // Inicia la animación de soltar
      style={({ pressed }) => [
        styles.pressableRoot, // Estilos base del botón
        { backgroundColor: getBackgroundColor(pressed) }, // Color dinámico basado en estado
        style, // Aplicar estilos personalizados (sobreescribe los anteriores si hay conflicto)
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
    borderRadius: 12,
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