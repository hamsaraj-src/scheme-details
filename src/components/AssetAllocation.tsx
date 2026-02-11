import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface AssetItem {
  asset_name: string;
  asset_percentage: number;
}

interface AssetAllocationProps {
  assets: AssetItem[];
}

const ASSET_COLORS: Record<string, string> = {
  Equity: '#4CAF50',
  Debt: '#2196F3',
  Cash: '#FF9800',
  Gold: '#FFC107',
  Other: '#9E9E9E',
};

export const AssetAllocation: React.FC<AssetAllocationProps> = ({ assets }) => {
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.barContainer}>
        {assets.map((asset) => (
          <View
            key={asset.asset_name}
            style={[
              styles.barSegment,
              {
                flex: asset.asset_percentage,
                backgroundColor: ASSET_COLORS[asset.asset_name] || ASSET_COLORS.Other,
              },
            ]}
          />
        ))}
      </View>

      {assets.map((asset) => (
        <View key={asset.asset_name} style={styles.row}>
          <View style={styles.labelRow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: ASSET_COLORS[asset.asset_name] || ASSET_COLORS.Other },
              ]}
            />
            <Text style={styles.assetName}>{asset.asset_name}</Text>
          </View>
          <Text style={styles.percentage}>{asset.asset_percentage.toFixed(2)}%</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  barSegment: {
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  assetName: {
    ...Typography.body,
    color: Colors.text,
  },
  percentage: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
});
