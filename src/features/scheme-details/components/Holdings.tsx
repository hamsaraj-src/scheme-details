import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../../shared/constants/colors';
import { Typography } from '../../../shared/constants/typography';

interface HoldingItem {
  Company_names: string;
  holdings_percentages: number;
  holding_value: number;
  instrument_description: string;
}

interface HoldingsProps {
  holdings: HoldingItem[];
}

const INITIAL_COUNT = 6;

export const Holdings: React.FC<HoldingsProps> = ({ holdings }) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const sortedHoldings = [...holdings]
    .filter((h) => h.holdings_percentages > 0)
    .sort((a, b) => b.holdings_percentages - a.holdings_percentages);

  const displayedHoldings = showAll
    ? sortedHoldings
    : sortedHoldings.slice(0, INITIAL_COUNT);

  const formatValueMn = (value: number) => {
    const mn = value / 1000000;
    return `₹${Math.round(mn)}`;
  };

  return (
    <View>
      {/* Table header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, styles.nameCol]}>
          {t('holdings.securityName')}
        </Text>
        <Text style={[styles.headerText, styles.valueCol]}>
          {t('holdings.valueMn')}
        </Text>
        <Text style={[styles.headerText, styles.pctCol]}>
          {t('holdings.holdingPct')}
        </Text>
      </View>

      {/* Rows */}
      {displayedHoldings.map((holding, index) => (
        <View
          key={`${holding.Company_names}-${index}`}
          style={[styles.row, index % 2 !== 0 && styles.evenRow]}
        >
          <Text style={[styles.cellText, styles.nameCol]} numberOfLines={1}>
            {holding.Company_names}
          </Text>
          <Text style={[styles.cellValue, styles.valueCol]}>
            {formatValueMn(holding.holding_value)}
          </Text>
          <Text style={[styles.cellValue, styles.pctCol]}>
            {holding.holdings_percentages.toFixed(1)}
          </Text>
        </View>
      ))}

      {/* View all / View less */}
      {sortedHoldings.length > INITIAL_COUNT && (
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => setShowAll(!showAll)}
        >
          <Text style={styles.viewAllText}>
            {showAll ? t('holdings.viewLess') : t('holdings.viewAll')}
          </Text>
          <FontAwesome5
            name={showAll ? 'chevron-up' : 'chevron-down'}
            size={10}
            color={Colors.headerGreen}
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerText: {
    ...Typography.captionRegular,
    color: Colors.textSecondary,
  },
  nameCol: {
    flex: 1,
  },
  valueCol: {
    width: 80,
    textAlign: 'center',
  },
  pctCol: {
    width: 70,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  evenRow: {
    backgroundColor: Colors.surfaceMuted,
  },
  cellText: {
    ...Typography.labelSemibold,
    color: Colors.text,
  },
  cellValue: {
    ...Typography.labelSemibold,
    color: Colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  viewAllText: {
    ...Typography.bodyBold,
    color: Colors.headerGreen,
  },
});
