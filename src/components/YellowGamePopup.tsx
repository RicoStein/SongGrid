import React from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

export default function YellowGamePopup({ offsetY, isPlaying, onTogglePlayPause, onHidden }) {
  const { height: SCREEN_HEIGHT } = useSafeAreaFrame(); // ✅ sichere Bildschirmhöhe

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      offsetY.value = event.translationY;
    },
    onEnd: () => {
      if (offsetY.value < -150) {
        offsetY.value = withSpring(-SCREEN_HEIGHT);
        runOnJS(onHidden)();
      } else {
        offsetY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles(SCREEN_HEIGHT).container, animatedStyle]}>
        <TouchableWithoutFeedback onPress={onTogglePlayPause}>
          <Animated.View style={styles().inner}>
            <Text style={styles().icon}>{isPlaying ? '⏸️' : '▶️'}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </PanGestureHandler>
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
      backgroundColor: '#eab676',
      zIndex: 2,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      fontSize: 64,
      color: 'white',
    },
  });
