import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Play, Pause, Square, Volume2, Clock } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function TimerScreen() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const alarmAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            triggerAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRunning]);

  const triggerAlarm = () => {
    setIsAlarmActive(true);
    
    // Animate alarm screen
    Animated.timing(alarmAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // In a real app, this would trigger native wake lock and sound
    Alert.alert(
      '⏰ Alarm!',
      'Timer finished! In a native app, this would wake the screen and play sound.',
      [
        {
          text: 'Stop Alarm',
          onPress: stopAlarm,
        },
      ]
    );
  };

  const stopAlarm = () => {
    setIsAlarmActive(false);
    Animated.timing(alarmAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const startTimer = () => {
    const minutes = parseInt(inputMinutes) || 0;
    const seconds = parseInt(inputSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;
    
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parseVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    const minuteMatch = lowerCommand.match(/(\d+)\s*minute/);
    const secondMatch = lowerCommand.match(/(\d+)\s*second/);
    
    if (minuteMatch) {
      const minutes = parseInt(minuteMatch[1]);
      setInputMinutes(minutes.toString());
      setInputSeconds('0');
      setTimeLeft(minutes * 60);
      setIsRunning(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timer & Alarm</Text>
        <Text style={styles.headerSubtitle}>
          {isRunning ? 'Timer Running' : 'Set your timer'}
        </Text>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Animated.View 
          style={[
            styles.timerCircle,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Text style={styles.timerText}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={styles.timerLabel}>
            {isRunning ? 'Time Remaining' : 'Ready to Start'}
          </Text>
        </Animated.View>
      </View>

      {/* Input Section */}
      {!isRunning && (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Set Timer</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={inputMinutes}
                onChangeText={setInputMinutes}
                placeholder="0"
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.inputUnit}>min</Text>
            </View>
            <Text style={styles.separator}>:</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={inputSeconds}
                onChangeText={setInputSeconds}
                placeholder="0"
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.inputUnit}>sec</Text>
            </View>
          </View>
        </View>
      )}

      {/* Voice Command Demo */}
      <View style={styles.voiceContainer}>
        <Text style={styles.voiceLabel}>Voice Command Demo</Text>
        <TouchableOpacity
          style={styles.voiceButton}
          onPress={() => parseVoiceCommand('set alarm for 2 minutes')}
        >
          <Text style={styles.voiceButtonText}>
            "Set alarm for 2 minutes"
          </Text>
        </TouchableOpacity>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {!isRunning ? (
          <TouchableOpacity style={styles.startButton} onPress={startTimer}>
            <Play size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Timer</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.runningControls}>
            <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
              <Pause size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
              <Square size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Floating Widget Simulation */}
      <View style={styles.widgetSimulation}>
        <Text style={styles.widgetLabel}>Floating Widget (Simulated)</Text>
        <View style={styles.floatingWidget}>
          <TouchableOpacity style={styles.chatHead}>
            <Clock size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Alarm Overlay */}
      {isAlarmActive && (
        <Animated.View 
          style={[
            styles.alarmOverlay,
            {
              opacity: alarmAnim,
              transform: [{
                scale: alarmAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                })
              }]
            }
          ]}
        >
          <View style={styles.alarmContent}>
            <Volume2 size={48} color="#EF4444" />
            <Text style={styles.alarmTitle}>⏰ ALARM!</Text>
            <Text style={styles.alarmMessage}>Timer finished!</Text>
            <TouchableOpacity style={styles.stopAlarmButton} onPress={stopAlarm}>
              <Text style={styles.stopAlarmText}>Stop Alarm</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1E293B',
    borderWidth: 4,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
  inputContainer: {
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 12,
    width: 60,
    height: 60,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inputUnit: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  separator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginHorizontal: 20,
  },
  voiceContainer: {
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  voiceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  voiceButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  voiceButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  controlsContainer: {
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  runningControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButton: {
    backgroundColor: '#EF4444',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  widgetSimulation: {
    paddingHorizontal: 40,
  },
  widgetLabel: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 12,
  },
  floatingWidget: {
    alignItems: 'center',
  },
  chatHead: {
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
  },
  alarmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  alarmContent: {
    alignItems: 'center',
    padding: 40,
  },
  alarmTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#EF4444',
    marginVertical: 20,
    textAlign: 'center',
  },
  alarmMessage: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  stopAlarmButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  stopAlarmText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});