import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface ToggleOption {
  key: string;
  label: string;
}

interface ToggleButtonGroupProps {
  options: ToggleOption[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  options,
  activeKey,
  onSelect,
}) => (
  <View style={styles.row}>
    {options.map((option) => {
      const isActive = option.key === activeKey;
      return (
        <TouchableOpacity
          key={option.key}
          style={[styles.btn, isActive && styles.btnActive]}
          onPress={() => onSelect(option.key)}
        >
          <Text style={[styles.text, isActive && styles.textActive]}>
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
    gap: 10,
    marginBottom: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.toggleInactiveBg,
    alignItems: 'center',
  },
  btnActive: {
    backgroundColor: Colors.headerGreen,
  },
  text: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
  textActive: {
    color: Colors.white,
  },
});
