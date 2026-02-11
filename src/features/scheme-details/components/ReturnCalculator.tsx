import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../../shared/constants/colors';
import { Typography } from '../../../shared/constants/typography';
import { ToggleButtonGroup, ChipSelector } from '../../../shared/components';
import {
  useReturnCalculator,
  DURATIONS,
  SLIDER_MIN,
  SLIDER_MAX,
  SLIDER_STEP,
  formatIndian,
} from '../hooks/useReturnCalculator';

interface ReturnCalculatorProps {
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  threeMonthReturn: number;
  sixMonthReturn: number;
  minInvestment: number;
  minSipAmount: number;
}

export const ReturnCalculator: React.FC<ReturnCalculatorProps> = ({
  oneYearReturn,
  threeYearReturn,
  fiveYearReturn,
  threeMonthReturn,
  sixMonthReturn,
  minInvestment,
  minSipAmount,
}) => {
  const { t } = useTranslation();
  const {
    activeToggle,
    setActiveToggle,
    isSIP,
    amount,
    setAmount,
    selectedDurationKey,
    setSelectedDurationKey,
    totalInvested,
    estimatedValue,
    returnPct,
  } = useReturnCalculator({
    oneYearReturn,
    threeYearReturn,
    fiveYearReturn,
    threeMonthReturn,
    sixMonthReturn,
    minInvestment,
  });

  return (
    <View>
      {/* Monthly SIP / One Time toggle */}
      <ToggleButtonGroup
        options={[
          { key: 'sip', label: t('returnCalculator.monthlySIP') },
          { key: 'onetime', label: t('returnCalculator.oneTime') },
        ]}
        activeKey={activeToggle}
        onSelect={setActiveToggle}
      />

      {/* Amount label + badge */}
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>
          {isSIP ? t('returnCalculator.monthlySIPAmount') : t('returnCalculator.oneTimeAmount')}
        </Text>
        <View style={styles.amountBadge}>
          <Text style={styles.amountBadgeText}>₹{formatIndian(amount)}</Text>
        </View>
      </View>

      {/* Slider */}
      <Slider
        style={styles.slider}
        minimumValue={SLIDER_MIN}
        maximumValue={SLIDER_MAX}
        step={SLIDER_STEP}
        value={amount}
        onValueChange={(val: number) => setAmount(val)}
        minimumTrackTintColor={Colors.headerGreen}
        maximumTrackTintColor={Colors.border}
        thumbTintColor={Colors.white}
      />

      {/* Select Duration */}
      <Text style={styles.durationTitle}>{t('returnCalculator.selectDuration')}</Text>
      <ChipSelector
        options={DURATIONS.map((d) => ({ key: d.key, label: d.label }))}
        activeKey={selectedDurationKey}
        onSelect={setSelectedDurationKey}
      />

      {/* Results */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultLine}>
          {t('returnCalculator.totalInvestment')}  <Text style={styles.resultBold}>₹{formatIndian(totalInvested)}</Text>
        </Text>
        <Text style={styles.resultLine}>
          <Text style={styles.resultBold}>{t('returnCalculator.wouldHaveBecome')} </Text>
          <Text style={styles.resultGreen}>
            ₹{formatIndian(estimatedValue)} ({returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%)
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountLabel: {
    ...Typography.labelSemibold,
    color: Colors.text,
  },
  amountBadge: {
    backgroundColor: Colors.headerGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  amountBadgeText: {
    ...Typography.h3Bold,
    color: Colors.white,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  durationTitle: {
    ...Typography.labelSemibold,
    color: Colors.text,
    marginBottom: 12,
  },
  resultContainer: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resultLine: {
    ...Typography.labelRegular,
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultBold: {
    fontWeight: '700',
    color: Colors.text,
  },
  resultGreen: {
    fontWeight: '700',
    color: Colors.headerGreen,
  },
});
