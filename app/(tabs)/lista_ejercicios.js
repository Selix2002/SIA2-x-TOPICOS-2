// lista_ejercicios.js (limpio y optimizado)
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getEjerciciosPorMusculo } from '../../services/db';

const ListaEjerciciosScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Conversión de parámetros con validación
  const musculoId = params.musculoId ? parseInt(String(params.musculoId), 10) : null;
  const objetivoId = params.objetivoId ? parseInt(String(params.objetivoId), 10) : null;
  const frecuenciaId = params.frecuenciaId ? parseInt(String(params.frecuenciaId), 10) : 2;
  
  const nombreMusculo = params.nombreMusculo || "Músculo";
  const objetivoNombre = params.objetivoNombre || "Objetivo";
  const frecuenciaNivel = params.frecuenciaNivel || "1–3 h/semana";

  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función memoizada para evitar recreaciones innecesarias
  const fetchEjercicios = useCallback(async () => {
    if (musculoId === null || objetivoId === null) {
      console.warn("MusculoId u ObjetivoId no proporcionados a ListaEjerciciosScreen");
      setLoading(false);
      setError("Parámetros inválidos");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`Buscando ejercicios para musculoId: ${musculoId}, objetivoId: ${objetivoId}`);
      
      const data = await getEjerciciosPorMusculo(musculoId, objetivoId);
      
      // Validar que data es un array y no está vacío
      if (Array.isArray(data)) {
        // Filtrar duplicados localmente como medida de seguridad adicional
        const uniqueData = data.filter((item, index, self) => 
          index === self.findIndex(t => t.id === item.id)
        );
        
        if (data.length !== uniqueData.length) {
          console.warn(`⚠️ Se encontraron duplicados locales: ${data.length} total, ${uniqueData.length} únicos`);
        }
        
        setEjercicios(uniqueData);
        console.log(`✅ Se cargaron ${uniqueData.length} ejercicios únicos`);
      } else {
        console.warn("getEjerciciosPorMusculo no devolvió un array:", data);
        setEjercicios([]);
      }
    } catch (error) {
      console.error("Error al obtener ejercicios por músculo:", error);
      setError("Error al cargar ejercicios");
      setEjercicios([]);
    } finally {
      setLoading(false);
    }
  }, [musculoId, objetivoId]);

  useEffect(() => {
    fetchEjercicios();
  }, [fetchEjercicios]);

  const handleEjercicioPress = useCallback((ejercicioId) => {
    router.push({
      pathname: '/(tabs)/ejercicio_detalle',
      params: {
        ejercicioId: ejercicioId,
        frecuenciaId: frecuenciaId,
      },
    });
  }, [router, frecuenciaId]);

  // Función para renderizar cada item (memoizada)
  const renderEjercicio = useCallback(({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => handleEjercicioPress(item.id)}
    >
      <Text style={styles.itemTitle}>{item.nombre}</Text>
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.descripcion}
      </Text>
    </TouchableOpacity>
  ), [handleEjercicioPress]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Cargando ejercicios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchEjercicios}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!ejercicios || ejercicios.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noResultsTitle}>
          No se encontraron ejercicios
        </Text>
        <Text style={styles.noResultsSubtitle}>
          Para {nombreMusculo} con objetivo de {objetivoNombre}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Ejercicios para {nombreMusculo}</Text>
        <Text style={styles.subtitle}>
          {objetivoNombre} • {frecuenciaNivel}
        </Text>
      </View>
      
      <FlatList
        data={ejercicios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEjercicio}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Propiedades para optimizar rendimiento
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        // Evitar re-renders innecesarios
        getItemLayout={undefined} // Solo si los items tienen altura fija
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
  headerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  noResultsSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ListaEjerciciosScreen;