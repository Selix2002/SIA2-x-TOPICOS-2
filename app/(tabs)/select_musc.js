// select_musc.js (actualizado)
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import MuscleOverlayMap from "../../components/MuscleOverlayMap";

const MuscleSelectionView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Obtener los parámetros pasados desde la pantalla de inicio
  const objetivoId = params.objetivoId ? parseInt(params.objetivoId) : 1; // Default hipertrofia
  const objetivoNombre = params.objetivoNombre || 'Hipertrofia';
  const frecuenciaId = params.frecuenciaId ? parseInt(params.frecuenciaId) : 2; // Default 1-3 h/semana
  const frecuenciaNivel = params.frecuenciaNivel || '1–3 h/semana';

  const muscleNameToIdMap = {
    'abdominales': 2,
    'biceps': 1,
    'cuadriceps': 3
  };

  const handleMuscleSelection = (muscleId) => {
    console.log("Músculo seleccionado:", muscleId);
    console.log("Con objetivo:", objetivoNombre, "ID:", objetivoId);
    console.log("Con frecuencia:", frecuenciaNivel, "ID:", frecuenciaId);
    
    const musculo_id_numerico = muscleNameToIdMap[muscleId];

    if (musculo_id_numerico) {
      router.push({
        pathname: '/(tabs)/lista_ejercicios',
        params: {
          musculoId: musculo_id_numerico,
          objetivoId: objetivoId,
          frecuenciaId: frecuenciaId, // Ahora también pasamos frecuenciaId
          nombreMusculo: muscleId.charAt(0).toUpperCase() + muscleId.slice(1),
          objetivoNombre: objetivoNombre,
          frecuenciaNivel: frecuenciaNivel
        },
      });
    } else {
      console.warn(`No hay un ID numérico mapeado para el músculo: ${muscleId}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Toca un músculo</Text>
      <Text style={styles.subtitle}>
        Objetivo: {objetivoNombre} | Actividad: {frecuenciaNivel}
      </Text>
      <MuscleOverlayMap
        onMusclePress={handleMuscleSelection}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default MuscleSelectionView;