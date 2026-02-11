import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface DetailCardProps {
  icon: string;
  label: string;
  value: string;
  fullWidth?: boolean;
}

export const DetailCard: React.FC<DetailCardProps> = ({ icon, label, value, fullWidth }) => (
  <View style={[styles.detailCard, fullWidth && styles.detailCardFull]}>
    <View style={styles.cardHeader}>
      <FontAwesome5 name={icon} size={16} color={Colors.headerGreen} />
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  detailCard: {
    width: '48%',
    marginBottom: 20,
  },
  detailCardFull: {
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardLabel: {
    ...Typography.labelRegular,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  cardValue: {
    ...Typography.label,
    color: Colors.text,
    paddingLeft: 22,
  },
});
