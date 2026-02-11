import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface ToggleSwitchProps {
  options: string[];
  activeIndex: number;
  onToggle: (index: number) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  options,
  activeIndex,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            activeIndex === index && styles.activeOption,
          ]}
          onPress={() => onToggle(index)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.optionText,
              activeIndex === index && styles.activeOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 3,
    marginBottom: 12,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeOption: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
  activeOptionText: {
    color: Colors.surface,
  },
});
