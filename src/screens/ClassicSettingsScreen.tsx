
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSpotify } from '../context/SpotifyContext';
import FilterGrid from '../components/FilterGrid';
import InformationPopup from '../components/InformationPopup';
import YellowGamePopup from '../components/YellowGamePopup';
import styles from './ClassicSettingsStyles';
import { useSharedValue } from 'react-native-reanimated';

const GENRE_OPTIONS = [
  { id: 'pop', label: 'Pop', colorImage: require('../../assets/filters/pop.png'), bwImage: require('../../assets/filters/bw/pop.png') },
  { id: 'rock', label: 'Rock', colorImage: require('../../assets/filters/rock.png'), bwImage: require('../../assets/filters/bw/rock.png') },
  { id: 'hip-hop', label: 'Hip Hop', colorImage: require('../../assets/filters/hip-hop.png'), bwImage: require('../../assets/filters/bw/hip-hop.png') },
  { id: 'jazz', label: 'Jazz', colorImage: require('../../assets/filters/jazz.png'), bwImage: require('../../assets/filters/bw/jazz.png') },
  { id: 'electronic', label: 'Electronic', colorImage: require('../../assets/filters/electronic.png'), bwImage: require('../../assets/filters/bw/electronic.png') },
  { id: 'party', label: 'Party', colorImage: require('../../assets/filters/electronic.png'), bwImage: require('../../assets/filters/bw/electronic.png') },
  { id: 'schlager', label: 'Schlager', colorImage: require('../../assets/filters/electronic.png'), bwImage: require('../../assets/filters/bw/electronic.png') },
  { id: 'german', label: 'Deutsch', colorImage: require('../../assets/filters/electronic.png'), bwImage: require('../../assets/filters/bw/electronic.png') },
];

const DECADE_OPTIONS = [
  { id: '80s', label: '80er', colorImage: require('../../assets/filters/80s.png'), bwImage: require('../../assets/filters/bw/80s.png') },
  { id: '90s', label: '90er', colorImage: require('../../assets/filters/90s.png'), bwImage: require('../../assets/filters/bw/90s.png') },
  { id: '2000s', label: '2000er', colorImage: require('../../assets/filters/2000s.png'), bwImage: require('../../assets/filters/bw/2000s.png') },
  { id: '2010s', label: '2010er', colorImage: require('../../assets/filters/2010s.png'), bwImage: require('../../assets/filters/bw/2010s.png') },
  { id: '2020s', label: '2020er', colorImage: require('../../assets/filters/2020s.png'), bwImage: require('../../assets/filters/bw/2020s.png') },
];

const ROUND_OPTIONS = [1, 3, 5, 7, 10];

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const shuffleArray = <T,>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const mapDecadeToYear = (label: string) => {
  const mapping: Record<string, string> = {
    '80s': '1985',
    '90s': '1995',
    '2000s': '2005',
    '2010s': '2015',
    '2020s': '2023',
  };
  return mapping[label] ?? '2020';
};

export default function ClassicSettingsScreen() {
  const { accessToken } = useSpotify();
  const gameScreenOffset = useSharedValue(0);

  const [genresExpanded, setGenresExpanded] = useState(false);
  const [decadesExpanded, setDecadesExpanded] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDecades, setSelectedDecades] = useState<string[]>([]);
  const [trackInfo, setTrackInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedRounds, setSelectedRounds] = useState<number>(5);

  const toggleSelection = (id: string, selected: string[], setSelected: (val: string[]) => void) => {
    setSelected(selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]);
  };

  const handlePlaySong = async () => {
    if (!accessToken) {
      Alert.alert('Fehler', 'Kein Zugriffstoken verfügbar.');
      return;
    }

    const genrePool = selectedGenres.length ? selectedGenres : GENRE_OPTIONS.map(o => o.id);
    const decadePool = selectedDecades.length ? selectedDecades : DECADE_OPTIONS.map(o => o.id);
    const combinations = genrePool.flatMap(genre =>
      decadePool.map(decade => ({ genre, year: mapDecadeToYear(decade) }))
    );

    shuffleArray(combinations);
    let foundTrack = null;

    for (const combo of combinations) {
      const query = encodeURIComponent(`genre:"${combo.genre}" year:${combo.year}`);
      const offset = Math.floor(Math.random() * 1000);
      const url = `https://api.spotify.com/v1/search?q=${query}&type=track&market=DE&limit=50&offset=${offset}`;

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) continue;

        const data = await res.json();
        const tracks = data.tracks?.items ?? [];
        if (tracks.length === 0) continue;

        const selected = pickRandom(tracks);
        foundTrack = { ...(selected as object), genre: combo.genre };
        break;
      } catch { }
    }

    if (!foundTrack) {
      Alert.alert('Fehler', 'Kein Song gefunden.');
      return;
    }

    await playSong(foundTrack.uri, accessToken);
    setIsPlaying(true);
    setTrackInfo({
      uri: foundTrack.uri,
      title: foundTrack.name,
      artist: foundTrack.artists.map((a: any) => a.name).join(', '),
      year: foundTrack.album.release_date?.substring(0, 4) || 'Unbekannt',
      genre: foundTrack.genre,
      image: foundTrack.album.images?.[0]?.url,
    });
    gameScreenOffset.value = 0;
  };

  const playSong = async (uri: string, token: string) => {
    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [uri] }),
    });
  };

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

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Classic Mode</Text>

      {/* Genre Filter */}
      <View style={styles.shadowWrapper}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => setGenresExpanded(!genresExpanded)} style={styles.dropdownHeader}>
            <Text style={styles.dropdownText}>Genre</Text>
            <Text style={styles.dropdownArrow}>{genresExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {genresExpanded && (
            <View style={styles.dropdownBody}>
              <FilterGrid options={GENRE_OPTIONS} selected={selectedGenres} onToggle={(id) => toggleSelection(id, selectedGenres, setSelectedGenres)} />
            </View>
          )}
        </View>
      </View>

      {/* Decade Filter */}
      <View style={styles.shadowWrapper}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => setDecadesExpanded(!decadesExpanded)} style={styles.dropdownHeader}>
            <Text style={styles.dropdownText}>Jahrzehnt</Text>
            <Text style={styles.dropdownArrow}>{decadesExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {decadesExpanded && (
            <View style={styles.dropdownBody}>
              <FilterGrid options={DECADE_OPTIONS} selected={selectedDecades} onToggle={(id) => toggleSelection(id, selectedDecades, setSelectedDecades)} />
            </View>
          )}
        </View>
      </View>

      {/* Round Selector */}
      <View style={styles.shadowWrapper}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownText}>Rundenanzahl</Text>
          <View style={styles.roundButtonContainer}>
            {ROUND_OPTIONS.map((count) => (
              <TouchableOpacity
                key={count}
                onPress={() => setSelectedRounds(count)}
                style={[styles.roundButton, selectedRounds === count && styles.roundButtonSelected]}
              >
                <Text style={[styles.roundButtonText, selectedRounds === count && styles.roundButtonTextSelected]}>{count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.playButton} onPress={handlePlaySong}>
        <Text style={styles.playButtonText}>🎧 Spiel starten</Text>
      </TouchableOpacity>

      {trackInfo && (
        <>
          <InformationPopup
            track={trackInfo}
            onSkip={() => {
              gameScreenOffset.value = 0;
              handlePlaySong();
            }}
          />
          <YellowGamePopup
            offsetY={gameScreenOffset}
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
        </>
      )}
    </ScrollView>
    </View>
  );
}
