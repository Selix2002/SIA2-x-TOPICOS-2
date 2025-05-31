// app/(tabs)/index.js
import React, { useEffect, useState } from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { getItems, initDB, insertTestItems } from '../../services/db';

export default function HomeScreen() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      initDB();
    }
  }, []);

  const handlePress = async () => {
    if (Platform.OS === 'web') return;

    try {
      // 1) Esperar a que terminen los INSERTs
      await insertTestItems();

      // 2) Luego hacer el SELECT
      const rows = await getItems();
      console.log('Items leídos:', rows);
      setItems(rows);

    } catch (error) {
      console.error('Error en handlePress:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Mostrar Datos" onPress={handlePress} />
      {items.map(item => (
        <Text key={item.id} style={styles.itemText}>
          {item.name}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  itemText: {
    marginTop: 10,
    fontSize: 18,
  },
});
