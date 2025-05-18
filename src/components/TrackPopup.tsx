import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onTogglePlayPause: () => void;
  onSkip: () => void;
  isPlaying: boolean;
  track: {
    title: string;
    artist: string;
    year: string;
    genre: string;
    image: string;
  };
};

export default function TrackPopup({
  visible,
  onClose,
  onTogglePlayPause,
  onSkip,
  isPlaying,
  track,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {track.image && (
            <Image source={{ uri: track.image }} style={styles.cover} />
          )}
          <Text style={styles.title}>{track.title}</Text>
          <Text style={styles.artist}>{track.artist}</Text>
          <Text style={styles.details}>
            📅 {track.year} · 🎵 {track.genre}
          </Text>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={onTogglePlayPause}>
              <Text style={styles.buttonText}>
                {isPlaying ? '⏸️ Pause' : '▶️ Wiedergabe'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={onSkip}>
              <Text style={styles.buttonText}>⏭️ Nächster</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  cover: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0B3D91',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  close: {
    marginTop: 10,
  },
  closeText: {
    color: '#0B3D91',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
