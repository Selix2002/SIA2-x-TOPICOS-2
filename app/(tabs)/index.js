import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { initDB } from '../../services/db';
import InicioScreen from './inicio'; // Importamos la nueva pantalla de inicio

export default function HomeScreen() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      initDB();
    }
  }, []);

  return (
    <InicioScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
