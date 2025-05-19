import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GameModalProps {
  visible: boolean;
  onClose: () => void;
  onTogglePlayPause: () => void;
  onSkip: () => void;
  isPlaying: boolean;
  track: {
    uri: string;
    title: string;
    artist: string;
    year: string;
    genre: string;
    image: string;
  };
}

const GameModal: React.FC<GameModalProps> = ({
  visible,
  onClose,
  onTogglePlayPause,
  onSkip,
  isPlaying,
  track,
}) => {
  const translateY = useSharedValue(0);
  const [showInfo, setShowInfo] = React.useState(false);
  const [canToggle, setCanToggle] = React.useState(true);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateY.value = event.translationY;
    },
    onEnd: () => {
      if (translateY.value < -150) {
        translateY.value = withSpring(-SCREEN_HEIGHT + 0); // ✅ Modal gleitet ganz nach oben
        runOnJS(setShowInfo)(true);
        runOnJS(setCanToggle)(false);
        runOnJS(onTogglePlayPause)();
      } else {
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  React.useEffect(() => {
    if (visible) {
      translateY.value = 0;
      setShowInfo(false);
      setCanToggle(true);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (canToggle) onTogglePlayPause();
              }}
            >
              <View style={styles.touchArea}>
                <Text style={styles.playPauseText}>{isPlaying ? '⏸️' : '▶️'}</Text>
              </View>
            </TouchableWithoutFeedback>

            {showInfo && (
              <View style={styles.infoBox}>
                <Image source={{ uri: track.image }} style={styles.cover} />
                <Text style={styles.title}>{track.title}</Text>
                <Text style={styles.artist}>{track.artist}</Text>
                <Text style={styles.year}>{track.year}</Text>
                <Text style={styles.genre}>{track.genre}</Text>

                <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                  <Text style={styles.skipButtonText}>Nächster Song</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: '#eab676',
  zIndex: 1000,
},
  modalContent: {
    flex: 1,
    backgroundColor: '#eab676',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseText: {
    fontSize: 60,
    color: 'white',
  },
  infoBox: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 + 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
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

export default GameModal;
