import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { api } from '../api/client';

export const CaregiverPanelScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [wards, setWards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWards = async () => {
    try {
      const caregiverId = await AsyncStorage.getItem('user_id');
      if (caregiverId) {
        const data = await api.getWards(caregiverId);
        setWards(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchWards();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Onboarding');
  };

  const renderWardCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Feather name="user" size={24} color={theme.colors.card} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.wardName}>{item.name}</Text>
          <View style={styles.statusRow}>
            <Feather name="clock" size={14} color={theme.colors.textMain} />
            <Text style={styles.wardStatus}>Brak zaplanowanych leków</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={24} color={theme.colors.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
          <Feather name="log-out" size={24} color={theme.colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('wardsTitle')}</Text>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={wards}
          keyExtractor={(item) => item.id}
          renderItem={renderWardCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 50}}>Brak podopiecznych. Dodaj kogoś!</Text>}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.mainActionButton} activeOpacity={0.8} onPress={() => navigation.navigate('AddWard')}>
          <Feather name="plus" size={24} color={theme.colors.card} />
          <Text style={styles.mainActionText}>{t('addWard')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20 },
  headerButton: { padding: 10, backgroundColor: theme.colors.card, borderRadius: 16, ...theme.ui.shadow },
  headerTitle: { fontFamily: theme.typography.fontFamily.bold, fontSize: theme.typography.sizes.large, color: theme.colors.textMain },
  listContainer: { padding: 24, gap: 16 },
  card: { backgroundColor: theme.colors.card, borderRadius: theme.ui.borderRadius, padding: 20, ...theme.ui.shadow },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.caregiverAccent, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardInfo: { flex: 1 },
  wardName: { fontFamily: theme.typography.fontFamily.bold, fontSize: theme.typography.sizes.normal, color: theme.colors.textMain, marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  wardStatus: { fontFamily: theme.typography.fontFamily.regular, fontSize: theme.typography.sizes.small, color: theme.colors.textMain, opacity: 0.7 },
  footer: { padding: 24, paddingBottom: 40 },
  mainActionButton: { backgroundColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, borderRadius: theme.ui.borderRadius, ...theme.ui.shadow, gap: 10 },
  mainActionText: { fontFamily: theme.typography.fontFamily.bold, fontSize: theme.typography.sizes.normal, color: theme.colors.card },
});