import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Shield, Battery, Eye, Bell, Smartphone, TriangleAlert as AlertTriangle } from 'lucide-react-native';

export default function SettingsScreen() {
  const showPermissionInfo = (permission: string, description: string) => {
    Alert.alert(
      permission,
      `${description}\n\nNote: In a native Android app, this would request the actual permission.`,
      [{ text: 'OK' }]
    );
  };

  const PermissionCard = ({ 
    icon, 
    title, 
    description, 
    status, 
    onPress 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    status: 'granted' | 'denied' | 'required';
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.permissionCard} onPress={onPress}>
      <View style={styles.permissionIcon}>
        {icon}
      </View>
      <View style={styles.permissionContent}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionDescription}>{description}</Text>
      </View>
      <View style={[
        styles.statusIndicator,
        { backgroundColor: status === 'granted' ? '#10B981' : '#EF4444' }
      ]}>
        <Text style={styles.statusText}>
          {status === 'granted' ? '✓' : '!'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>App Settings</Text>
          <Text style={styles.headerSubtitle}>
            Required permissions for full functionality
          </Text>
        </View>

        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <AlertTriangle size={20} color="#F59E0B" />
          <Text style={styles.warningText}>
            This demo shows UI concepts only. Native Android features require a bare React Native project.
          </Text>
        </View>

        {/* Permissions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Permissions</Text>
          
          <PermissionCard
            icon={<Eye size={24} color="#3B82F6" />}
            title="Draw Over Other Apps"
            description="Allows floating widget to appear over other apps"
            status="required"
            onPress={() => showPermissionInfo(
              'SYSTEM_ALERT_WINDOW',
              'This permission allows the app to display a floating widget that stays visible even when using other apps.'
            )}
          />

          <PermissionCard
            icon={<Battery size={24} color="#10B981" />}
            title="Ignore Battery Optimization"
            description="Prevents Android from killing the background service"
            status="required"
            onPress={() => showPermissionInfo(
              'REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
              'This prevents Android from putting the app to sleep, ensuring the timer continues running in the background.'
            )}
          />

          <PermissionCard
            icon={<Smartphone size={24} color="#7C3AED" />}
            title="Wake Lock"
            description="Allows app to wake up the screen for alarms"
            status="required"
            onPress={() => showPermissionInfo(
              'WAKE_LOCK',
              'This permission allows the app to turn on the screen and show alarms even when the device is locked.'
            )}
          />

          <PermissionCard
            icon={<Bell size={24} color="#F59E0B" />}
            title="Foreground Service"
            description="Keeps the app running in background with notification"
            status="required"
            onPress={() => showPermissionInfo(
              'FOREGROUND_SERVICE',
              'This allows the app to run continuously in the background with a persistent notification.'
            )}
          />
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Native Features (Not Available in Demo)</Text>
          
          <View style={styles.featureCard}>
            <Shield size={24} color="#6B7280" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>24/7 Background Service</Text>
              <Text style={styles.featureDescription}>
                Foreground service with persistent notification
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Eye size={24} color="#6B7280" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>System Overlay Widget</Text>
              <Text style={styles.featureDescription}>
                Draggable chat head visible over all apps
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Smartphone size={24} color="#6B7280" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Lock Screen Bypass</Text>
              <Text style={styles.featureDescription}>
                Show alarms even when device is locked
              </Text>
            </View>
          </View>
        </View>

        {/* Implementation Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Implementation Notes</Text>
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>
              To implement these features in a real Android app, you would need:
              {'\n\n'}
              • Bare React Native project (not Expo managed)
              {'\n'}
              • Custom native modules in Java/Kotlin
              {'\n'}
              • Android manifest permissions
              {'\n'}
              • Foreground service implementation
              {'\n'}
              • WindowManager for overlay widgets
              {'\n'}
              • PowerManager for wake locks
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
    textAlign: 'center',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#451A03',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  warningText: {
    color: '#FCD34D',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  permissionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#94A3B8',
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    opacity: 0.6,
  },
  featureContent: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  noteCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  noteText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
});