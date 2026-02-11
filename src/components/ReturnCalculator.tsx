import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { formatCurrency } from '../utils/formatters';

interface ReturnCalculatorProps {
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  threeMonthReturn: number;
  sixMonthReturn: number;
  minInvestment: number;
  minSipAmount: number;
}

const DURATIONS = [
  { label: '1M', months: 1 },
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
  { label: '1Y', months: 12 },
  { label: '3Y', months: 36 },
  { label: '5Y', months: 60 },
];

const SLIDER_MIN = 500;
const SLIDER_MAX = 100000;
const SLIDER_STEP = 500;

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
  const [isSIP, setIsSIP] = useState(true);
  const [amount, setAmount] = useState(minInvestment);
  const [selectedDuration, setSelectedDuration] = useState(0);

  // Pick the annualized return rate based on selected duration
  const annualReturn = useMemo(() => {
    const months = DURATIONS[selectedDuration].months;
    if (months <= 3) return threeMonthReturn;
    if (months <= 6) return sixMonthReturn;
    if (months <= 12) return oneYearReturn;
    if (months <= 36) return threeYearReturn;
    return fiveYearReturn;
  }, [selectedDuration, threeMonthReturn, sixMonthReturn, oneYearReturn, threeYearReturn, fiveYearReturn]);

  const { totalInvested, estimatedValue, returnPct } = useMemo(() => {
    const months = DURATIONS[selectedDuration].months;
    const annualRate = annualReturn / 100;

    if (isSIP) {
      const monthlyRate = annualRate / 12;
      const invested = amount * months;
      let futureValue: number;
      if (monthlyRate === 0) {
        futureValue = invested;
      } else {
        futureValue =
          amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);
      }
      const pct = invested > 0 ? ((futureValue - invested) / invested) * 100 : 0;
      return { totalInvested: invested, estimatedValue: futureValue, returnPct: pct };
    } else {
      const invested = amount;
      const years = months / 12;
      const futureValue = amount * Math.pow(1 + annualRate, years);
      const pct = invested > 0 ? ((futureValue - invested) / invested) * 100 : 0;
      return { totalInvested: invested, estimatedValue: futureValue, returnPct: pct };
    }
  }, [amount, isSIP, selectedDuration, annualReturn]);

  const formatIndian = (num: number) => {
    const rounded = Math.round(num);
    return rounded.toLocaleString('en-IN');
  };

  return (
    <View>
      {/* Monthly SIP / One Time toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, isSIP && styles.toggleBtnActive]}
          onPress={() => setIsSIP(true)}
        >
          <Text style={[styles.toggleText, isSIP && styles.toggleTextActive]}>
            {t('returnCalculator.monthlySIP')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, !isSIP && styles.toggleBtnActive]}
          onPress={() => setIsSIP(false)}
        >
          <Text style={[styles.toggleText, !isSIP && styles.toggleTextActive]}>
            {t('returnCalculator.oneTime')}
          </Text>
        </TouchableOpacity>
      </View>

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
        maximumTrackTintColor="#E0E0E0"
        thumbTintColor="#FFFFFF"
      />

      {/* Select Duration */}
      <Text style={styles.durationTitle}>{t('returnCalculator.selectDuration')}</Text>
      <View style={styles.durationRow}>
        {DURATIONS.map((d, i) => (
          <TouchableOpacity
            key={d.label}
            style={[styles.durationChip, selectedDuration === i && styles.durationChipActive]}
            onPress={() => setSelectedDuration(i)}
          >
            <Text style={[styles.durationText, selectedDuration === i && styles.durationTextActive]}>
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#E8F0E8',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: Colors.headerGreen,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  amountBadge: {
    backgroundColor: Colors.headerGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  amountBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  durationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  durationChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: '#FFFFFF',
  },
  durationChipActive: {
    backgroundColor: Colors.headerGreen,
    borderColor: Colors.headerGreen,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  durationTextActive: {
    color: '#FFFFFF',
  },
  resultContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resultLine: {
    fontSize: 15,
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
