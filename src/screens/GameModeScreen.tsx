import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type Props = {
  route: RouteProp<RootStackParamList, 'GameMode'>;
};

export default function GameModeScreen({ route }: Props) {
  const { modeId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spielmodus: {modeId}</Text>
      <Text style={styles.subtitle}>Hier kannst du Einstellungen für diesen Modus vornehmen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center' },
});
