
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import YellowGamePopup from '../components/YellowGamePopup';
import InformationPopup from '../components/InformationPopup';
import { useSharedValue } from 'react-native-reanimated';
import { useSpotify } from '../context/SpotifyContext';
import {RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

export default function GameOverlayScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'GameOverlay'>>();
  const navigation = useNavigation();
  const { accessToken } = useSpotify();
  const offsetY = useSharedValue(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [track, setTrack] = useState(route.params?.track || null);
  

  const pausePlayback = async () => {
    await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setIsPlaying(false);
  };

  const resumePlayback = async () => {
    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setIsPlaying(true);
  };

  const handleSkip = () => {
    // z.B. zurück zur Settings-Seite oder neue Runde
    navigation.goBack();
  };

  if (!track) {
    return (
      <View style={styles.fallback}>
        <Text>Kein Track übergeben.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InformationPopup
        track={track}
        onSkip={handleSkip}
      />
      <YellowGamePopup
        offsetY={offsetY}
        isPlaying={isPlaying}
        onTogglePlayPause={() => {
          isPlaying ? pausePlayback() : resumePlayback();
          setIsPlaying(!isPlaying);
        }}
        onHidden={() => {
          pausePlayback();
          setIsPlaying(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
