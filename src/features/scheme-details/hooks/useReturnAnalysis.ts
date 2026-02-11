import { useMemo } from 'react';
import { useReturnAnalysisContext } from '../context/ReturnAnalysisContext';

export const CHART_HEIGHT = 220;
export const Y_LABEL_WIDTH = 36;

interface ReturnItem {
  month: string;
  percentage: string | number;
}

interface ParsedBar {
  label: string;
  value: number;
}

interface UseReturnAnalysisParams {
  sipReturns: ReturnItem[];
  lumpsumReturns: ReturnItem[];
}

export const useReturnAnalysis = ({
  sipReturns,
  lumpsumReturns,
}: UseReturnAnalysisParams) => {
  const { activeTab, setActiveTab } = useReturnAnalysisContext();

  const data = activeTab === 'ptp' ? lumpsumReturns : sipReturns;

  const parsed: ParsedBar[] = useMemo(() =>
    data.map((item) => ({
      label: item.month === 'MAX' ? 'Max' : item.month,
      value: typeof item.percentage === 'string' ? parseFloat(item.percentage) : item.percentage,
    })),
    [data]
  );

  const { yLabels, maxY, minY } = useMemo(() => {
    const values = parsed.map((d) => d.value);
    const rawMax = Math.max(...values);
    const rawMin = Math.min(...values, 0);
    const range = rawMax - rawMin;
    const step = range > 20 ? 4 : 2;
    const ceilMax = Math.ceil(rawMax / step) * step + step;
    const floorMin = Math.max(Math.floor(rawMin / step) * step, 0);
    const labels: number[] = [];
    for (let v = ceilMax; v >= floorMin; v -= step) {
      labels.push(v);
    }
    return { yLabels: labels, maxY: ceilMax, minY: floorMin };
  }, [parsed]);

  const getBarHeight = (value: number): number => {
    const range = maxY - minY;
    if (range === 0) return 0;
    return ((value - minY) / range) * CHART_HEIGHT;
  };

  return {
    activeTab,
    setActiveTab,
    parsed,
    yLabels,
    maxY,
    minY,
    getBarHeight,
  };
};
