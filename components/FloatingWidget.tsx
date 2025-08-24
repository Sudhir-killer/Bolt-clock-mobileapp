import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Clock } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface FloatingWidgetProps {
  onPress: () => void;
  isTimerRunning: boolean;
  timeLeft: number;
}

export default function FloatingWidget({ 
  onPress, 
  isTimerRunning, 
  timeLeft 
}: FloatingWidgetProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Animated.spring(scale, {
        toValue: 1.1,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (_, gestureState) => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      // Snap to edges
      const snapToEdge = gestureState.moveX < width / 2 ? 20 : width - 76;
      
      Animated.spring(pan, {
        toValue: { x: snapToEdge - 56, y: gestureState.moveY - 56 },
        useNativeDriver: false,
      }).start();

      // If it was a tap (minimal movement), trigger onPress
      if (Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
        onPress();
      }
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scale },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity style={styles.widget} activeOpacity={0.8}>
        <Clock size={20} color="#FFFFFF" />
        {isTimerRunning && (
          <View style={styles.timerBadge}>
            <Text style={styles.timerBadgeText}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 1000,
  },
  widget: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  timerBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  timerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});