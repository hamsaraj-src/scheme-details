import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Canvas,
  Path,
  LinearGradient,
  vec,
  Skia,
  Line as SkiaLine,
  Circle,
} from '@shopify/react-native-skia';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { runOnJS } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface NavDataPoint {
  nav: number;
  nav_date: string;
}

interface NavGraphProps {
  navData: NavDataPoint[];
  latestNav: number;
  latestNavDate: string;
  perDayNav: string;
  perDayNavPercentage: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 16;
const CARD_PADDING = 16;
const GRAPH_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2 - CARD_PADDING * 2;
const GRAPH_HEIGHT = 220;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 10;

const PERIODS = ['1M', '3M', '6M', '1Y', '3Y', '5Y', 'MAX'] as const;

const getFilteredData = (data: NavDataPoint[], period: string): NavDataPoint[] => {
  if (!data || data.length === 0) return [];
  const now = new Date(data[data.length - 1].nav_date);
  let cutoffDate: Date;

  switch (period) {
    case '1M':
      cutoffDate = new Date(now);
      cutoffDate.setMonth(cutoffDate.getMonth() - 1);
      break;
    case '3M':
      cutoffDate = new Date(now);
      cutoffDate.setMonth(cutoffDate.getMonth() - 3);
      break;
    case '6M':
      cutoffDate = new Date(now);
      cutoffDate.setMonth(cutoffDate.getMonth() - 6);
      break;
    case '1Y':
      cutoffDate = new Date(now);
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
      break;
    case '3Y':
      cutoffDate = new Date(now);
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 3);
      break;
    case '5Y':
      cutoffDate = new Date(now);
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 5);
      break;
    default:
      return data;
  }

  return data.filter((d) => new Date(d.nav_date) >= cutoffDate);
};

const getReturnPercentage = (data: NavDataPoint[]): number => {
  if (data.length < 2) return 0;
  const first = data[0].nav;
  const last = data[data.length - 1].nav;
  return ((last - first) / first) * 100;
};

const formatShortDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}'${String(d.getFullYear()).slice(2)}`;
};

const PERIOD_RETURN_KEYS: Record<string, string> = {
  '1M': 'navGraph.periodReturn1M',
  '3M': 'navGraph.periodReturn3M',
  '6M': 'navGraph.periodReturn6M',
  '1Y': 'navGraph.periodReturn1Y',
  '3Y': 'navGraph.periodReturn3Y',
  '5Y': 'navGraph.periodReturn5Y',
  'MAX': 'navGraph.periodReturnMAX',
};

