import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';

interface FundManager {
  person_name: string;
  person_type: string;
  date_from: string;
}

interface FundManagersProps {
  managers: FundManager[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const getInitials = (name: string): string =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

const formatTenure = (dateFrom: string, t: (key: string, opts?: Record<string, unknown>) => string): string => {
  const from = new Date(dateFrom);
  const now = new Date();
  const years = Math.floor((now.getTime() - from.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const startMonth = MONTHS[from.getMonth()];
  const startYear = from.getFullYear();
  return `${startMonth} ${startYear} - ${t('fundManagers.present')} | ${years} ${t('fundManagers.years')}`;
};

export const FundManagers: React.FC<FundManagersProps> = ({ managers }) => {
  const { t } = useTranslation();

  return (
    <View>
      {managers.map((manager, index) => (
        <View
          key={`${manager.person_name}-${index}`}
          style={styles.card}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(manager.person_name)}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{manager.person_name},</Text>
            <Text style={styles.tenure}>{formatTenure(manager.date_from, t)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  cardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6B8FD4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },
  tenure: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
