import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';


export default function ClassicSettingsScreen() {
  const [genre, setGenre] = useState('pop');
  const [era, setEra] = useState('90s');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Classic Mode Einstellungen</Text>

      <Text>Genre wählen:</Text>
      <Picker selectedValue={genre} onValueChange={setGenre}>
        <Picker.Item label="Pop" value="pop" />
        <Picker.Item label="Rock" value="rock" />
        <Picker.Item label="Hip Hop" value="hiphop" />
      </Picker>

      <Text>Jahrzehnt wählen:</Text>
      <Picker selectedValue={era} onValueChange={setEra}>
        <Picker.Item label="80er" value="80s" />
        <Picker.Item label="90er" value="90s" />
        <Picker.Item label="2000er" value="2000s" />
        <Picker.Item label="2010er" value="2010s" />
      </Picker>

      <Button title="Starten" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