export const NavGraph: React.FC<NavGraphProps> = ({
  navData,
  latestNav,
  latestNavDate,
  perDayNav,
  perDayNavPercentage,
}) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('MAX');
  const [touchX, setTouchX] = useState<number | null>(null);
  const [investTab, setInvestTab] = useState<'onetime' | 'sip'>('sip');

  const filteredData = useMemo(
    () => getFilteredData(navData, selectedPeriod),
    [navData, selectedPeriod]
  );

  const returnPct = useMemo(() => getReturnPercentage(filteredData), [filteredData]);

  const { linePath, gradientPath, minNav, maxNav, points } = useMemo(() => {
    if (filteredData.length === 0) {
      return { linePath: '', gradientPath: '', minNav: 0, maxNav: 0, points: [] };
    }

    const navValues = filteredData.map((d) => d.nav);
    const min = Math.min(...navValues);
    const max = Math.max(...navValues);
    const range = max - min || 1;

    const drawHeight = GRAPH_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

    const pts = filteredData.map((d, i) => ({
      x: (i / (filteredData.length - 1 || 1)) * GRAPH_WIDTH,
      y: PADDING_TOP + drawHeight - ((d.nav - min) / range) * drawHeight,
    }));

    const path = Skia.Path.Make();
    const gradPath = Skia.Path.Make();

    if (pts.length > 1) {
      path.moveTo(pts[0].x, pts[0].y);
      gradPath.moveTo(pts[0].x, pts[0].y);

      for (let i = 0; i < pts.length - 1; i++) {
        const current = pts[i];
        const next = pts[i + 1];
        const cpx1 = current.x + (next.x - current.x) / 3;
        const cpy1 = current.y;
        const cpx2 = next.x - (next.x - current.x) / 3;
        const cpy2 = next.y;
        path.cubicTo(cpx1, cpy1, cpx2, cpy2, next.x, next.y);
        gradPath.cubicTo(cpx1, cpy1, cpx2, cpy2, next.x, next.y);
      }

      gradPath.lineTo(pts[pts.length - 1].x, GRAPH_HEIGHT);
      gradPath.lineTo(pts[0].x, GRAPH_HEIGHT);
      gradPath.close();
    }

    return {
      linePath: path.toSVGString(),
      gradientPath: gradPath.toSVGString(),
      minNav: min,
      maxNav: max,
      points: pts,
    };
  }, [filteredData]);

  // Find the closest data point to touch position
  const touchInfo = useMemo(() => {
    if (touchX === null || points.length === 0 || filteredData.length === 0) return null;
    let closestIdx = 0;
    let closestDist = Infinity;
    for (let i = 0; i < points.length; i++) {
      const dist = Math.abs(points[i].x - touchX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }
    return {
      x: points[closestIdx].x,
      y: points[closestIdx].y,
      nav: filteredData[closestIdx].nav,
      date: filteredData[closestIdx].nav_date,
    };
  }, [touchX, points, filteredData]);

  const updateTouchX = useCallback((x: number) => {
    setTouchX(Math.max(0, Math.min(x, GRAPH_WIDTH)));
  }, []);

  const clearTouchX = useCallback(() => {
    setTouchX(null);
  }, []);

  const composedGesture = Gesture.Pan()
    .onBegin((e) => {
      'worklet';
      runOnJS(updateTouchX)(e.x);
    })
    .onUpdate((e) => {
      'worklet';
      runOnJS(updateTouchX)(e.x);
    })
    .onFinalize(() => {
      'worklet';
      runOnJS(clearTouchX)();
    })
    .minDistance(0)
    .activateAfterLongPress(150);

  return (
    <View style={styles.card}>
      {/* Header: Return title + percentage */}
      <View style={styles.header}>
        <Text style={styles.returnTitle}>{t('navGraph.returnLabel')}</Text>
        <View style={styles.returnRow}>
          <Text style={[styles.returnPct, { color: returnPct >= 0 ? Colors.positive : Colors.negative }]}>
            {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%
          </Text>
          <Text style={styles.returnPeriod}>{t(PERIOD_RETURN_KEYS[selectedPeriod] || 'navGraph.periodReturnDefault')}</Text>
        </View>
      </View>

      {/* Tooltip on touch */}
      {touchInfo && (
        <View style={[styles.tooltip, { left: Math.min(Math.max(touchInfo.x - 50, 0), GRAPH_WIDTH - 120) }]}>
          <View style={styles.tooltipInner}>
            <View style={styles.tooltipDot} />
            <Text style={styles.tooltipNav}>NAV:₹{touchInfo.nav.toFixed(2)}</Text>
          </View>
          <Text style={styles.tooltipDate}>{formatShortDate(touchInfo.date)}</Text>
        </View>
      )}

      {/* Graph */}
      {filteredData.length > 0 && (
        <View style={styles.graphContainer}>
          <Canvas style={{ width: GRAPH_WIDTH, height: GRAPH_HEIGHT }} pointerEvents="none">
            {/* Gradient fill */}
            <Path path={gradientPath} style="fill">
              <LinearGradient
                start={vec(0, PADDING_TOP)}
                end={vec(0, GRAPH_HEIGHT)}
                colors={[Colors.graphGradientStart, Colors.graphGradientEnd]}
              />
            </Path>
            {/* Line */}
            <Path
              path={linePath}
              style="stroke"
              strokeWidth={1.5}
              color={Colors.graphLine}
              strokeCap="round"
              strokeJoin="round"
            />
            {/* Touch indicator: vertical line + dot */}
            {touchInfo && (
              <>
                <SkiaLine
                  p1={vec(touchInfo.x, 0)}
                  p2={vec(touchInfo.x, GRAPH_HEIGHT)}
                  color={Colors.graphLine}
                  strokeWidth={1}
                />
                <Circle cx={touchInfo.x} cy={touchInfo.y} r={5} color={Colors.graphLine} />
                <Circle cx={touchInfo.x} cy={touchInfo.y} r={3} color="#FFFFFF" />
              </>
            )}
          </Canvas>
          {/* Transparent gesture overlay on top of Canvas */}
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={styles.gestureOverlay} />
          </GestureDetector>
        </View>
      )}

      {/* Min / Max labels */}
      <View style={styles.graphLabels}>
        <Text style={styles.graphLabel}>₹{minNav.toFixed(2)}</Text>
        <Text style={styles.graphLabel}>₹{maxNav.toFixed(2)}</Text>
      </View>

      {/* Period selector */}
      <View style={styles.periodContainer}>
        {PERIODS.map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodChip,
              selectedPeriod === period && styles.activePeriodChip,
            ]}
            onPress={() => { setSelectedPeriod(period); setTouchX(null); }}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.activePeriodText,
              ]}
            >
              {t(`navGraph.period${period}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* One Time / Start SIP toggle */}
      <View style={styles.investToggleRow}>
        <TouchableOpacity
          style={[styles.investToggle, investTab === 'onetime' ? styles.investToggleActive : styles.investToggleInactive]}
          onPress={() => setInvestTab('onetime')}
        >
          <Text style={[styles.investToggleText, investTab === 'onetime' && styles.investToggleTextActive]}>
            {t('navGraph.oneTime')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.investToggle, investTab === 'sip' ? styles.investToggleActive : styles.investToggleInactive]}
          onPress={() => setInvestTab('sip')}
        >
          <Text style={[styles.investToggleText, investTab === 'sip' && styles.investToggleTextActive]}>
            {t('navGraph.startSIP')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Min amounts */}
      <View style={styles.minAmountRow}>
        <View style={styles.minAmountCol}>
          <Text style={styles.minAmountLabel}>{t('navGraph.minOneTimeAmount')}</Text>
          <Text style={styles.minAmountValue}>₹ 5000</Text>
        </View>
        <View style={styles.minAmountColRight}>
          <Text style={styles.minAmountLabel}>{t('navGraph.minSIPAmount')}</Text>
          <Text style={styles.minAmountValue}>₹ 25/day</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: CARD_MARGIN,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingTop: 16,
    paddingHorizontal: CARD_PADDING,
    paddingBottom: 14,
  },
  header: {
    marginBottom: 8,
  },
  returnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  returnRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  returnPct: {
    fontSize: 18,
    fontWeight: '700',
  },
  returnPeriod: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  tooltip: {
    position: 'absolute',
    top: 50,
    zIndex: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  tooltipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tooltipDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: Colors.graphLine,
  },
  tooltipNav: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  tooltipDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    marginLeft: 14,
  },
  graphContainer: {
    marginTop: 4,
    position: 'relative',
  },
  gestureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  graphLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8,
  },
  graphLabel: {
    ...Typography.small,
    color: Colors.textLight,
  },
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  periodChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.chipInactive,
  },
  activePeriodChip: {
    backgroundColor: Colors.chipActive,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  periodText: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  activePeriodText: {
    color: Colors.primary,
  },
  investToggleRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  investToggle: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#E8F0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  investToggleActive: {
    backgroundColor: Colors.headerGreen,
  },
  investToggleInactive: {
    backgroundColor: '#E8F0E8',
  },
  investToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  investToggleTextActive: {
    color: '#FFFFFF',
  },
  minAmountRow: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  minAmountCol: {
    flex: 1,
  },
  minAmountColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  minAmountLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  minAmountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
});
