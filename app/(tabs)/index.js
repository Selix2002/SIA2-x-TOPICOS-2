import { useEffect } from 'react';
import { Platform } from 'react-native';
import { initDB } from '../../services/db';
import InicioScreen from './inicio';

export default function HomeScreen() {
  useEffect(() => {
    const initializeDatabase = async () => {
      if (Platform.OS !== 'web') {
        try {
          // Inicializar la base de datos
          await initDB();

          console.log('✅ Base de datos inicializada');
        } catch (error) {
          console.error('❌ Error al inicializar la base de datos:', error);
        }
      }
    };

    initializeDatabase();
  }, []);

  return <InicioScreen />;
}