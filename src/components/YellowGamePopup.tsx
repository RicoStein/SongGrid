import React from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen'); // ✅ volle Höhe

export default function YellowGamePopup({ offsetY, isPlaying, onTogglePlayPause, onHidden }) {
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
      <Animated.View style={[styles.container, animatedStyle]}>
        <TouchableWithoutFeedback onPress={onTogglePlayPause}>
          <Animated.View style={styles.inner}>
            <Text style={styles.icon}>{isPlaying ? '⏸️' : '▶️'}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
  ...StyleSheet.absoluteFillObject, // ✅ deckt ALLES ab
  backgroundColor: '#eab676',
  zIndex: 22,
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
