import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { initDB } from '../../services/db';
import MuscleSelectionView from './select_musc';

export default function HomeScreen() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      initDB();
    }
  }, []);

  return (
    <MuscleSelectionView />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
