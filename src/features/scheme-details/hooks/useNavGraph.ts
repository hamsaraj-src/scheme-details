import { useMemo, useCallback } from 'react';
import { Dimensions } from 'react-native';
import { Skia } from '@shopify/react-native-skia';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useNavGraphContext } from '../context/NavGraphContext';

interface NavDataPoint {
  nav: number;
  nav_date: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
export const CARD_MARGIN = 16;
export const CARD_PADDING = 16;
export const GRAPH_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2 - CARD_PADDING * 2;
export const GRAPH_HEIGHT = 220;
export const PADDING_TOP = 10;
const PADDING_BOTTOM = 10;

export const PERIODS = ['1M', '3M', '6M', '1Y', '3Y', '5Y', 'MAX'] as const;

export const PERIOD_RETURN_KEYS: Record<string, string> = {
  '1M': 'navGraph.periodReturn1M',
  '3M': 'navGraph.periodReturn3M',
  '6M': 'navGraph.periodReturn6M',
  '1Y': 'navGraph.periodReturn1Y',
  '3Y': 'navGraph.periodReturn3Y',
  '5Y': 'navGraph.periodReturn5Y',
  'MAX': 'navGraph.periodReturnMAX',
};

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

export const formatShortDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}'${String(d.getFullYear()).slice(2)}`;
};

interface UseNavGraphParams {
  navData: NavDataPoint[];
}

export const useNavGraph = ({ navData }: UseNavGraphParams) => {
  const { selectedPeriod, touchX, setTouchX, handlePeriodSelect } = useNavGraphContext();

  const filteredData = useMemo(
    () => getFilteredData(navData, selectedPeriod),
    [navData, selectedPeriod]
  );

  const returnPct = useMemo(() => getReturnPercentage(filteredData), [filteredData]);

  const { linePath, gradientPath, minNav, maxNav, points } = useMemo(() => {
    if (filteredData.length === 0) {
      return { linePath: '', gradientPath: '', minNav: 0, maxNav: 0, points: [] as { x: number; y: number }[] };
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
  }, [setTouchX]);

  const clearTouchX = useCallback(() => {
    setTouchX(null);
  }, [setTouchX]);

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

  return {
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
  };
};
