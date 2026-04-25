import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal, FlatList, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../theme/theme';
import { api } from '../api/client';

export const WardDetailsScreen = ({ route, navigation }: any) => {
  const { t, i18n } = useTranslation();
  const { ward } = route.params;
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [allSchedules, setAllSchedules] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Stany formularza leku
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [frequency, setFrequency] = useState<'ONCE' | 'DAILY' | 'WEEKLY'>('DAILY');

  const fetchSchedules = useCallback(async () => {
    try {
      const data = await api.getSeniorMedications(ward.id);
      setAllSchedules(data);
    } catch (e) {
      console.error("Błąd pobierania harmonogramu:", e);
    }
  }, [ward.id]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Generowanie kropek na kalendarzu (dni z zaplanowanymi lekami)
  const getMarkedDates = () => {
    const marked: any = {};
    allSchedules.forEach(s => {
        // Tu w przyszłości dodamy logikę sprawdzania daty, na razie zaznaczamy wybrany dzień
    });
    marked[selectedDate] = { selected: true, selectedColor: theme.colors.primary };
    return marked;
  };

  const handleAddMedication = async () => {
    if (!medName || !dosage) return Alert.alert(t('error'), t('fillAllMedFields'));

    try {
      setIsLoading(true);
      const hour = time.getHours();
      const minute = time.getMinutes();
      
      // Logika CRON
      let cron = `${minute} ${hour} * * *`; // Domyślnie codziennie
      if (frequency === 'WEEKLY') {
        const dayOfWeek = new Date(selectedDate).getDay(); // 0-6 (Nd-So)
        cron = `${minute} ${hour} * * ${dayOfWeek}`;
      } else if (frequency === 'ONCE') {
          // Tu w Sprincie 4 dodamy obsługę konkretnej daty
      }

      await api.createSchedule(ward.id, medName, dosage, cron);
      Alert.alert(t('success'), t('medAddedSuccess'));
      setMedName('');
      setDosage('');
      setIsModalVisible(false);
      fetchSchedules(); // Odśwież listę
    } catch (error) {
      Alert.alert(t('error'), t('medAddError'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderMedItem = ({ item }: { item: any }) => (
    <View style={styles.medItem}>
      <View style={styles.medIcon}>
        <Feather name="plus-circle" size={20} color={theme.colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.medNameText}>{item.name}</Text>
        <Text style={styles.medDetailsText}>{item.dosage} • {item.cronExpression.split(' ')[1]}:{item.cronExpression.split(' ')[0].padStart(2, '0')}</Text>
      </View>
      <TouchableOpacity onPress={() => {/* Logika usuwania */}}>
        <Feather name="trash-2" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{ward.name}</Text>
        <View style={{ width: 44 }} />
      </View>

      <Calendar
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        markedDates={getMarkedDates()}
        theme={{
          calendarBackground: theme.colors.card,
          selectedDayBackgroundColor: theme.colors.primary,
          todayTextColor: theme.colors.seniorAccent,
          arrowColor: theme.colors.primary,
          textMonthFontFamily: theme.typography.fontFamily.bold,
        }}
        style={styles.calendar}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Plan na: {selectedDate}</Text>
        <TouchableOpacity style={styles.smallAddBtn} onPress={() => setIsModalVisible(true)}>
          <Feather name="plus" size={20} color="#fff" />
          <Text style={styles.smallAddBtnText}>Dodaj</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={allSchedules} // Docelowo filtrujemy po wybranej dacie
        keyExtractor={(item) => item.id}
        renderItem={renderMedItem}
        contentContainerStyle={{ padding: 24 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Brak zaplanowanych leków.</Text>}
      />

      {/* Modal Dodawania */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nowy lek</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}><Feather name="x" size={24} /></TouchableOpacity>
            </View>

            <TextInput style={styles.input} placeholder="Nazwa leku" value={medName} onChangeText={setMedName} />
            <TextInput style={styles.input} placeholder="Dawka (np. 1 tabl.)" value={dosage} onChangeText={setDosage} />

            <TouchableOpacity style={styles.pickerTrigger} onPress={() => setShowTimePicker(true)}>
              <Feather name="clock" size={20} color={theme.colors.primary} />
              <Text style={styles.pickerText}>Godzina: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setTime(selectedTime);
                }}
              />
            )}

            <Text style={styles.label}>Powtarzalność:</Text>
            <View style={styles.freqRow}>
              {(['ONCE', 'DAILY', 'WEEKLY'] as const).map(f => (
                <TouchableOpacity 
                  key={f}
                  style={[styles.freqBtn, frequency === f && styles.freqBtnActive]} 
                  onPress={() => setFrequency(f)}
                >
                  <Text style={[styles.freqBtnText, frequency === f && styles.freqBtnTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleAddMedication} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Zapisz w harmonogramie</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24 },
  iconButton: { padding: 10, backgroundColor: theme.colors.card, borderRadius: 16, ...theme.ui.shadow },
  headerTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 22 },
  calendar: { marginHorizontal: 20, borderRadius: 20, ...theme.ui.shadow },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 20 },
  sectionTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 18 },
  smallAddBtn: { backgroundColor: theme.colors.primary, flexDirection: 'row', padding: 8, paddingHorizontal: 15, borderRadius: 12, alignItems: 'center', gap: 5 },
  smallAddBtnText: { color: '#fff', fontFamily: theme.typography.fontFamily.bold },
  medItem: { backgroundColor: theme.colors.card, flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, marginBottom: 10, ...theme.ui.shadow },
  medIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  medNameText: { fontFamily: theme.typography.fontFamily.bold, fontSize: 16 },
  medDetailsText: { opacity: 0.6, fontSize: 14 },
  emptyText: { textAlign: 'center', opacity: 0.4, marginTop: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: 20 },
  input: { backgroundColor: theme.colors.background, padding: 15, borderRadius: 12, marginBottom: 10 },
  pickerTrigger: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, padding: 15, borderRadius: 12, gap: 10, marginBottom: 15 },
  pickerText: { fontFamily: theme.typography.fontFamily.bold },
  label: { marginBottom: 10, opacity: 0.7 },
  freqRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  freqBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.primary, alignItems: 'center', backgroundColor: '#f0f0f0' },
  freqBtnActive: { backgroundColor: theme.colors.primary },
  freqBtnText: { color: theme.colors.primary, fontSize: 12 },
  freqBtnTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: theme.colors.primary, padding: 18, borderRadius: 15, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontFamily: theme.typography.fontFamily.bold, fontSize: 16 }
});