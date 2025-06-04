import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import GymButton from './gymbutton';

// Obtener el ancho de la pantalla para el dimensionamiento adaptable de la imagen
const screenWidth = Dimensions.get('window').width;

// Dimensiones originales de tu imagen
const IMAGE_ORIGINAL_WIDTH = 421;
const IMAGE_ORIGINAL_HEIGHT = 592;
// Relación de aspecto (alto / ancho) para mantener la proporción
const IMAGE_ASPECT_RATIO_HEIGHT_TO_WIDTH = IMAGE_ORIGINAL_HEIGHT / IMAGE_ORIGINAL_WIDTH;

const MuscleSelectionView = ({ // Renombramos para mayor claridad, o puedes mantener HomeView
  imageSource,
  containerPadding, // Nueva prop para el padding del contenedor padre
}) => {
  // Calcular las dimensiones de visualización para la imagen dentro de HomeView
  const imageDisplayWidth = screenWidth - (2 * containerPadding);
  const imageDisplayHeight = imageDisplayWidth * IMAGE_ASPECT_RATIO_HEIGHT_TO_WIDTH;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen del tren superior */}
      <View style={styles.contentContainer}>
        <Image
          source={imageSource}
          style={{
            width: imageDisplayWidth,
            height: imageDisplayHeight,
            resizeMode: 'contain',
            marginBottom: 40,
          }}
        />

        <Text style={styles.titleText}>
          ¡Elige un músculo!
        </Text>

        <GymButton label="Bíceps" onPress={() => console.log("Seleccionó biceps")} />
        <GymButton label="Abdomen" onPress={() => console.log("Seleccionó abdomen")} />
        <GymButton label="Cuádriceps" onPress={() => console.log("Seleccionó cuádriceps")} />

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f4f4f9', 
  },
  scrollViewContent: {
    flexGrow: 1, // Para que el contenido pueda crecer y centrarse si es poco
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center', // Centra los elementos horizontalmente
    justifyContent: 'center', // Centra los elementos verticalmente si hay espacio
    paddingTop: 40, // Espacio arriba
    paddingBottom: 20, // Espacio abajo
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Un color oscuro para el texto
    marginBottom: 30, // Espacio debajo del título
  },
});

export default MuscleSelectionView;
