import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface IconAvatarProps {
  /** FontAwesome5 icon name — if omitted, `initials` is rendered instead */
  icon?: string;
  /** Two-letter initials shown when no icon is provided */
  initials?: string;
  /** Circle size (width & height). Default 44 */
  size?: number;
  /** Icon size inside the circle. Default 18 */
  iconSize?: number;
  /** Background colour of the circle */
  backgroundColor?: string;
  /** Foreground colour (icon or text) */
  color?: string;
  style?: ViewStyle;
}

export const IconAvatar: React.FC<IconAvatarProps> = ({
  icon,
  initials,
  size = 44,
  iconSize = 18,
  backgroundColor = Colors.surfaceGreenLight,
  color = Colors.headerGreen,
  style,
}) => (
  <View
    style={[
      styles.circle,
      { width: size, height: size, borderRadius: size / 2, backgroundColor },
      style,
    ]}
  >
    {icon ? (
      <FontAwesome5 name={icon} size={iconSize} color={color} />
    ) : (
      <Text style={[styles.initials, { color, fontSize: iconSize }]}>
        {initials}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: '700',
  },
});
