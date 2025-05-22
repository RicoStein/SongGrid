import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label: string;
};

export default function CustomCheckbox({ value, onValueChange, label }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onValueChange(!value)}>
      <View style={[styles.box, value && styles.checked]}>
        {value && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#5538fb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checked: {
    backgroundColor: '#5538fb',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
  },
  label: {
    color: '#b1b0b6',
    fontSize: 14,
  },
});
