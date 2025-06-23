// lista_ejercicios.js (limpio y optimizado)
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  const handleBackPress = () => router.back();

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
      <ImageBackground source={require('../../assets/template.jpg')} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.center}>
          <View style={styles.centerCard}>
            <Text style={styles.loadingText}>Cargando ejercicios...</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground source={require('../../assets/template.jpg')} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.center}>
          <View style={styles.centerCard}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={fetchEjercicios}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (!ejercicios || ejercicios.length === 0) {
    return (
      <ImageBackground source={require('../../assets/template.jpg')} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.center}>
          <View style={styles.centerCard}>
            <Text style={styles.noResultsTitle}>
              No se encontraron ejercicios
            </Text>
            <Text style={styles.noResultsSubtitle}>
              Para {nombreMusculo} con objetivo de {objetivoNombre}
            </Text>
          </View>
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
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Ejercicios para {nombreMusculo}</Text>
              <Text style={styles.subtitle}>
                {objetivoNombre} • {frecuenciaNivel}
              </Text>
            </View>
          </View>
          
          <FlatList
            data={ejercicios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEjercicio}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
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
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '400',
    opacity: 0.9,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
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
    padding: 20,
    paddingTop: 0,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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