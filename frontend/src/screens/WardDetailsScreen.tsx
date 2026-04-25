import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import { api } from '../api/client';

export const WardDetailsScreen = ({ route, navigation }: any) => {
  const { t } = useTranslation();
  const { ward } = route.params || { ward: { name: 'Nieznany', id: '' } }; 
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMedication = async () => {
    if (!medName || !dosage || !time) {
      return Alert.alert(t('error'), t('fillAllMedFields'));
    }

    try {
      setIsLoading(true);
      const [hour, minute] = time.split(':');
      const cronExpression = `${minute || '0'} ${hour} * * *`;

      await api.createSchedule(ward.id, medName, dosage, cronExpression);
      
      Alert.alert(t('success'), t('medAddedSuccess'));
      setMedName('');
      setDosage('');
    } catch (error) {
      Alert.alert(t('error'), t('medAddError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{ward.name}</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{t('addNewMed')}</Text>
        
        <View style={styles.formCard}>
          <TextInput 
            style={styles.input} 
            placeholder={t('medNamePlaceholder')} 
            value={medName} 
            onChangeText={setMedName} 
          />
          <TextInput 
            style={styles.input} 
            placeholder={t('dosagePlaceholder')} 
            value={dosage} 
            onChangeText={setDosage} 
          />
          <TextInput 
            style={styles.input} 
            placeholder={t('timePlaceholder')} 
            value={time} 
            onChangeText={setTime} 
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddMedication} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.addButtonText}>{t('assignMedBtn')}</Text>}
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24 },
  iconButton: { padding: 10, backgroundColor: theme.colors.card, borderRadius: 16, ...theme.ui.shadow },
  headerTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 24, color: theme.colors.textMain },
  content: { padding: 24 },
  sectionTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 18, color: theme.colors.textMain, marginBottom: 15 },
  formCard: { backgroundColor: theme.colors.card, padding: 20, borderRadius: theme.ui.borderRadius, ...theme.ui.shadow },
  input: { backgroundColor: theme.colors.background, padding: 15, borderRadius: 15, marginBottom: 15, fontFamily: theme.typography.fontFamily.regular },
  addButton: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 15, alignItems: 'center' },
  addButtonText: { color: '#fff', fontFamily: theme.typography.fontFamily.bold, fontSize: 16 },
});