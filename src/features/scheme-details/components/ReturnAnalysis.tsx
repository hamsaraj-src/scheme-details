import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../../shared/constants/colors';
import { Typography } from '../../../shared/constants/typography';
import { ToggleButtonGroup } from '../../../shared/components';
import { useReturnAnalysis, CHART_HEIGHT, Y_LABEL_WIDTH } from '../hooks/useReturnAnalysis';

const BAR_DURATION = 600;
const BAR_STAGGER = 100;

const AnimatedBar: React.FC<{
  height: number;
  index: number;
  value: number;
  animKey: string;
}> = ({ height, index, value, animKey }) => {
  const { t } = useTranslation();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(
      index * BAR_STAGGER,
      withTiming(1, { duration: BAR_DURATION, easing: Easing.out(Easing.cubic) })
    );
  }, [animKey]);

  const barStyle = useAnimatedStyle(() => ({
    height: progress.value * height,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <View style={styles.barCol}>
      <Animated.Text style={[styles.barValueLabel, labelStyle]}>
        {t('common.percentValue', { value: Math.round(value) })}
      </Animated.Text>
      <Animated.View
        style={[
          styles.bar,
          { backgroundColor: Colors.headerGreen },
          barStyle,
        ]}
      />
    </View>
  );
};

interface ReturnItem {
  month: string;
  percentage: string | number;
}

interface ReturnAnalysisProps {
  sipReturns: ReturnItem[];
  lumpsumReturns: ReturnItem[];
}

export const ReturnAnalysis: React.FC<ReturnAnalysisProps> = ({
  sipReturns,
  lumpsumReturns,
}) => {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    parsed,
    yLabels,
    maxY,
    minY,
    getBarHeight,
  } = useReturnAnalysis({ sipReturns, lumpsumReturns });

  return (
    <View>
      {/* Toggle tabs */}
      <ToggleButtonGroup
        options={[
          { key: 'ptp', label: t('returnAnalysis.pointToPoint') },
          { key: 'sip', label: t('returnAnalysis.sipReturns') },
        ]}
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key as 'ptp' | 'sip')}
      />

      {/* Bar chart */}
      <View style={styles.chartOuter}>
        {/* Y-axis + chart area row */}
        <View style={styles.chartRow}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            {yLabels.map((label) => (
              <Text key={label} style={styles.yLabel}>{t('common.percentValue', { value: label })}</Text>
            ))}
          </View>

          {/* Chart area with grid + bars */}
          <View style={styles.chartArea}>
            {/* Grid lines */}
            {yLabels.map((label) => (
              <View
                key={label}
                style={[
                  styles.gridLine,
                  {
                    position: 'absolute',
                    top: ((maxY - label) / (maxY - minY)) * CHART_HEIGHT,
                    left: 0,
                    right: 0,
                  },
                ]}
              />
            ))}

            {/* Bars */}
            <View style={styles.barsRow}>
              {parsed.map((item, index) => {
                const barH = getBarHeight(item.value);
                return (
                  <AnimatedBar
                    key={item.label}
                    height={barH}
                    index={index}
                    value={item.value}
                    animKey={activeTab}
                  />
                );
              })}
            </View>
          </View>
        </View>

        {/* X-axis labels */}
        <View style={styles.xAxisRow}>
          <View style={styles.xAxisSpacer} />
          <View style={styles.xAxisLabels}>
            {parsed.map((item) => (
              <View key={item.label} style={styles.xLabelCol}>
                <Text style={styles.xLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartOuter: {
    marginTop: 4,
  },
  chartRow: {
    flexDirection: 'row',
  },
  yAxis: {
    width: Y_LABEL_WIDTH,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    paddingRight: 4,
  },
  yLabel: {
    ...Typography.tiny,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    height: CHART_HEIGHT,
  },
  gridLine: {
    height: 0,
    backgroundColor: 'transparent',
  },
  barsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValueLabel: {
    ...Typography.tinyBold,
    color: Colors.headerGreen,
    marginBottom: 4,
  },
  bar: {
    width: 32,
    borderRadius: 0,
  },
  xAxisRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  xAxisSpacer: {
    width: Y_LABEL_WIDTH,
  },
  xAxisLabels: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  xLabelCol: {
    flex: 1,
    alignItems: 'center',
  },
  xLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
