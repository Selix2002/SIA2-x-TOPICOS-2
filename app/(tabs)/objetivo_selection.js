// objetivo_selection.js (corregido)
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getObjetivos } from '../../services/db';

const ObjetivoSelectionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [objetivos, setObjetivos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleObjetivoSelect = (objetivoId, objetivoNombre) => {
    // Crear objeto con todos los parámetros necesarios
    const navigationParams = {
      objetivoId: objetivoId.toString(),
      objetivoNombre: objetivoNombre,
      returnFrom: 'objetivo'
    };

    // Preservar la frecuencia si existe
    if (params.frecuenciaId && params.frecuenciaNivel) {
      navigationParams.frecuenciaId = params.frecuenciaId.toString();
      navigationParams.frecuenciaNivel = params.frecuenciaNivel;
    }

    console.log('Navegando con parámetros:', navigationParams);

    // Usar push en lugar de replace y luego hacer pop para simular replace
    router.push({
      pathname: '/(tabs)/inicio',
      params: navigationParams
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando objetivos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Selecciona tu Objetivo</Text>
        
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

export default ObjetivoSelectionScreen;