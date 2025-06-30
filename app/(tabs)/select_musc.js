import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MuscleOverlayMap from "../../components/MuscleOverlayMap";

/**
 * Componente para la selección de músculos a entrenar
 * Permite al usuario elegir qué músculo desea entrenar mediante un mapa interactivo
 * Recibe parámetros de objetivo y frecuencia de entrenamiento desde la pantalla anterior
 */
const MuscleSelectionView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
 
  // Obtener y parsear los parámetros pasados desde la pantalla de inicio
  const objetivoId = params.objetivoId ? parseInt(params.objetivoId) : 1;
  const objetivoNombre = params.objetivoNombre || 'Hipertrofia';
  const frecuenciaId = params.frecuenciaId ? parseInt(params.frecuenciaId) : 2;
  const frecuenciaNivel = params.frecuenciaNivel || '1–3 h/semana';
  
  /**
   * Mapeo de nombres de músculos a sus IDs numéricos
   * Utilizado para convertir nombres de músculos seleccionados a identificadores
   */
  const muscleNameToIdMap = {
    'abdominales': 2,
    'biceps': 1,
    'cuadriceps': 3
  };

  /**
   * Maneja la selección de un músculo específico
   * Navega a la lista de ejercicios con todos los parámetros necesarios
   * @param {string} muscleId - Nombre del músculo seleccionado
   */
  const handleMuscleSelection = (muscleId) => {
    console.log("Músculo seleccionado:", muscleId);
    console.log("Con objetivo:", objetivoNombre, "ID:", objetivoId);
    console.log("Con frecuencia:", frecuenciaNivel, "ID:", frecuenciaId);
   
    // Convertir nombre del músculo a ID numérico
    const musculo_id_numerico = muscleNameToIdMap[muscleId];
    
    if (musculo_id_numerico) {
      // Navegar a la lista de ejercicios con todos los parámetros
      router.push({
        pathname: '/(tabs)/lista_ejercicios',
        params: {
          musculoId: musculo_id_numerico,
          objetivoId: objetivoId,
          frecuenciaId: frecuenciaId,
          nombreMusculo: muscleId.charAt(0).toUpperCase() + muscleId.slice(1),
          objetivoNombre: objetivoNombre,
          frecuenciaNivel: frecuenciaNivel
        },
      });
    } else {
      console.warn(`No hay un ID numérico mapeado para el músculo: ${muscleId}`);
    }
  };

  /**
   * Maneja el botón de retroceso para volver a la pantalla anterior
   */
  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fondo de imagen para toda la pantalla */}
      <ImageBackground 
        source={require('../../assets/template.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          {/* Header con botón de retroceso y títulos */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Seleccionar Músculo</Text>
              <Text style={styles.headerSubtitle}>Toca el músculo que deseas entrenar</Text>
            </View>
          </View>

          {/* Cards que muestran la información del objetivo y frecuencia seleccionados */}
          <View style={styles.infoContainer}>
            {/* Card de objetivo */}
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="flag" size={16} color="#4CAF50" />
                </View>
                <Text style={styles.infoLabel}>Objetivo</Text>
                <Text style={styles.infoValue}>{objetivoNombre}</Text>
              </View>
            </View>
            
            {/* Card de frecuencia */}
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="time" size={16} color="#4CAF50" />
                </View>
                <Text style={styles.infoLabel}>Frecuencia</Text>
                <Text style={styles.infoValue}>{frecuenciaNivel}</Text>
              </View>
            </View>
          </View>

          {/* Contenedor principal del mapa muscular y las instrucciones */}
          <View style={styles.bodyContainer}>
            {/* Contenedor del mapa muscular interactivo */}
            <View style={styles.muscleMapContainer}>
              <View style={styles.overlayContainer}>
                <MuscleOverlayMap
                  onMusclePress={handleMuscleSelection}
                />
              </View>
            </View>

            {/* Instrucciones para el usuario */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                Toca cualquier músculo para ver ejercicios específicos
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Contenedor principal con área segura
  safeArea: {
    flex: 1,
  },
  // Imagen de fondo que cubre toda la pantalla
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Contenedor principal con padding
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  // Header con fondo semi-transparente
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
  },
  // Botón de retroceso con fondo verde
  backButton: {
    padding: 8,
    marginRight: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    borderRadius: 8,
  },
  // Contenedor de textos del header
  headerTextContainer: {
    flex: 1,
  },
  // Título principal del header
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  // Subtítulo del header
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '400',
    opacity: 0.9,
  },
  // Contenedor de las cards de información
  infoContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    gap: 12,
  },
  // Estilo individual de cada card de información
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  // Contenedor de elementos dentro de cada card
  infoItem: {
    alignItems: 'center',
  },
  // Contenedor circular del ícono
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  // Etiqueta de la información (ej: "Objetivo")
  infoLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
    marginBottom: 4,
  },
  // Valor de la información (ej: "Hipertrofia")
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Contenedor principal del cuerpo (mapa + instrucciones)
  bodyContainer: {
    flex: 1,
    minHeight: 400, 
    paddingTop: 10,
  },
  // Contenedor del mapa muscular con fondo blanco y sombra
  muscleMapContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    marginVertical: 15, 
    paddingHorizontal: 15, 
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    justifyContent: 'flex-start', 
    alignItems: 'center', 
  },
  // Contenedor del overlay del mapa muscular con tamaño reducido
  overlayContainer: {
    width: '40%', 
    height: '40%',
    maxHeight: 150,
    maxWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100, 
    transform: [{ scale: 0.72 }],
  },
  // Contenedor de las instrucciones con fondo verde
  instructionsContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  // Texto de las instrucciones
  instructionsText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default MuscleSelectionView;