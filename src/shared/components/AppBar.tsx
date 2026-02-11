import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, type ViewStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface AppBarAction {
  icon: string;
  onPress?: () => void;
  badge?: number;
}

interface AppBarProps {
  title: string;
  onBack?: () => void;
  actions?: AppBarAction[];
  children?: React.ReactNode;
}

export const AppBar: React.FC<AppBarProps> = ({ title, onBack, actions = [], children }) => (
  <View style={styles.headerWrapper}>
    <View style={styles.headerBar}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <FontAwesome5 name="chevron-left" size={24} color={Colors.white} />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.headerActions}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={`${action.icon}-${index}`}
            style={action.badge != null ? styles.cartButton : styles.headerIconBtn}
            onPress={action.onPress}
          >
            {action.badge != null ? (
              <>
                <View style={styles.cartCircle}>
                  <FontAwesome5 name={action.icon} size={14} color={Colors.headerGreen} />
                </View>
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{action.badge}</Text>
                </View>
              </>
            ) : (
              <FontAwesome5 name={action.icon} size={18} color={Colors.white} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
    {children ? (
      <View style={styles.secondaryRow}>{children}</View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: Colors.headerGreen,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backButton: {
    width: 70,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...Typography.h1Medium,
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: 'row',
    width: 70,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerIconBtn: {
    padding: 6,
  },
  cartButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.headerGreenLight,
    borderWidth: 1.5,
    borderColor: Colors.white,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    ...Typography.smallBold,
    color: Colors.white,
  },
});
