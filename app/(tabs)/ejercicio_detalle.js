// ejercicioDetalle.js
import { useLocalSearchParams, useRouter } from 'expo-router'; // Importar hooks de Expo Router
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getEjercicioDetalle } from '../../services/db';
import GymButton from './gymbutton';

const EjercicioDetalleScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter(); // Para la navegación hacia atrás

  // Los parámetros de useLocalSearchParams vienen como strings, convertir a número.
  const ejercicioId = params.ejercicioId ? parseInt(String(params.ejercicioId), 10) : null;
  const frecuenciaId = params.frecuenciaId ? parseInt(String(params.frecuenciaId), 10) : null;

  const [ejercicio, setEjercicio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEjercicio = async () => {
      try {
        const detalle = await getEjercicioDetalle(ejercicioId, frecuenciaId);
        if (!detalle) {
          // Manejar el caso en que no se encuentren detalles
          console.warn(`No se encontraron detalles para ejercicioId: ${ejercicioId}, frecuenciaId: ${frecuenciaId}`);
        }
        setEjercicio(detalle);
      } catch (error) {
        console.error("Error al obtener detalles del ejercicio:", error);
      } finally {
        setLoading(false);
      }
    };

    // Asegurarse de que los IDs son válidos antes de hacer fetch
    if (ejercicioId !== null && frecuenciaId !== null) {
      fetchEjercicio();
    }
  }, [ejercicioId, frecuenciaId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!ejercicio && !loading) { // Mostrar solo si no está cargando y no hay ejercicio
    return (
      <View style={styles.center}>
        <Text>No se encontró el ejercicio</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Título del ejercicio */}
        <Text style={styles.title}>{ejercicio.nombre}</Text>
        
        {/* Sección de Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESCRIPCIÓN DEL EJERCICIO</Text>
          <Text style={styles.description}>{ejercicio.descripcion}</Text>
        </View>
        
        {/* Sección de Requerimientos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OTROS REQUERIMIENTOS</Text>
          <View style={styles.requirementRow}>
            <Text style={styles.requirementLabel}>Series:</Text>
            <Text style={styles.requirementValue}>{ejercicio.series}</Text>
          </View>
          <View style={styles.requirementRow}>
            <Text style={styles.requirementLabel}>Repeticiones:</Text>
            <Text style={styles.requirementValue}>{ejercicio.repeticiones}</Text>
          </View>
          <View style={styles.requirementRow}>
            <Text style={styles.requirementLabel}>Descanso:</Text>
            <Text style={styles.requirementValue}>{ejercicio.descanso} segundos</Text>
          </View>
          <View style={styles.requirementRow}>
            <Text style={styles.requirementLabel}>Frecuencia:</Text>
            <Text style={styles.requirementValue}>{ejercicio.frecuencia}</Text>
          </View>
          <View style={styles.requirementRow}>
            <Text style={styles.requirementLabel}>Objetivo:</Text>
            <Text style={styles.requirementValue}>{ejercicio.objetivo}</Text>
          </View>
        </View>
        
        {/* Botón de acción */}
        <View style={styles.buttonContainer}>
          <GymButton 
            label="Siguiente" 
            onPress={() => router.back()} // Usar router.back()
          />
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4C6DFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  requirementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  requirementLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  requirementValue: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default EjercicioDetalleScreen;