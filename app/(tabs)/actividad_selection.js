import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFrecuencias } from '../../services/db';

/**
 * Componente que permite al usuario seleccionar su nivel de actividad física
 * Muestra una lista de frecuencias obtenidas de la base de datos
 * @returns {JSX.Element} Pantalla de selección de actividad
 */
const ActividadSelectionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams(); // Obtiene parámetros de navegación
  
  // Estado para almacenar las frecuencias de actividad
  const [frecuencias, setFrecuencias] = useState([]);
  // Estado para controlar la pantalla de carga
  const [loading, setLoading] = useState(true);

  /**
   * Efecto que se ejecuta al montar el componente
   * Obtiene las frecuencias de actividad desde la base de datos
   */
  useEffect(() => {
    const fetchFrecuencias = async () => {
      try {
        // Llama al servicio para obtener las frecuencias
        const data = await getFrecuencias();
        setFrecuencias(data);
      } catch (error) {
        console.error("Error al obtener frecuencias:", error);
      } finally {
        // Siempre termina el estado de carga
        setLoading(false);
      }
    };

    fetchFrecuencias();
  }, []);

  /**
   * Maneja la selección de una frecuencia de actividad
   * @param {number} frecuenciaId - ID de la frecuencia seleccionada
   * @param {string} frecuenciaNivel - Nivel de actividad seleccionado
   */
  const handleFrecuenciaSelect = (frecuenciaId, frecuenciaNivel) => {
    // Crear objeto con parámetros base para la navegación
    const navigationParams = {
      frecuenciaId: frecuenciaId.toString(),
      frecuenciaNivel: frecuenciaNivel,
      returnFrom: 'actividad' // Identificador de pantalla origen
    };

    // Preservar parámetros de objetivo si existen en la navegación anterior
    if (params.objetivoId && params.objetivoNombre) {
      navigationParams.objetivoId = params.objetivoId.toString();
      navigationParams.objetivoNombre = params.objetivoNombre;
    }

    console.log('Navegando con parámetros:', navigationParams);
    
    // Navegar a la pantalla principal con todos los parámetros
    router.push({
      pathname: '/(tabs)/inicio',
      params: navigationParams
    });
  };

  // Mostrar pantalla de carga mientras se obtienen los datos
  if (loading) {
    return (
      <ImageBackground
        source={require('../../assets/template.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.center}>
          <Text style={styles.loadingText}>Cargando niveles de actividad...</Text>
        </View>
      </ImageBackground>
    );
  }

  // Renderizar la pantalla principal con las opciones de actividad
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/template.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Selecciona tu Nivel de Actividad</Text>
          
          {/* Contenedor de opciones de frecuencia */}
          <View style={styles.optionsContainer}>
            {frecuencias.map((frecuencia) => (
              <TouchableOpacity
                key={frecuencia.id}
                style={styles.optionButton}
                onPress={() => handleFrecuenciaSelect(frecuencia.id, frecuencia.nivel)}
              >
                <Text style={styles.optionText}>{frecuencia.nivel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60, // Espacio extra en la parte superior
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo semitransparente
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 15,
    color: '#000',
    padding: 15,
    borderRadius: 10,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#4CAF50', // Verde material design
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 5,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
  },
});

export default ActividadSelectionScreen;