// actividad_selection.js (corregido)
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFrecuencias } from '../../services/db';

const ActividadSelectionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [frecuencias, setFrecuencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrecuencias = async () => {
      try {
        const data = await getFrecuencias();
        setFrecuencias(data);
      } catch (error) {
        console.error("Error al obtener frecuencias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFrecuencias();
  }, []);

  const handleFrecuenciaSelect = (frecuenciaId, frecuenciaNivel) => {
    // Crear objeto con todos los parámetros necesarios
    const navigationParams = {
      frecuenciaId: frecuenciaId.toString(),
      frecuenciaNivel: frecuenciaNivel,
      returnFrom: 'actividad'
    };

    // Preservar el objetivo si existe
    if (params.objetivoId && params.objetivoNombre) {
      navigationParams.objetivoId = params.objetivoId.toString();
      navigationParams.objetivoNombre = params.objetivoNombre;
    }

    console.log('Navegando con parámetros:', navigationParams);

    // Usar push en lugar de replace
    router.push({
      pathname: '/(tabs)/inicio',
      params: navigationParams
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando niveles de actividad...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Selecciona tu Nivel de Actividad</Text>
        
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f9',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    color: '#333',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});

export default ActividadSelectionScreen;