import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import GymButton from './gymbutton';

const InicioScreen = () => {
  const handleOpcion1Press = () => {
    console.log('Botón "Objetivo" presionado');
  };

  const handleOpcion3Press = () => {
    console.log('Botón "Actividad física" presionado');
  };

  const handleAcceptPress = () => {
    console.log('Botón "Aceptar" presionado');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/logoapp.png')}
              style={styles.logo}
              resizeMode='contain'
            />
        </View>

        <View style={styles.middleButtonsContainer}>
          <GymButton label="Objetivo" onPress={handleOpcion1Press} />
          <GymButton label="Actividad física" onPress={handleOpcion3Press} />
        </View>

        <View style={styles.bottomButtonContainer}>
          <GymButton label="Aceptar" onPress={handleAcceptPress} />
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
    justifyContent: 'space-between', // Distribuye el espacio entre los grupos de elementos
    alignItems: 'center', // Centra los elementos horizontalmente
    paddingHorizontal: 20,
    paddingVertical: 30, // Padding vertical general
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20, // Un poco de margen superior para el título
    marginBottom: 10, // Un poco de margen inferior para los botones
  },
  logo: {
    width: 800,
    height: 400,
  },
  middleButtonsContainer: {
    width: '100%', // Ocupa el ancho para centrar los GymButton correctamente
    alignItems: 'center', // Centra los GymButton (que tienen su propio width)
  },
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center', // Centra el GymButton
    marginBottom: 10, // Un poco de margen inferior para el último botón
  },
});

export default InicioScreen;