import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { theme } from '../theme/theme';
import { api } from '../api/client';

export const SeniorPanelScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [pinCode, setPinCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [nextMedication, setNextMedication] = useState<any | null>(null);
  const [isReadyToTake, setIsReadyToTake] = useState(false);

  const fetchData = async () => {
    try {
      setIsFetching(true);
      const savedPin = await AsyncStorage.getItem('pairing_code');
      setPinCode(savedPin);

      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        const meds = await api.getSeniorMedications(userId);
        
        if (meds && meds.length > 0) {
          setNextMedication(meds[0]);
          setIsReadyToTake(true); 
        } else {
          setNextMedication(null);
          setIsReadyToTake(false);
        }
      }
    } catch (error) {
      console.error('Błąd pobierania danych:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Auth');
  };

  const copyToClipboard = async () => {
    if (pinCode) {
      await Clipboard.setStringAsync(pinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTakeMedication = async () => {
    if (!nextMedication) return;

    try {
      setIsLoading(true);
      await api.takeMedication(nextMedication.id);
      
      setIsReadyToTake(false);
      Alert.alert(t('success') || 'Sukces', 'Potwierdzono przyjęcie leku!');
    } catch (error: any) {
      Alert.alert(t('error'), error.message || 'Błąd komunikacji z bazą');
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
          <TouchableOpacity style={styles.pinWrapper} activeOpacity={0.7} onPress={copyToClipboard}>
            <View style={styles.pinContainer}>
              <Text style={styles.pinLabel}>{t('yourPin')}</Text>
              <Text style={styles.pinValue}>{pinCode}</Text>
            </View>
            <View style={[styles.copyIconBox, copied && styles.copyIconBoxSuccess]}>
              <Feather name={copied ? "check" : "copy"} size={20} color={copied ? "#fff" : theme.colors.primary} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.container}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{t('seniorWelcome')}</Text>
        </View>

        {isFetching ? (
          <ActivityIndicator size="large" color={theme.colors.seniorAccent} style={{ marginTop: 50 }} />
        ) : (
          <TouchableOpacity 
            style={[
              styles.giantSquare, 
              isReadyToTake ? styles.squarePink : styles.squareGray
            ]} 
            activeOpacity={0.8}
            onPress={handleTakeMedication}
            disabled={isLoading || !isReadyToTake}
          >
            <View style={styles.iconCircle}>
              {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.seniorAccent} />
              ) : (
                <Feather 
                  name={isReadyToTake ? "bell" : "check"} 
                  size={60} 
                  color={isReadyToTake ? theme.colors.seniorAccent : theme.colors.textMain} 
                />
              )}
            </View>
            <Text style={[
              styles.giantSquareText, 
              !isReadyToTake && styles.textGray
            ]}>
              {isReadyToTake ? 'Potwierdź przyjęcie leku' : 'Brak leków na teraz'}
            </Text>
            {nextMedication && isReadyToTake && (
              <Text style={styles.medicationName}>
                {nextMedication.name} - {nextMedication.dosage}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  headerButton: { padding: 10, backgroundColor: theme.colors.card, borderRadius: 16, ...theme.ui.shadow },
  pinWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, padding: 8, paddingLeft: 16, borderRadius: 16, ...theme.ui.shadow, gap: 12 },
  pinContainer: { alignItems: 'flex-end' },
  pinLabel: { fontFamily: theme.typography.fontFamily.regular, fontSize: 10, color: theme.colors.textMain, opacity: 0.6 },
  pinValue: { fontFamily: theme.typography.fontFamily.bold, fontSize: 20, color: theme.colors.primary, letterSpacing: 1 },
  copyIconBox: { backgroundColor: theme.colors.background, padding: 8, borderRadius: 10 },
  copyIconBoxSuccess: { backgroundColor: theme.colors.actionReady },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center', gap: 40 },
  greetingContainer: { alignItems: 'center', width: '100%' },
  greeting: { fontFamily: theme.typography.fontFamily.bold, fontSize: 28, color: theme.colors.textMain },
  
  giantSquare: { 
    width: '100%', 
    aspectRatio: 1, 
    borderRadius: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 20, 
    ...theme.ui.shadow,
    padding: 20
  },
  squarePink: { backgroundColor: theme.colors.seniorAccent },
  squareGray: { backgroundColor: '#E0E0E0' }, 
  
  iconCircle: { backgroundColor: theme.colors.card, width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  giantSquareText: { fontFamily: theme.typography.fontFamily.bold, fontSize: 26, color: '#fff', textAlign: 'center' },
  textGray: { color: theme.colors.textMain, opacity: 0.6 },
  medicationName: { fontFamily: theme.typography.fontFamily.regular, fontSize: 20, color: '#fff', marginTop: 10 },
});