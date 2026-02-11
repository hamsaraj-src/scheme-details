import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';

interface RiskometerProps {
  riskLevel: string;
}

const RISK_LEVELS = [
  { key: 'low', i18nKey: 'riskometer.low', matchValue: 'low', barColor: '#4CAF50' },
  { key: 'lowToModerate', i18nKey: 'riskometer.lowToModerate', matchValue: 'low to moderate', barColor: '#8BC34A' },
  { key: 'moderate', i18nKey: 'riskometer.moderate', matchValue: 'moderate', barColor: '#FFCA28' },
  { key: 'moderatelyHigh', i18nKey: 'riskometer.moderatelyHigh', matchValue: 'moderately high', barColor: '#FF9800' },
  { key: 'veryHigh', i18nKey: 'riskometer.veryHigh', matchValue: 'very high', barColor: '#F44336' },
];

const BADGE_COLORS: Record<string, string> = {
  low: '#5B8C5A',
  'low to moderate': '#A4C639',
  moderate: '#FFC107',
  'moderately high': '#FF9800',
  high: '#FF5722',
  'very high': '#FF4081',
};

export const Riskometer: React.FC<RiskometerProps> = ({ riskLevel }) => {
  const { t } = useTranslation();

  const activeIndex = useMemo(() => {
    const normalized = riskLevel.toLowerCase().trim();
    return RISK_LEVELS.findIndex(
      (r) => r.matchValue === normalized
    );
  }, [riskLevel]);

  const badgeColor = BADGE_COLORS[riskLevel.toLowerCase().trim()] || '#FF4081';

  return (
    <View style={styles.container}>
      {/* Horizontal color bar */}
      <View style={styles.barRow}>
        {RISK_LEVELS.map((level, index) => (
          <View
            key={level.key}
            style={[
              styles.barSegment,
              { backgroundColor: level.barColor },
              index === 0 && styles.barFirst,
              index === RISK_LEVELS.length - 1 && styles.barLast,
              activeIndex >= 0 && activeIndex !== index && { opacity: 0.45 },
            ]}
          />
        ))}
      </View>

      {/* Labels under bar with triangle indicator */}
      <View style={styles.labelsRow}>
        {RISK_LEVELS.map((level, index) => (
          <View key={level.key} style={styles.labelCol}>
            {activeIndex === index && (
              <View style={[styles.triangle, { borderBottomColor: level.barColor }]} />
            )}
            <Text
              style={[
                styles.labelText,
                activeIndex === index && styles.activeLabelText,
              ]}
            >
              {t(level.i18nKey)}
            </Text>
          </View>
        ))}
      </View>

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        {t('riskometer.disclaimer')}
      </Text>

      {/* Risk badge */}
      <View style={[styles.riskBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.riskBadgeText}>{riskLevel} {t('riskometer.riskSuffix')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  barRow: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 10,
    width: '100%',
  },
  barSegment: {
    flex: 1,
  },
  barFirst: {
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  barLast: {
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  labelsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  labelCol: {
    flex: 1,
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  activeLabelText: {
    fontWeight: '700',
    color: Colors.text,
  },
  disclaimer: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  riskBadge: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  riskBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
