// inicio.js (corregido y mejorado)
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import GymButton from './gymbutton';

const InicioScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Estados para almacenar las selecciones del usuario
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [selectedFrecuencia, setSelectedFrecuencia] = useState(null);

  useEffect(() => {
    console.log('Parámetros recibidos en inicio:', params);
    
    const returnFrom = params.returnFrom;
    const objetivoId = params.objetivoId;
    const objetivoNombre = params.objetivoNombre;
    const frecuenciaId = params.frecuenciaId;
    const frecuenciaNivel = params.frecuenciaNivel;

    // Si viene de selección de objetivo
    if (returnFrom === 'objetivo' && objetivoId && objetivoNombre) {
      const objetivoIdNum = parseInt(objetivoId, 10);
      // Solo actualizar si es diferente del actual
      if (!selectedObjetivo || selectedObjetivo.id !== objetivoIdNum) {
        console.log('Actualizando objetivo:', { id: objetivoIdNum, nombre: objetivoNombre });
        setSelectedObjetivo({
          id: objetivoIdNum,
          nombre: objetivoNombre
        });
      }
    }
    
    // Si viene de selección de actividad
    if (returnFrom === 'actividad' && frecuenciaId && frecuenciaNivel) {
      const frecuenciaIdNum = parseInt(frecuenciaId, 10);
      // Solo actualizar si es diferente del actual
      if (!selectedFrecuencia || selectedFrecuencia.id !== frecuenciaIdNum) {
        console.log('Actualizando frecuencia:', { id: frecuenciaIdNum, nivel: frecuenciaNivel });
        setSelectedFrecuencia({
          id: frecuenciaIdNum,
          nivel: frecuenciaNivel
        });
      }
    }

    // Preservar selecciones existentes cuando no vienen en returnFrom
    if ((!returnFrom || returnFrom !== 'objetivo') && objetivoId && objetivoNombre && !selectedObjetivo) {
      const objetivoIdNum = parseInt(objetivoId, 10);
      setSelectedObjetivo({
        id: objetivoIdNum,
        nombre: objetivoNombre
      });
    }

    if ((!returnFrom || returnFrom !== 'actividad') && frecuenciaId && frecuenciaNivel && !selectedFrecuencia) {
      const frecuenciaIdNum = parseInt(frecuenciaId, 10);
      setSelectedFrecuencia({
        id: frecuenciaIdNum,
        nivel: frecuenciaNivel
      });
    }
  }, [params.returnFrom, params.objetivoId, params.objetivoNombre, params.frecuenciaId, params.frecuenciaNivel]);

  const handleObjetivoPress = () => {
    // Pasar las selecciones actuales para preservarlas
    const navigationParams = {};
    
    if (selectedFrecuencia) {
      navigationParams.frecuenciaId = selectedFrecuencia.id.toString();
      navigationParams.frecuenciaNivel = selectedFrecuencia.nivel;
    }

    router.push({
      pathname: '/objetivo_selection',
      params: navigationParams
    });
  };

  const handleActividadPress = () => {
    // Pasar las selecciones actuales para preservarlas
    const navigationParams = {};
    
    if (selectedObjetivo) {
      navigationParams.objetivoId = selectedObjetivo.id.toString();
      navigationParams.objetivoNombre = selectedObjetivo.nombre;
    }

    router.push({
      pathname: '/actividad_selection',
      params: navigationParams
    });
  };

  const handleAcceptPress = () => {
    // Verificar que ambos parámetros estén seleccionados
    if (!selectedObjetivo || !selectedFrecuencia) {
      alert('Por favor selecciona tanto el objetivo como el nivel de actividad física');
      return;
    }

    console.log('Navegando con selecciones completas:', {
      objetivo: selectedObjetivo,
      frecuencia: selectedFrecuencia
    });

    // Navegar a la selección de músculo con los parámetros
    router.push({
      pathname: '/select_musc',
      params: {
        objetivoId: selectedObjetivo.id.toString(),
        objetivoNombre: selectedObjetivo.nombre,
        frecuenciaId: selectedFrecuencia.id.toString(),
        frecuenciaNivel: selectedFrecuencia.nivel
      }
    });
  };

  // Función para mostrar el texto del botón con la selección actual
  const getObjetivoButtonText = () => {
    return selectedObjetivo ? `Objetivo: ${selectedObjetivo.nombre}` : 'Objetivo';
  };

  const getActividadButtonText = () => {
    return selectedFrecuencia ? `Actividad: ${selectedFrecuencia.nivel}` : 'Actividad física';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/logoapp.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.middleButtonsContainer}>
          <GymButton 
            label={getObjetivoButtonText()} 
            onPress={handleObjetivoPress}
            style={selectedObjetivo ? styles.selectedButton : null}
          />
          <GymButton 
            label={getActividadButtonText()} 
            onPress={handleActividadPress}
            style={selectedFrecuencia ? styles.selectedButton : null}
          />
        </View>

        {/* Mostrar información de selecciones actuales */}
        {(selectedObjetivo || selectedFrecuencia) && (
          <View style={styles.selectionInfo}>
            {selectedObjetivo && (
              <Text style={styles.selectionText}>
                ✓ Objetivo: {selectedObjetivo.nombre}
              </Text>
            )}
            {selectedFrecuencia && (
              <Text style={styles.selectionText}>
                ✓ Actividad: {selectedFrecuencia.nivel}
              </Text>
            )}
          </View>
        )}

        <View style={styles.bottomButtonContainer}>
          <GymButton 
            label="Aceptar" 
            onPress={handleAcceptPress}
            style={selectedObjetivo && selectedFrecuencia ? styles.enabledAcceptButton : styles.disabledAcceptButton}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 300,
    height: 150,
  },
  middleButtonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  selectionInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectionText: {
    fontSize: 16,
    color: '#4C6DFF',
    marginVertical: 2,
    fontWeight: '500',
  },
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: '#4C6DFF',
  },
  enabledAcceptButton: {
    backgroundColor: '#28a745',
  },
  disabledAcceptButton: {
    backgroundColor: '#ccc',
  },
});

export default InicioScreen;