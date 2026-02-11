import { useMemo } from 'react';
import { useReturnCalculatorContext } from '../context/ReturnCalculatorContext';

export const DURATIONS = [
  { key: '1M', label: '1M', months: 1 },
  { key: '3M', label: '3M', months: 3 },
  { key: '6M', label: '6M', months: 6 },
  { key: '1Y', label: '1Y', months: 12 },
  { key: '3Y', label: '3Y', months: 36 },
  { key: '5Y', label: '5Y', months: 60 },
];

export const SLIDER_MIN = 500;
export const SLIDER_MAX = 100000;
export const SLIDER_STEP = 500;

interface UseReturnCalculatorParams {
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  threeMonthReturn: number;
  sixMonthReturn: number;
  minInvestment: number;
}

export const formatIndian = (num: number): string => {
  const rounded = Math.round(num);
  return rounded.toLocaleString('en-IN');
};

export const useReturnCalculator = ({
  oneYearReturn,
  threeYearReturn,
  fiveYearReturn,
  threeMonthReturn,
  sixMonthReturn,
}: UseReturnCalculatorParams) => {
  const {
    activeToggle,
    setActiveToggle,
    amount,
    setAmount,
    selectedDurationKey,
    setSelectedDurationKey,
  } = useReturnCalculatorContext();
  const isSIP = activeToggle === 'sip';
  const selectedDuration = DURATIONS.findIndex((d) => d.key === selectedDurationKey);

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

  return {
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
  };
};
