import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Slider from '@react-native-community/slider';


export default function ChallengeSettingsScreen() {
  const [questionTime, setQuestionTime] = useState(10);
  const [totalTime, setTotalTime] = useState(60);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Challenge Mode Einstellungen</Text>

      <Text>⏱️ Zeit pro Frage: {questionTime}s</Text>
      <Slider minimumValue={5} maximumValue={30} step={1} value={questionTime} onValueChange={setQuestionTime} />

      <Text>⏲️ Gesamtspielzeit: {totalTime}s</Text>
      <Slider minimumValue={30} maximumValue={180} step={10} value={totalTime} onValueChange={setTotalTime} />

      <Button title="Starten" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
