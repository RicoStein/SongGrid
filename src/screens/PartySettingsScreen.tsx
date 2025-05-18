import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PartySettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Party Mode</Text>
      <Text>Hier kannst du später Freunde einladen oder Teams erstellen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});
