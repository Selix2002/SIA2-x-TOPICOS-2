import { useRouter } from 'expo-router'; // Importar useRouter
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import MuscleOverlayMap from "../../components/MuscleOverlayMap";

const MuscleSelectionView = () => {
  const router = useRouter(); // Obtener instancia del router
  const muscleNameToIdMap = {
    'abdominales': 2,
    'biceps': 1,
    'cuadriceps': 3
  };
  const defaultObjetivoId = 1; // Hipertrofia

  const handleMuscleSelection = (muscleId) => {
    console.log("Músculo seleccionado (string) en MuscleSelectionView:", muscleId);
    const musculo_id_numerico = muscleNameToIdMap[muscleId];

    if (musculo_id_numerico) {
      router.push({
        pathname: '/(tabs)/lista_ejercicios', // Navegar a la nueva pantalla de lista
        params: {
          musculoId: musculo_id_numerico, // ID numérico para la BD
          objetivoId: defaultObjetivoId, // Objetivo por defecto
          // Podrías pasar el nombre del músculo también si quieres mostrarlo en el título de la lista
          nombreMusculo: muscleId.charAt(0).toUpperCase() + muscleId.slice(1)
        },
      });
    } else {
      console.warn(`No hay un ID numérico mapeado para el músculo: ${muscleId}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Toca un músculo</Text>
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
    marginBottom: 12,
  },
});

export default MuscleSelectionView;
