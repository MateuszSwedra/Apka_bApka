import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import { api } from '../api/client';

export const AddWardScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [pin, setPin] = useState('');

  const handleSave = async () => {
    if (pin.length !== 6) {
      Alert.alert('Błąd', 'PIN musi składać się z 6 cyfr');
      return;
    }

    try {
      setIsLoading(true);
      const caregiverId = await AsyncStorage.getItem('user_id');
      if (!caregiverId) throw new Error('Brak ID Opiekuna');

      await api.pairSenior(caregiverId, pin);
      Alert.alert('Sukces', t('successAdd'), [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Błąd', 'Nieprawidłowy kod PIN lub problem z połączeniem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addWard')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('pinLabel')}</Text>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={setPin}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={theme.colors.card} />
          ) : (
            <>
              <Feather name="link" size={24} color={theme.colors.card} />
              <Text style={styles.saveButtonText}>{t('saveBtn')}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20 },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: theme.typography.sizes.large, color: theme.colors.textMain },
  formContainer: { padding: 24, gap: 24 },
  inputGroup: { gap: 12 },
  label: { fontFamily: theme.typography.fontFamily.bold, fontSize: 18, color: theme.colors.textMain, textAlign: 'center' },
  input: { backgroundColor: theme.colors.card, borderRadius: theme.ui.borderRadius, padding: 20, fontFamily: theme.typography.fontFamily.bold, fontSize: 32, color: theme.colors.primary, textAlign: 'center', letterSpacing: 5, ...theme.ui.shadow },
  saveButton: { backgroundColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, borderRadius: theme.ui.borderRadius, ...theme.ui.shadow, gap: 10, marginTop: 20 },
  saveButtonText: { fontFamily: theme.typography.fontFamily.bold, fontSize: theme.typography.sizes.normal, color: theme.colors.card },
});