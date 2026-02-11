import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {
  Canvas,
  Path,
  LinearGradient,
  vec,
  Line as SkiaLine,
  Circle,
} from '@shopify/react-native-skia';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../../shared/constants/colors';
import { Typography } from '../../../shared/constants/typography';
import { ChipSelector } from '../../../shared/components';
import {
  useNavGraph,
  PERIODS,
  PERIOD_RETURN_KEYS,
  GRAPH_WIDTH,
  GRAPH_HEIGHT,
  CARD_MARGIN,
  CARD_PADDING,
  PADDING_TOP,
  formatShortDate,
} from '../hooks/useNavGraph';

interface NavGraphProps {
  navData: { nav: number; nav_date: string }[];
  latestNav: number;
  latestNavDate: string;
  perDayNav: string;
  perDayNavPercentage: string;
  minInvestment?: number;
  minSipAmount?: number;
}

export const NavGraph: React.FC<NavGraphProps> = ({
  navData,
  latestNav,
  latestNavDate,
  perDayNav,
  perDayNavPercentage,
  minInvestment,
  minSipAmount,
}) => {
  const { t } = useTranslation();
  const {
    selectedPeriod,
    handlePeriodSelect,
    filteredData,
    returnPct,
    linePath,
    gradientPath,
    minNav,
    maxNav,
    touchInfo,
    composedGesture,
  } = useNavGraph({ navData });

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
            <Text style={styles.tooltipNav}>{t('navGraph.navLabel')}:₹{touchInfo.nav.toFixed(2)}</Text>
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
                <Circle cx={touchInfo.x} cy={touchInfo.y} r={3} color={Colors.white} />
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
        <ChipSelector
          options={PERIODS.map((p) => ({ key: p, label: t(`navGraph.period${p}`) }))}
          activeKey={selectedPeriod}
          onSelect={handlePeriodSelect}
          size="small"
        />
      </View>

      {/* One Time / Start SIP toggle */}
      {/* <View style={styles.investToggleRow}>
        <ToggleButtonGroup
          options={[
            { key: 'onetime', label: t('navGraph.oneTime') },
            { key: 'sip', label: t('navGraph.startSIP') },
          ]}
          activeKey={investTab}
          onSelect={(key) => setInvestTab(key as 'onetime' | 'sip')}
        />
      </View> */}

      {/* Min amounts */}
      <View style={styles.minAmountRow}>
        <View style={styles.minAmountCol}>
          <Text style={styles.minAmountLabel}>{t('navGraph.minOneTimeAmount')}</Text>
          <Text style={styles.minAmountValue}>₹ {minInvestment?.toLocaleString('en-IN') ?? t('schemeDetails.na')}</Text>
        </View>
        <View style={styles.minAmountColRight}>
          <Text style={styles.minAmountLabel}>{t('navGraph.minSIPAmount')}</Text>
          <Text style={styles.minAmountValue}>₹ {minSipAmount ?? t('schemeDetails.na')}/{t('navGraph.perDay')}</Text>
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
    borderColor: Colors.borderLight,
    paddingTop: 16,
    paddingHorizontal: CARD_PADDING,
    paddingBottom: 14,
  },
  header: {
    marginBottom: 8,
  },
  returnTitle: {
    ...Typography.h3Bold,
    color: Colors.text,
    marginBottom: 4,
  },
  returnRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  returnPct: {
    ...Typography.h2,
  },
  returnPeriod: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  tooltip: {
    position: 'absolute',
    top: 50,
    zIndex: 10,
    backgroundColor: Colors.tooltipBackground,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: Colors.shadow,
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
    ...Typography.bodyStrong,
    color: Colors.text,
  },
  tooltipDate: {
    ...Typography.caption,
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
    marginTop: 4,
  },
  investToggleRow: {
    marginTop: 16,
  },
  minAmountRow: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
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
    ...Typography.h2,
    color: Colors.text,
  },
});
