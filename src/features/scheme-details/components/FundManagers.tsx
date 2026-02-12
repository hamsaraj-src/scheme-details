import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../../shared/constants/colors';
import { Typography } from '../../../shared/constants/typography';
import { IconAvatar } from '../../../shared/components';

interface FundManager {
  person_name: string;
  person_type: string;
  date_from: string;
}

interface FundManagersProps {
  managers: FundManager[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

const getInitials = (name: string): string => {
  if (!name) return '';
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();
};

const formatTenure = (dateFrom: string, t: (key: string, opts?: Record<string, unknown>) => string): string => {
  const from = new Date(dateFrom);
  const now = new Date();
  const years = Math.floor((now.getTime() - from.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const startMonth = MONTHS[from.getMonth()];
  const startYear = from.getFullYear();
  return t('format.tenure', {
    startMonth,
    startYear,
    present: t('fundManagers.present'),
    years,
    yearsLabel: t('fundManagers.years'),
  });
};

export const FundManagers: React.FC<FundManagersProps> = memo(({ managers }) => {
  const { t } = useTranslation();

  return (
    <View>
      {managers.map((manager, index) => (
        <View
          key={`${manager.person_name}-${index}`}
          style={styles.card}
        >
          <IconAvatar
            initials={getInitials(manager.person_name)}
            size={48}
            iconSize={16}
            backgroundColor={Colors.avatarBlue}
            color={Colors.white}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{manager.person_name},</Text>
            <Text style={styles.tenure}>{formatTenure(manager.date_from, t)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 3,
  },
  tenure: {
    ...Typography.captionRegular,
    color: Colors.textSecondary,
  },
});
