import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getEjerciciosPorMusculo } from '../../services/db';

const ListaEjerciciosScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const musculoId = params.musculoId ? parseInt(String(params.musculoId), 10) : null;
  const objetivoId = params.objetivoId ? parseInt(String(params.objetivoId), 10) : null;
  const nombreMusculo = params.nombreMusculo || "Músculo"; // Para el título

  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Frecuencia por defecto para pasar a la pantalla de detalle
  const defaultFrecuenciaId = 2; // "1–3 h/semana"

  useEffect(() => {
    const fetchEjercicios = async () => {
      if (musculoId === null || objetivoId === null) {
        console.warn("MusculoId u ObjetivoId no proporcionados a ListaEjerciciosScreen");
        setLoading(false);
        return;
      }
      try {
        console.log(`Buscando ejercicios para musculoId: ${musculoId}, objetivoId: ${objetivoId}`);
        const data = await getEjerciciosPorMusculo(musculoId, objetivoId);
        setEjercicios(data);
      } catch (error) {
        console.error("Error al obtener ejercicios por músculo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEjercicios();
  }, [musculoId, objetivoId]);

  const handleEjercicioPress = (ejercicioId) => {
    router.push({
      pathname: '/(tabs)/ejercicio_detalle',
      params: {
        ejercicioId: ejercicioId,
        frecuenciaId: defaultFrecuenciaId,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando ejercicios...</Text>
      </View>
    );
  }

  if (!ejercicios || ejercicios.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No se encontraron ejercicios para {nombreMusculo} con el objetivo actual.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Ejercicios para {nombreMusculo}</Text>
      <FlatList
        data={ejercicios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer} onPress={() => handleEjercicioPress(item.id)}>
            <Text style={styles.itemText}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 15,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 18,
    color: '#444',
  },
});

export default ListaEjerciciosScreen;
