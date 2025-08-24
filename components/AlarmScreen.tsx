import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Volume2, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface AlarmScreenProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function AlarmScreen({ visible, onDismiss }: AlarmScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Shake animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.overlay,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.alarmContent,
            { 
              transform: [
                { scale: pulseAnim },
                { translateX: shakeAnim }
              ] 
            }
          ]}
        >
          <Volume2 size={64} color="#EF4444" />
          
          <Text style={styles.alarmTitle}>⏰ ALARM!</Text>
          
          <Text style={styles.alarmMessage}>
            Your timer has finished!
          </Text>
          
          <Text style={styles.alarmSubtext}>
            In a native app, this would:
            {'\n'}• Wake up the screen
            {'\n'}• Show over lock screen
            {'\n'}• Play alarm sound
            {'\n'}• Vibrate the device
          </Text>

          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <X size={24} color="#FFFFFF" />
            <Text style={styles.dismissText}>Dismiss Alarm</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 2000,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  alarmContent: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 40,
    borderWidth: 2,
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  alarmTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#EF4444',
    marginVertical: 20,
    textAlign: 'center',
  },
  alarmMessage: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  alarmSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  dismissButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dismissText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});