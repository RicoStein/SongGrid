import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';


export default function InformationPopup({ track, onSkip }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: track.image }} style={styles.cover} />
      <Text style={styles.title}>{track.title}</Text>
      <Text style={styles.artist}>{track.artist}</Text>
      <Text style={styles.year}>{track.year}</Text>
      <Text style={styles.genre}>{track.genre}</Text>

      <TouchableOpacity onPress={onSkip} style={styles.skip}>
        <Text style={styles.skipText}>Nächster Song</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',        // ✅ Weißer Hintergrund
    zIndex: 21,                     // ✅ Über YellowGamePopup
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cover: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 16,
    color: '#444',
  },
  year: {
    fontSize: 14,
    color: '#666',
  },
  genre: {
    fontSize: 14,
    color: '#666',
  },
  skip: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#0B3D91',
    borderRadius: 6,
  },
  skipText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
