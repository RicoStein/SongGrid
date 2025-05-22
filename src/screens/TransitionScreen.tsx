import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function TransitionScreen() {
  const opacity = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { target } = (route.params ?? { target: 'Login' }) as { target: string };

  useEffect(() => {
    // Fade-In (falls nötig), dann Fade-Out und dann Navigation
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100, // sehr kurz, falls du vorher was gefadet hast
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300, // lila bleibt stehen
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace(target);
    });
  }, [navigation, opacity, target]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {/* Komplett lila Fläche */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f0528',
    zIndex: 9999,
  },
});
