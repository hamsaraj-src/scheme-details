import { useMemo } from 'react';
import { Colors } from '../../../shared/constants/colors';

export const RISK_LEVELS = [
  { key: 'low', i18nKey: 'riskometer.low', matchValue: 'low', barColor: Colors.riskLowBar },
  { key: 'lowToModerate', i18nKey: 'riskometer.lowToModerate', matchValue: 'low to moderate', barColor: Colors.riskLowToModerateBar },
  { key: 'moderate', i18nKey: 'riskometer.moderate', matchValue: 'moderate', barColor: Colors.riskModerateBar },
  { key: 'moderatelyHigh', i18nKey: 'riskometer.moderatelyHigh', matchValue: 'moderately high', barColor: Colors.riskModeratelyHighBar },
  { key: 'veryHigh', i18nKey: 'riskometer.veryHigh', matchValue: 'very high', barColor: Colors.riskVeryHighBar },
];

const BADGE_COLORS: Record<string, string> = {
  low: Colors.riskLowBadge,
  'low to moderate': Colors.riskLowToModerateBadge,
  moderate: Colors.riskModerateBadge,
  'moderately high': Colors.riskModeratelyHighBadge,
  high: Colors.riskHighBadge,
  'very high': Colors.riskVeryHighBadge,
};

export const useRiskometer = (riskLevel: string) => {
  const activeIndex = useMemo(() => {
    const normalized = riskLevel.toLowerCase().trim();
    return RISK_LEVELS.findIndex((r) => r.matchValue === normalized);
  }, [riskLevel]);

  const badgeColor = BADGE_COLORS[riskLevel.toLowerCase().trim()] ?? Colors.textSecondary;

  return {
    activeIndex,
    badgeColor,
  };
};
