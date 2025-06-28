import { useEffect } from 'react';
import { Platform } from 'react-native';
import { initDB } from '../../services/db';
import InicioScreen from './inicio';

/**
 * Componente principal de la pantalla de inicio
 * Se encarga de inicializar la base de datos antes de mostrar el contenido
 */
export default function HomeScreen() {
  // Hook que se ejecuta una sola vez al montar el componente
  useEffect(() => {
    /**
     * Función asíncrona para inicializar la base de datos
     * Solo se ejecuta en plataformas móviles (iOS/Android), no en web
     */
    const initializeDatabase = async () => {
      // Verificar que no estemos en plataforma web
      if (Platform.OS !== 'web') {
        try {
          // Inicializar la base de datos usando el servicio importado
          await initDB();
          console.log('✅ Base de datos inicializada');
        } catch (error) {
          // Capturar y registrar cualquier error durante la inicialización
          console.error('❌ Error al inicializar la base de datos:', error);
        }
      }
    };
    
    // Ejecutar la inicialización de la base de datos
    initializeDatabase();
  }, []); // Array de dependencias vacío = solo se ejecuta al montar el componente

  // Renderizar la pantalla de inicio real
  return <InicioScreen />;
}