import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface InfoRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, valueColor }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor ? { color: valueColor } : undefined]}>
        {value || 'N/A'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  label: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
  value: {
    ...Typography.bodyBold,
    color: Colors.text,
    textAlign: 'right',
    flex: 1,
  },
});
