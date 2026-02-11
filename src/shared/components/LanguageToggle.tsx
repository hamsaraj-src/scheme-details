import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, LanguageCode } from '../../locales/i18n';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

const TOGGLE_WIDTH = 120;
const PILL_WIDTH = TOGGLE_WIDTH / LANGUAGES.length;
const PILL_HEIGHT = 32;
const BORDER_RADIUS = 16;
const ANIMATION_DURATION = 250;

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const currentIndex = LANGUAGES.findIndex((l) => l.code === i18n.language);
  const translateX = useSharedValue(currentIndex * PILL_WIDTH);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleSelect = useCallback(
    (code: LanguageCode, index: number) => {
      if (code === i18n.language) return;
      translateX.value = withTiming(index * PILL_WIDTH, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      i18n.changeLanguage(code);
    },
    [i18n, translateX],
  );

  return (
    <View style={styles.container}>
      {/* Track */}
      <View style={styles.track}>
        {/* Animated active pill */}
        <Animated.View style={[styles.pill, pillStyle]} />

        {/* Language options */}
        {LANGUAGES.map((lang, index) => {
          const isActive = lang.code === i18n.language;
          return (
            <TouchableOpacity
              key={lang.code}
              style={styles.option}
              onPress={() => handleSelect(lang.code as LanguageCode, index)}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text
                style={[
                  styles.label,
                  isActive ? styles.labelActive : styles.labelInactive,
                ]}
              >
                {lang.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  track: {
    flexDirection: 'row',
    width: TOGGLE_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: BORDER_RADIUS,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    width: PILL_WIDTH,
    height: PILL_HEIGHT - 2,
    borderRadius: BORDER_RADIUS,
    backgroundColor: Colors.headerGreen,
  },
  option: {
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    zIndex: 1,
  },
  flag: {
    fontSize: 12,
  },
  label: {
    ...Typography.smallBold,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  labelActive: {
    color: Colors.white,
  },
  labelInactive: {
    color: Colors.textSecondary,
  },
});
