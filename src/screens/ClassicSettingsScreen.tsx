import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSpotify } from '../context/SpotifyContext';
import TrackPopup from '../components/TrackPopup';
import FilterGrid from '../components/FilterGrid';
import styles from './ClassicSettingsStyles';

const GENRE_OPTIONS = [
  {
    id: 'pop',
    label: 'Pop',
    colorImage: require('../../assets/filters/pop.png'),
    bwImage: require('../../assets/filters/bw/pop.png'),
  },
  {
    id: 'rock',
    label: 'Rock',
    colorImage: require('../../assets/filters/rock.png'),
    bwImage: require('../../assets/filters/bw/rock.png'),
  },
  {
    id: 'hip-hop',
    label: 'Hip Hop',
    colorImage: require('../../assets/filters/hip-hop.png'),
    bwImage: require('../../assets/filters/bw/hip-hop.png'),
  },
  {
    id: 'jazz',
    label: 'Jazz',
    colorImage: require('../../assets/filters/jazz.png'),
    bwImage: require('../../assets/filters/bw/jazz.png'),
  },
  {
    id: 'electronic',
    label: 'Electronic',
    colorImage: require('../../assets/filters/electronic.png'),
    bwImage: require('../../assets/filters/bw/electronic.png'),
  },
  {
    id: 'party',
    label: 'Party',
    colorImage: require('../../assets/filters/electronic.png'),
    bwImage: require('../../assets/filters/bw/electronic.png'),
  },
  {
    id: 'schlager',
    label: 'Schlager',
    colorImage: require('../../assets/filters/electronic.png'),
    bwImage: require('../../assets/filters/bw/electronic.png'),
  },
  {
    id: 'german',
    label: 'Deutsch',
    colorImage: require('../../assets/filters/electronic.png'),
    bwImage: require('../../assets/filters/bw/electronic.png'),
  },
];


const DECADE_OPTIONS = [
  { id: '80s', label: '80er', colorImage: require('../../assets/filters/80s.png'), bwImage: require('../../assets/filters/bw/80s.png') },
  { id: '90s', label: '90er', colorImage: require('../../assets/filters/90s.png'), bwImage: require('../../assets/filters/bw/90s.png') },
  { id: '2000s', label: '2000er', colorImage: require('../../assets/filters/2000s.png'), bwImage: require('../../assets/filters/bw/2000s.png') },
  { id: '2010s', label: '2010er', colorImage: require('../../assets/filters/2010s.png'), bwImage: require('../../assets/filters/bw/2010s.png') },
  { id: '2020s', label: '2020er', colorImage: require('../../assets/filters/2020s.png'), bwImage: require('../../assets/filters/bw/2020s.png') },
];

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
  const [genresExpanded, setGenresExpanded] = useState(false);
  const [decadesExpanded, setDecadesExpanded] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDecades, setSelectedDecades] = useState<string[]>([]);
  const [trackInfo, setTrackInfo] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

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

  const combinations: { genre: string; year: string }[] = [];

  for (const genre of genrePool) {
    for (const decade of decadePool) {
      combinations.push({ genre, year: mapDecadeToYear(decade) });
    }
  }

  shuffleArray(combinations); // macht die Suche zufällig

  let foundTrack = null;
  let usedUrl = '';

  for (const combo of combinations) {
    const query = encodeURIComponent(`genre:"${combo.genre}" year:${combo.year}`);
    const offset = Math.floor(Math.random() * 1000);
    const url = `https://api.spotify.com/v1/search?q=${query}&type=track&market=DE&limit=50&offset=${offset}`;
    usedUrl = url;

    console.log('🎯 Suche-URL:', url);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`⚠️ API Antwort ${res.status}:`, errText);
        continue; // nächste Kombination probieren
      }

      const data = await res.json();
      const tracks = data.tracks?.items ?? [];

      if (tracks.length === 0) continue;

      const selected = pickRandom(tracks);
foundTrack = Object.assign({}, selected, { genre: combo.genre });
      break; // gültigen Track gefunden – Schleife abbrechen
    } catch (err) {
      console.warn('❌ Fehler bei Kombination:', combo, err);
    }
  }

  if (!foundTrack) {
    Alert.alert('Fehler', 'Keine gültige Kombination gefunden. Fallback-Song wird abgespielt.');

    // Fallback zu Rick Astley
    const fallbackUri = 'spotify:track:4uLU6hMCjMI75M1A2tKUQC';
    await playSong(fallbackUri, accessToken);
    setTrackInfo({
      title: 'Never Gonna Give You Up',
      artist: 'Rick Astley',
      year: '1987',
      genre: 'fallback',
      image: 'https://i.scdn.co/image/ab67616d0000b273e1c5cd46bc3d2aee993a7c83',
    });
    setIsPlaying(true);
    setPopupVisible(true);
    return;
  }

  await playSong(foundTrack.uri, accessToken);
  setIsPlaying(true);
  setTrackInfo({
    title: foundTrack.name,
    artist: foundTrack.artists.map((a: any) => a.name).join(', '),
    year: foundTrack.album.release_date?.substring(0, 4) || 'Unbekannt',
    genre: foundTrack.genre,
    image: foundTrack.album.images?.[0]?.url,
  });
  setPopupVisible(true);
};




