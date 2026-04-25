import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import { api } from '../api/client';

export const RoleSelectionScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = async (role: 'CAREGIVER' | 'SENIOR') => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return;

      const name = role === 'CAREGIVER' ? 'Opiekun' : 'Senior';
      const user = await api.setRole(userId, role, name);

      await AsyncStorage.setItem('user_role', role);
      if (user.pairingCode) {
        await AsyncStorage.setItem('pairing_code', user.pairingCode);
      }

      navigation.replace(role === 'CAREGIVER' ? 'CaregiverPanel' : 'SeniorPanel');
    } catch (e) {
      Alert.alert(t('error'), t('roleSaveError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('whoAreYou')}</Text>
      <View style={styles.grid}>
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: theme.colors.seniorAccent }]} 
          onPress={() => handleSelectRole('SENIOR')}
          disabled={isLoading}
        >
          <Feather name="heart" size={50} color="#fff" />
          <Text style={styles.cardText}>{t('imSenior')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, { backgroundColor: theme.colors.caregiverAccent }]} 
          onPress={() => handleSelectRole('CAREGIVER')}
          disabled={isLoading}
        >
          <Feather name="users" size={50} color="#fff" />
          <Text style={styles.cardText}>{t('imCaregiver')}</Text>
        </TouchableOpacity>
      </View>
      {isLoading && <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 30, justifyContent: 'center' },
  title: { fontSize: 32, fontFamily: theme.typography.fontFamily.bold, textAlign: 'center', marginBottom: 40, color: theme.colors.textMain },
  grid: { gap: 20 },
  card: { padding: 40, borderRadius: 30, alignItems: 'center', ...theme.ui.shadow },
  cardText: { color: '#fff', fontSize: 22, fontFamily: theme.typography.fontFamily.bold, marginTop: 15 }
});