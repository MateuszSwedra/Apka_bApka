import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import { api } from '../api/client';

export const AddWardScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  
  const [wardName, setWardName] = useState('');
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');

  const handleSave = async () => {
    if (!wardName || !medName || !dosage) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola');
      return;
    }

    try {
      setIsLoading(true);
      const senior = await api.createSenior(wardName);
      await api.createSchedule(senior.id, medName, dosage, '0 8 * * *'); 
      Alert.alert('Sukces', t('successAdd'), [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się połączyć z serwerem.');
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
          <Text style={styles.label}>{t('wardNameLabel')}</Text>
          <TextInput
            style={styles.input}
            value={wardName}
            onChangeText={setWardName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('medNameLabel')}</Text>
          <TextInput
            style={styles.input}
            value={medName}
            onChangeText={setMedName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('medDosageLabel')}</Text>
          <TextInput
            style={styles.input}
            value={dosage}
            onChangeText={setDosage}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={styles.saveButton} 
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.colors.card} />
          ) : (
            <>
              <Feather name="save" size={24} color={theme.colors.card} />
              <Text style={styles.saveButtonText}>{t('saveBtn')}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.large,
    color: theme.colors.textMain,
  },
  formContainer: {
    padding: 20,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 16,
    color: theme.colors.textMain,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.ui.borderRadius,
    padding: 16,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 18,
    color: theme.colors.textMain,
    ...theme.ui.shadow,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: theme.ui.borderRadius,
    ...theme.ui.shadow,
    gap: 10,
    marginTop: 20,
  },
  saveButtonText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.sizes.normal,
    color: theme.colors.card,
  },
});