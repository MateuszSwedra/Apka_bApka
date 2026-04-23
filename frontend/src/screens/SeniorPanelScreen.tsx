import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { api } from '../api/client';

export const SeniorPanelScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isTaken, setIsTaken] = useState(false);
  const [pinCode, setPinCode] = useState<string | null>(null);

  useEffect(() => {
    const loadPin = async () => {
      const savedPin = await AsyncStorage.getItem('pairing_code');
      setPinCode(savedPin);
    };
    loadPin();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Onboarding');
  };

  const handleTakeMedication = async () => {
    try {
      setIsLoading(true);
      const mockScheduleId = '123e4567-e89b-12d3-a456-426614174000';
      await api.takeMedication(mockScheduleId);
      setIsTaken(true);
    } catch (error: any) {
      Alert.alert('Błąd techniczny', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
          <Feather name="log-out" size={24} color={theme.colors.textMain} />
        </TouchableOpacity>
        {pinCode && (
          <View style={styles.pinContainer}>
            <Text style={styles.pinLabel}>{t('yourPin')}</Text>
            <Text style={styles.pinValue}>{pinCode}</Text>
          </View>
        )}
      </View>

      <View style={styles.container}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{t('seniorWelcome')}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.giantButton, isTaken && styles.giantButtonSuccess]} 
          activeOpacity={0.8}
          onPress={handleTakeMedication}
          disabled={isLoading || isTaken}
        >
          <View style={styles.iconCircle}>
            {isLoading ? (
              <ActivityIndicator size="large" color={theme.colors.seniorAccent} />
            ) : (
              <Feather name={isTaken ? "check" : "bell"} size={50} color={isTaken ? theme.colors.actionReady : theme.colors.seniorAccent} />
            )}
          </View>
          <Text style={styles.giantButtonText}>
            {isTaken ? 'LEKI PRZYJĘTE' : t('takeMedsBtn')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  headerButton: { padding: 10, backgroundColor: theme.colors.card, borderRadius: 16, ...theme.ui.shadow },
  pinContainer: { alignItems: 'flex-end' },
  pinLabel: { fontFamily: theme.typography.fontFamily.regular, fontSize: 12, color: theme.colors.textMain },
  pinValue: { fontFamily: theme.typography.fontFamily.bold, fontSize: 24, color: theme.colors.primary, letterSpacing: 2 },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center', gap: 50 },
  greetingContainer: { alignItems: 'center', width: '100%' },
  greeting: { fontFamily: theme.typography.fontFamily.regular, fontSize: theme.typography.sizes.large, color: theme.colors.textMain },
  giantButton: { backgroundColor: theme.colors.seniorAccent, width: '100%', paddingVertical: 40, borderRadius: 40, justifyContent: 'center', alignItems: 'center', gap: 20, ...theme.ui.shadow },
  giantButtonSuccess: { backgroundColor: theme.colors.actionReady },
  iconCircle: { backgroundColor: theme.colors.card, width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  giantButtonText: { fontFamily: theme.typography.fontFamily.bold, fontSize: 26, color: theme.colors.textMain, textAlign: 'center' },
});