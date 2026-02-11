import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface ChipOption {
  key: string;
  label: string;
}

interface ChipSelectorProps {
  options: ChipOption[];
  activeKey: string;
  onSelect: (key: string) => void;
  /** Custom chip size: 'small' renders compact chips, 'default' is standard */
  size?: 'small' | 'default';
}

export const ChipSelector: React.FC<ChipSelectorProps> = ({
  options,
  activeKey,
  onSelect,
  size = 'default',
}) => (
  <View style={[styles.row, size === 'small' && styles.rowSmall]}>
    {options.map((option) => {
      const isActive = option.key === activeKey;
      return (
        <TouchableOpacity
          key={option.key}
          style={[styles.chip, size === 'small' && styles.chipSmall, isActive && styles.chipActive]}
          onPress={() => onSelect(option.key)}
        >
          <Text style={[styles.text, size === 'small' && styles.textSmall, isActive && styles.textActive]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.tagBorder,
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.headerGreen,
    borderColor: Colors.headerGreen,
  },
  text: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  textActive: {
    color: Colors.white,
  },
  rowSmall: {
    gap: 6,
  },
  chipSmall: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  textSmall: {
    fontSize: Typography.caption.fontSize,
  },
});
