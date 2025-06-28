import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getObjetivos } from '../../services/db';

/**
 * Pantalla para seleccionar el objetivo de entrenamiento
 * Permite navegar de vuelta a inicio preservando parámetros previos
 */
const ObjetivoSelectionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Estados para manejo de datos
  const [objetivos, setObjetivos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar objetivos desde la base de datos al montar el componente
  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const data = await getObjetivos();
        setObjetivos(data);
      } catch (error) {
        console.error("Error al obtener objetivos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchObjetivos();
  }, []);

  /**
   * Maneja la selección de un objetivo
   * Preserva parámetros existentes y navega a inicio
   * @param {number} objetivoId - ID del objetivo seleccionado
   * @param {string} objetivoNombre - Nombre del objetivo para mostrar en UI
   */
  const handleObjetivoSelect = (objetivoId, objetivoNombre) => {
    // Crear objeto con parámetros base requeridos
    const navigationParams = {
      objetivoId: objetivoId.toString(),
      objetivoNombre: objetivoNombre,
      returnFrom: 'objetivo' // Identificador para lógica de navegación
    };
    
    // Preservar parámetros de frecuencia si existen en la navegación previa
    if (params.frecuenciaId && params.frecuenciaNivel) {
      navigationParams.frecuenciaId = params.frecuenciaId.toString();
      navigationParams.frecuenciaNivel = params.frecuenciaNivel;
    }
    
    console.log('Navegando con parámetros:', navigationParams);
    
    // Navegar a pantalla de inicio con todos los parámetros
    router.push({
      pathname: '/(tabs)/inicio',
      params: navigationParams
    });
  };

  // Estado de carga: mostrar indicador
  if (loading) {
    return (
      <ImageBackground
        source={require('../../assets/template.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.center}>
          <Text style={styles.loadingText}>Cargando objetivos...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/template.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Selecciona tu Objetivo</Text>
         
          {/* Lista de objetivos disponibles */}
          <View style={styles.optionsContainer}>
            {objetivos.map((objetivo) => (
              <TouchableOpacity
                key={objetivo.id}
                style={styles.optionButton}
                onPress={() => handleObjetivoSelect(objetivo.id, objetivo.nombre)}
              >
                <Text style={styles.optionText}>{objetivo.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Contenedores principales
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
    paddingTop: 60,
  },
  
  // Estado de carga
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo semi-transparente para legibilidad
    padding: 15,
    borderRadius: 10,
  },
  
  // Título principal
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
  
  // Contenedor de opciones
  optionsContainer: {
    flex: 1,
    justifyContent: 'center', // Centrar verticalmente las opciones
  },
  
  // Botones de objetivo
  optionButton: {
    backgroundColor: '#4CAF50', // Verde del tema
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Elevación para Android
    elevation: 5,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
  },
});

export default ObjetivoSelectionScreen;