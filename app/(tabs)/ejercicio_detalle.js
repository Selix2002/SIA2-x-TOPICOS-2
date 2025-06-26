// ejercicio_detalle.js
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useCallback, useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getEjercicioDetalle } from '../../services/db';
import GymButton from './gymbutton';

// Función para mapear ejercicios a videos (directamente en el archivo)
const getVideoForExercise = (exerciseName) => {
  const videoMap = {
    'Bicycle crunch': require('../../assets/vids//Bicycle_crunch.webm'),
    'Burpee con curl de bíceps': require('../../assets/vids//Burpee_con_curl_de_bíceps.webm'),
    'Chin-up supino (negativos asistidos)': require('../../assets/vids//Chin-up_supino(negativos_asistidos).webm'),
    'Crunch con carga': require('../../assets/vids//Crunch_con_carga.webm'),
    'Curl alterno con mancuerna': require('../../assets/vids//Curl_alterno_con_mancuerna.webm'),
    'Curl alterno con mancuerna y salto ligero': require('../../assets/vids//Curl_alterno_con_mancuerna_y_salto_ligero.webm'),
    'Curl con banda en zona de pulsos': require('../../assets/vids//Curl_con_banda_en_zona_de_pulsos.webm'),
    'Curl con banda elástica': require('../../assets/vids//Curl_de_bíceps con_banda_elástica.webm'),
    'Curl rápido con banda elástica': require('../../assets/vids//Curl_rápido_con_banda_elástica.webm'),
    'Elevación de piernas tumbado': require('../../assets/vids//Elevación_de_piernas_tumbado.webm'),
    'Flutter kicks': require('../../assets/vids//Flutter_kicks.webm'),
    'Jump squats': require('../../assets/vids//Jump_squats.mp4'),
    'Jumping lunges': require('../../assets/vids//Jumping_lunges.webm'),
    'Mountain climbers': require('../../assets/vids//Mountain_climbers.mp4'),
    'Plank jacks': require('../../assets/vids//Plank_jacks.webm'),
    'Plank to knee-tap': require('../../assets/vids//Plank_to_knee-tap.webm'),
    'Renegade row alterno': require('../../assets/vids//Renegade_row_alterno.webm'),
    'Russian twists con peso': require('../../assets/vids//Russian_twists_con_peso.webm'),
    'Russian twists rápidos': require('../../assets/vids//Russian_twists_rápidos.webm'),
    'Sentadilla búlgara': require('../../assets/vids//Sentadilla_búlgara.webm'),
    'Sentadilla con mochila': require('../../assets/vids//Sentadilla_con_mochila.webm'),
    'Squat + Curl de bíceps': require('../../assets/vids//Squat_+_Curl_de_bíceps.mp4'),
    'Step-ups en escalón': require('../../assets/vids//Step-ups_en_escalón.webm'),
    'Tuck jumps': require('../../assets/vids//Tuck_jumps.webm'),
    'Walking lunges dinámicos': require('../../assets/vids//Walking_lunges_dinámicos.webm'),
    'Zancadas inversas': require('../../assets/vids//Zancadas_inversas.webm'),
  };

  return videoMap[exerciseName] || null;
};

// Función alternativa para normalizar nombres si hay diferencias menores
const getVideoForExerciseNormalized = (exerciseName) => {
  const normalizedName = exerciseName.trim().toLowerCase();
  
  const videoMapNormalized = {
    'bicycle crunch': require('../../assets/vids/Bicycle_crunch.webm'),
    'burpee con curl de bíceps': require('../../assets/vids/Burpee_con_curl_de_bíceps.webm'),
    'chin-up supino (negativos asistidos)': require('../../assets/vids/Chin-up_supino(negativos_asistidos).webm'),
    'crunch con carga': require('../../assets/vids/Crunch_con_carga.webm'),
    'curl alterno con mancuerna': require('../../assets/vids/Curl_alterno_con_mancuerna.webm'),
    'curl alterno con mancuerna y salto ligero': require('../../assets/vids/Curl_alterno_con_mancuerna_y_salto_ligero.webm'),
    'curl con banda en zona de pulsos': require('../../assets/vids/Curl_con_banda_en_zona_de_pulsos.webm'),
    'curl con banda elástica': require('../../assets/vids/Curl_de_bíceps con_banda_elástica.webm'),
    'curl rápido con banda elástica': require('../../assets/vids/Curl_rápido_con_banda_elástica.webm'),
    'elevación de piernas tumbado': require('../../assets/vids/Elevación_de_piernas_tumbado.webm'),
    'flutter kicks': require('../../assets/vids/Flutter_kicks.webm'),
    'jump squats': require('../../assets/vids/Jump_squats.mp4'),
    'jumping lunges': require('../../assets/vids/Jumping_lunges.webm'),
    'mountain climbers': require('../../assets/vids/Mountain_climbers.mp4'),
    'plank jacks': require('../../assets/vids/Plank_jacks.webm'),
    'plank to knee-tap': require('../../assets/vids/Plank_to_knee-tap.webm'),
    'renegade row alterno': require('../../assets/vids/Renegade_row_alterno.webm'),
    'russian twists con peso': require('../../assets/vids/Russian_twists_con_peso.webm'),
    'russian twists rápidos': require('../../assets/vids/Russian_twists_rápidos.webm'),
    'sentadilla búlgara': require('../../assets/vids/Sentadilla_búlgara.webm'),
    'sentadilla con mochila': require('../../assets/vids/Sentadilla_con_mochila.webm'),
    'squat + curl de bíceps': require('../../assets/vids/Squat_+_Curl_de_bíceps.mp4'),
    'step-ups en escalón': require('../../assets/vids/Step-ups_en_escalón.webm'),
    'tuck jumps': require('../../assets/vids/Tuck_jumps.webm'),
    'walking lunges dinámicos': require('../../assets/vids/Walking_lunges_dinámicos.webm'),
    'zancadas inversas': require('../../assets/vids/Zancadas_inversas.webm'),
  };

  return videoMapNormalized[normalizedName] || null;
};

const EjercicioDetalleScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const ejercicioId = params.ejercicioId ? parseInt(String(params.ejercicioId), 10) : null;
  const frecuenciaId = params.frecuenciaId ? parseInt(String(params.frecuenciaId), 10) : null;

  const [ejercicio, setEjercicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoSource, setVideoSource] = useState(null);

  // Crear el reproductor de video
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const fetchEjercicioDetalle = useCallback(async () => {
    if (!ejercicioId || !frecuenciaId) {
      setError("Parámetros inválidos");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await getEjercicioDetalle(ejercicioId, frecuenciaId);
      
      if (data) {
        setEjercicio(data);
        
        // Obtener el video correspondiente al ejercicio
        let video = getVideoForExercise(data.nombre);
        
        // Si no encuentra el video con el nombre exacto, intentar con normalización
        if (!video) {
          video = getVideoForExerciseNormalized(data.nombre);
        }
        
        setVideoSource(video);
        
        if (!video) {
          console.warn(`No se encontró video para el ejercicio: ${data.nombre}`);
        }
      } else {
        setError("Ejercicio no encontrado");
      }
    } catch (error) {
      console.error("Error al obtener detalle del ejercicio:", error);
      setError("Error al cargar el ejercicio");
    } finally {
      setLoading(false);
    }
  }, [ejercicioId, frecuenciaId]);

  useEffect(() => {
    fetchEjercicioDetalle();
  }, [fetchEjercicioDetalle]);

  // Actualizar el reproductor cuando cambie el videoSource
  useEffect(() => {
    if (videoSource && player) {
      // Usar replaceAsync para evitar bloqueos en el hilo principal en iOS
      player.replaceAsync(videoSource).catch((error) => {
        console.error('Error al cargar el video:', error);
      });
    }
  }, [videoSource, player]);

  if (loading) {
    return (
      <ImageBackground source={require('../../assets/template.jpg')} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.center}>
          <View style={styles.centerCard}>
            <Text style={styles.loadingText}>Cargando ejercicio...</Text>
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
              onPress={fetchEjercicioDetalle}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (!ejercicio) {
    return (
      <ImageBackground source={require('../../assets/template.jpg')} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.center}>
          <View style={styles.centerCard}>
            <Text style={styles.noResultsTitle}>Ejercicio no encontrado</Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../../assets/template.jpg')} style={styles.fullBackgroundImage} resizeMode="cover">
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
            <View style={styles.container}>
              {/* Header con botón de retroceso */}
              <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.title} numberOfLines={1}>{ejercicio.nombre}</Text>
                  <Text style={styles.subtitle}>
                    {ejercicio.objetivo} • {ejercicio.frecuencia}
                  </Text>
                </View>
              </View>
            </View>

          <View style={styles.contentArea}>
            {/* Video del ejercicio */}
            {videoSource && (
              <View style={styles.videoContainer}>
                <VideoView
                  style={styles.video}
                  player={player}
                  allowsFullscreen
                  allowsPictureInPicture
                />
              </View>
            )}

            {/* Descripción del ejercicio */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{ejercicio.descripcion}</Text>
            </View>

            {/* Parámetros del ejercicio */}
            <View style={styles.parametersContainer}>
              <Text style={styles.sectionTitle}>Parámetros de Entrenamiento</Text>

              <View style={styles.parameterRow}>
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
              </View>
            </View>

            {/* Botones de acción */}
            <View style={[styles.buttonContainer, { alignItems: 'center', marginTop: 30 }]}>
              <GymButton
                label="Ver más ejercicios"
                style={styles.actionButton}
                onPress={() => router.back()} // Usar router.back()
              />
              <GymButton
                label="Volver al inicio"
                style={styles.actionButton}
                onPress={() => router.push('/(tabs)/inicio')} // Usar router.push()
              />
            </View>

            {/* Nota sobre el video */}
            {!videoSource && (
              <View style={styles.noVideoContainer}>
                <Text style={styles.noVideoText}>
                  Video no disponible para este ejercicio
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullBackgroundImage: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  container: {
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  contentArea: {
    marginTop: -20, // Solapar ligeramente el header para un look más integrado
    paddingHorizontal: 15,
  },
  videoContainer: {
    marginBottom: 15,
    backgroundColor: '#4682B4',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', // Para que el video respete el borde redondeado
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  sectionContainer: {
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  parametersContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
  actionButton: {
    backgroundColor: '#4CAF50',
  },
  noVideoContainer: {
    marginHorizontal: 5,
    marginTop: 10,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  noVideoText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
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
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default EjercicioDetalleScreen;