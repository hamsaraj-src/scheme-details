import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../../shared/constants/colors';
import { Typography } from '../../../shared/constants/typography';
import { formatNumber } from '../../../shared/utils/formatters';
import { IconAvatar } from '../../../shared/components';

interface AnalyticsDataProps {
  analytics: {
    beta: string;
    alpha: string;
    sharpe_ratio: string;
    sortino_ratio: string;
    standard_deviation: string;
    treynor: string;
    rsquared: string;
    information_ratio: string;
    pescore: string;
    Drawdown_1Y: string;
    Drawdown_3Y: string;
    as_on_date: string;
  };
}

const getDescKey = (key: string, value: number): string => {
  switch (key) {
    case 'beta':
      if (value < 1) return 'analytics.betaLow';
      if (value === 1) return 'analytics.betaEqual';
      return 'analytics.betaHigh';
    case 'standardDeviation':
      if (value < 10) return 'analytics.stdDevLow';
      if (value < 15) return 'analytics.stdDevMid';
      return 'analytics.stdDevHigh';
    case 'sharpeRatio':
      if (value > 1) return 'analytics.sharpeHigh';
      if (value > 0.5) return 'analytics.sharpeMid';
      return 'analytics.sharpeLow';
    case 'alpha':
      return 'analytics.alphaDesc';
    case 'sortinoRatio':
      if (value > 1.5) return 'analytics.sortinoHigh';
      if (value > 1) return 'analytics.sortinoMid';
      return 'analytics.sortinoLow';
    case 'treynor':
      if (value > 10) return 'analytics.treynorHigh';
      return 'analytics.treynorLow';
    case 'informationRatio':
      if (value > 0.5) return 'analytics.infoRatioHigh';
      return 'analytics.infoRatioLow';
    case 'rsquared':
      if (value > 0.85) return 'analytics.rsquaredHigh';
      return 'analytics.rsquaredLow';
    case 'peScore':
      return 'analytics.peScoreDesc';
    default:
      return '';
  }
};

export const AnalyticsData: React.FC<AnalyticsDataProps> = ({ analytics }) => {
  const { t } = useTranslation();

  const items = useMemo(() => [
    { key: 'beta', label: t('analytics.beta'), value: formatNumber(analytics.beta, t), raw: parseFloat(analytics.beta) || 0, icon: 'bold' },
    { key: 'standardDeviation', label: t('analytics.standardDeviation'), value: t('common.percentValue', { value: formatNumber(analytics.standard_deviation, t) }), raw: parseFloat(analytics.standard_deviation) || 0, icon: 'chart-area' },
    { key: 'sharpeRatio', label: t('analytics.sharpeRatio'), value: formatNumber(analytics.sharpe_ratio, t), raw: parseFloat(analytics.sharpe_ratio) || 0, icon: 'percentage' },
    { key: 'alpha', label: t('analytics.alpha'), value: formatNumber(analytics.alpha, t), raw: parseFloat(analytics.alpha) || 0, icon: 'font' },
    { key: 'sortinoRatio', label: t('analytics.sortinoRatio'), value: formatNumber(analytics.sortino_ratio, t), raw: parseFloat(analytics.sortino_ratio) || 0, icon: 'arrow-up' },
    { key: 'treynor', label: t('analytics.treynor'), value: formatNumber(analytics.treynor, t), raw: parseFloat(analytics.treynor) || 0, icon: 'gem' },
    { key: 'informationRatio', label: t('analytics.informationRatio'), value: formatNumber(analytics.information_ratio, t), raw: parseFloat(analytics.information_ratio) || 0, icon: 'info-circle' },
    { key: 'rsquared', label: t('analytics.rSquared'), value: formatNumber(analytics.rsquared, t), raw: parseFloat(analytics.rsquared) || 0, icon: 'bullseye' },
  ], [analytics, t]);

  return (
    <View>
      {items.map((item) => (
        <View key={item.key} style={styles.card}>
          <IconAvatar
            icon={item.icon}
            size={44}
            iconSize={18}
            backgroundColor={Colors.surfaceGreenLight}
            color={Colors.headerGreen}
            style={styles.iconCircle}
          />
          <View style={styles.content}>
            <Text style={styles.title}>
              {item.label} : {item.value}
            </Text>
            <Text style={styles.description}>
              {t(getDescKey(item.key, item.raw))}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  iconCircle: {
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.h3Bold,
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    ...Typography.captionRegular,
    color: Colors.textSecondary,
  },
});
