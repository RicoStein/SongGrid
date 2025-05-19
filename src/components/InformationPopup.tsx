
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

type Props = {
  track: {
    title: string;
    artist: string;
    year: string;
    genre: string;
    image: string;
  };
  onSkip: () => void;
};

export default function InformationPopup({ track, onSkip }: Props) {
  const { height: SCREEN_HEIGHT } = useSafeAreaFrame();

  return (
    <View style={[styles(SCREEN_HEIGHT).container]}>
      <Image source={{ uri: track.image }} style={styles().cover} />
      <Text style={styles().title}>{track.title}</Text>
      <Text style={styles().artist}>{track.artist}</Text>
      <Text style={styles().year}>{track.year}</Text>
      <Text style={styles().genre}>{track.genre}</Text>
      <TouchableOpacity style={styles().skipButton} onPress={onSkip}>
        <Text style={styles().skipButtonText}>Nächster Song</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (height = 0) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
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
      color: 'gray',
    },
    year: {
      fontSize: 14,
      color: 'gray',
    },
    genre: {
      fontSize: 14,
      color: 'gray',
    },
    skipButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#0B3D91',
      borderRadius: 5,
    },
    skipButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });
