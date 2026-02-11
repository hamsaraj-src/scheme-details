import { useMemo } from 'react';
import { Colors } from '../../../shared/constants/colors';
import { useSectorAllocationContext } from '../context/SectorAllocationContext';

interface SectorItem {
  sector_name: string;
  percentage_assets: number;
}

interface AssetItem {
  asset_name: string;
  asset_percentage: number;
}

export const CHART_SIZE = 160;
export const RADIUS = 65;
export const INNER_RADIUS = 40;

const ASSET_COLORS: Record<string, string> = {
  Equity: Colors.assetEquity,
  Debt: Colors.assetDebt,
  Cash: Colors.assetCash,
  Gold: Colors.assetGold,
  Other: Colors.assetOther,
};

export interface Segment {
  name: string;
  percentage: number;
  startAngle: number;
  endAngle: number;
  color: string;
}

export interface AnimatedSegment extends Segment {
  animStart: number;
  animEnd: number;
}

interface UseSectorAllocationParams {
  sectors: SectorItem[];
  assets?: AssetItem[];
}

export const useSectorAllocation = ({ sectors, assets }: UseSectorAllocationParams) => {
  const { activeTab, setActiveTab, progress } = useSectorAllocationContext();

  // Sector segments
  const sectorSegments: Segment[] = useMemo(() => {
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
  const assetSegments: Segment[] = useMemo(() => {
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
  const animatedSegments: AnimatedSegment[] = useMemo(() => {
    return allSegments.map((seg) => ({
      ...seg,
      animStart: seg.startAngle * progress,
      animEnd: seg.endAngle * progress,
    }));
  }, [allSegments, progress]);

  return {
    activeTab,
    setActiveTab,
    allSegments,
    animatedSegments,
  };
};
