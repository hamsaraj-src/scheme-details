import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface SectorItem {
  sector_name: string;
  percentage_assets: number;
}

interface AssetItem {
  asset_name: string;
  asset_percentage: number;
}

interface SectorAllocationProps {
  sectors: SectorItem[];
  assets?: AssetItem[];
}

const CHART_SIZE = 160;
const CENTER = CHART_SIZE / 2;
const RADIUS = 65;
const INNER_RADIUS = 40;

const ASSET_COLORS: Record<string, string> = {
  Equity: Colors.assetEquity,
  Debt: Colors.assetDebt,
  Cash: Colors.assetCash,
  Gold: Colors.assetGold,
  Other: Colors.assetOther,
};

const createDonutSegment = (
  startAngle: number,
  endAngle: number,
  outerR: number,
  innerR: number
): string => {
  const path = Skia.Path.Make();
  path.moveTo(
    CENTER + outerR * Math.cos((startAngle - 90) * (Math.PI / 180)),
    CENTER + outerR * Math.sin((startAngle - 90) * (Math.PI / 180))
  );
  path.arcToOval(
    { x: CENTER - outerR, y: CENTER - outerR, width: outerR * 2, height: outerR * 2 },
    startAngle - 90,
    endAngle - startAngle,
    false
  );
  path.lineTo(
    CENTER + innerR * Math.cos((endAngle - 90) * (Math.PI / 180)),
    CENTER + innerR * Math.sin((endAngle - 90) * (Math.PI / 180))
  );
  path.arcToOval(
    { x: CENTER - innerR, y: CENTER - innerR, width: innerR * 2, height: innerR * 2 },
    endAngle - 90,
    -(endAngle - startAngle),
    false
  );
  path.close();
  return path.toSVGString();
};

const ANIM_DURATION = 700;

const useDonutAnimation = (key: string) => {
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setProgress(0);
    startRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startRef.current;
      const t = Math.min(elapsed / ANIM_DURATION, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [key]);

  return progress;
};

export const SectorAllocation: React.FC<SectorAllocationProps> = ({ sectors, assets }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'asset' | 'sector'>('sector');
  const progress = useDonutAnimation(activeTab);

  // Sector segments
  const sectorSegments = useMemo(() => {
    const total = sectors.reduce((sum, s) => sum + s.percentage_assets, 0);
    let angle = 0;
    return sectors.map((sector, index) => {
      const sweep = (sector.percentage_assets / total) * 360;
      const start = angle;
      angle += sweep;
      return {
        name: sector.sector_name,
        percentage: sector.percentage_assets,
        startAngle: start,
        endAngle: angle,
        color: Colors.sectorColors[index % Colors.sectorColors.length],
      };
    });
  }, [sectors]);

  // Asset segments
  const assetSegments = useMemo(() => {
    if (!assets || assets.length === 0) return [];
    const total = assets.reduce((sum, a) => sum + a.asset_percentage, 0);
    let angle = 0;
    return assets.map((asset, index) => {
      const sweep = (asset.asset_percentage / total) * 360;
      const start = angle;
      angle += sweep;
      return {
        name: asset.asset_name,
        percentage: asset.asset_percentage,
        startAngle: start,
        endAngle: angle,
        color: ASSET_COLORS[asset.asset_name] || Colors.sectorColors[index % Colors.sectorColors.length],
      };
    });
  }, [assets]);

  const allSegments = activeTab === 'sector' ? sectorSegments : assetSegments;

  // Animated segments: scale start/end angles by progress
  const animatedSegments = useMemo(() => {
    return allSegments.map((seg) => ({
      ...seg,
      animStart: seg.startAngle * progress,
      animEnd: seg.endAngle * progress,
    }));
  }, [allSegments, progress]);

  return (
    <View>
      {/* Tab bar */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'asset' && styles.tabActive]}
          onPress={() => setActiveTab('asset')}
        >
          <Text style={[styles.tabText, activeTab === 'asset' && styles.tabTextActive]}>
            {t('sectorAllocation.assetClass')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sector' && styles.tabActive]}
          onPress={() => setActiveTab('sector')}
        >
          <Text style={[styles.tabText, activeTab === 'sector' && styles.tabTextActive]}>
            {t('sectorAllocation.sector')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabDivider} />

      {/* Donut chart + legend */}
      <View style={styles.chartRow}>
        <Canvas style={{ width: CHART_SIZE, height: CHART_SIZE }}>
          {animatedSegments.map((seg) => {
            if (seg.animEnd - seg.animStart < 0.01) return null;
            const pathStr = createDonutSegment(
              seg.animStart,
              seg.animEnd,
              RADIUS,
              INNER_RADIUS
            );
            return (
              <Path
                key={seg.name}
                path={pathStr}
                style="fill"
                color={seg.color}
              />
            );
          })}
        </Canvas>

        <View style={styles.legendContainer}>
          {allSegments.map((seg) => (
            <View key={seg.name} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
              <Text style={styles.legendPct}>{seg.percentage.toFixed(2)}%</Text>
              <Text style={styles.legendName} numberOfLines={1}>{seg.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.headerGreen,
  },
  tabText: {
    ...Typography.labelMedium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    fontWeight: '600',
    color: Colors.headerGreen,
  },
  tabDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: 20,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendContainer: {
    flex: 1,
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendPct: {
    ...Typography.bodyStrong,
    color: Colors.text,
    width: 65,
  },
  legendName: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
});