/*
    const handlePlaySong = async () => {
      if (!accessToken) {
        Alert.alert('Fehler', 'Kein Zugriffstoken verfügbar.');
        return;
      }
  
      const genrePool = selectedGenres.length ? selectedGenres : GENRE_OPTIONS.map(o => o.id);
      const decadePool = selectedDecades.length ? selectedDecades : DECADE_OPTIONS.map(o => o.id);
      const genre = pickRandom(genrePool);
      const decade = pickRandom(decadePool);
      const year = mapDecadeToYear(decade);
  
      const query = encodeURIComponent(`genre:"${genre}" year:${year}`);
      const url = `https://api.spotify.com/v1/search?q=${query}&type=track&market=DE&limit=50&offset=0`;
  
      console.log('🎯 Suche-URL:', url);
  
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ Spotify API Fehler:', res.status, errorText);
          throw new Error(`Spotify-API-Fehler: ${res.status}`);
        }
  
        const data: SpotifyApi.TrackSearchResponse = await res.json();
        const popularTracks: SpotifyApi.TrackObjectFull[] =
          (data.tracks?.items || []).filter((t) => t.popularity >= 70);
  
        if (!popularTracks.length) throw new Error('Keine bekannten Tracks gefunden.');
  
        const selectedTrack = pickRandom(popularTracks);
  
        await playSong(selectedTrack.uri, accessToken);
        setIsPlaying(true);
  
        setTrackInfo({
          title: selectedTrack.name,
          artist: selectedTrack.artists.map((a) => a.name).join(', '),
          year: selectedTrack.album.release_date?.substring(0, 4) || 'Unbekannt',
          genre,
          image: selectedTrack.album.images?.[0]?.url,
        });
  
        setPopupVisible(true);
      } catch (err: any) {
        console.error('❌ Fehler beim Abrufen und Abspielen:', err);
        Alert.alert('Fehler', err.message || 'Unbekannter Fehler');
      }
    };
  */
  const playSong = async (uri: string, token: string) => {
    console.log('▶️ Sende an Spotify:', uri);
    const res = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [uri] }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('❌ Fehler beim Abspielen:', res.status, error);
      throw new Error(`Spotify-API-Fehler: ${res.status}`);
    }

    console.log('✅ Track erfolgreich gestartet');
  };

  const togglePlayback = async () => {
    const endpoint = isPlaying
      ? 'https://api.spotify.com/v1/me/player/pause'
      : 'https://api.spotify.com/v1/me/player/play';

    await fetch(endpoint, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    setIsPlaying(!isPlaying);
  };

  const pickRandom = <T,>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Classic Mode</Text>

      {/* 📦 GENRE FILTER */}
      <View style={styles.shadowWrapper}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setGenresExpanded(!genresExpanded)}
          >
            <Text style={styles.dropdownText}>Genre</Text>
            <Text style={styles.dropdownArrow}>{genresExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {genresExpanded && (
            <View style={styles.dropdownBody}>
              <View style={styles.dividerLine} />
              <FilterGrid
                options={GENRE_OPTIONS}
                selected={selectedGenres}
                onToggle={(id) =>
                  toggleSelection(id, selectedGenres, setSelectedGenres)
                }
              />
            </View>
          )}
        </View>
      </View>

      {/* 📦 DECADE FILTER */}
      <View style={styles.shadowWrapper}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setDecadesExpanded(!decadesExpanded)}
          >
            <Text style={styles.dropdownText}>Jahrzehnt</Text>
            <Text style={styles.dropdownArrow}>{decadesExpanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {decadesExpanded && (
            <View style={styles.dropdownBody}>
              <View style={styles.dividerLine} />
              <FilterGrid
                options={DECADE_OPTIONS}
                selected={selectedDecades}
                onToggle={(id) =>
                  toggleSelection(id, selectedDecades, setSelectedDecades)
                }
              />
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.playButton} onPress={handlePlaySong}>
        <Text style={styles.playButtonText}>🎧 Song abspielen</Text>
      </TouchableOpacity>

      {trackInfo && (
        <TrackPopup
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          onTogglePlayPause={togglePlayback}
          onSkip={() => {
            setPopupVisible(false);
            handlePlaySong();
          }}
          isPlaying={isPlaying}
          track={trackInfo}
        />
      )}
    </ScrollView>
  );
}
