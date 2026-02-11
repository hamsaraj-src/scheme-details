import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SchemeData } from '../data/schemeData';
import { formatDate, getLockInPeriodText } from '../utils/formatters';
import { Colors } from '../constants/colors';

interface FundDetailsProps {
  scheme: SchemeData;
}

interface DetailCardProps {
  icon: string;
  label: string;
  value: string;
  fullWidth?: boolean;
}

const DetailCard: React.FC<DetailCardProps> = ({ icon, label, value, fullWidth }) => (
  <View style={[styles.detailCard, fullWidth && styles.detailCardFull]}>
    <View style={styles.cardHeader}>
      <FontAwesome5 name={icon} size={16} color={Colors.headerGreen} />
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export const FundDetails: React.FC<FundDetailsProps> = ({ scheme }) => {
  const { t } = useTranslation();

  const contactAddress = [
    scheme.amc_address1,
    scheme.amc_address2,
    scheme.amc_address3,
    scheme.amc_address4,
    scheme.amc_address5,
  ].filter(Boolean).join(' ');

  return (
    <View>
      {/* Objective */}
      {scheme.scheme_objective && (
        <View style={styles.objectiveSection}>
          <Text style={styles.objectiveText}>
            <Text style={styles.objectiveBold}>{t('fundDetails.objective')} </Text>
            {scheme.scheme_objective}
          </Text>
        </View>
      )}

      {/* 2-column grid */}
      <View style={styles.grid}>
        <DetailCard
          icon="chart-pie"
          label={t('schemeDetails.expenseRatio')}
          value={scheme.expense_ratio ? `${scheme.expense_ratio}%` : t('schemeDetails.na')}
        />
        <DetailCard
          icon="clock"
          label={t('schemeDetails.aum')}
          value={scheme.aum_value ? `₹${scheme.aum_value}` : t('schemeDetails.na')}
        />
        <DetailCard
          icon="lock"
          label={t('schemeDetails.lockInPeriod')}
          value={getLockInPeriodText(scheme.lock_in_period)}
        />
        <DetailCard
          icon="th-large"
          label={t('schemeDetails.benchmark')}
          value={scheme.benchmark_index_name || t('schemeDetails.na')}
        />
        <DetailCard
          icon="sync-alt"
          label={t('schemeDetails.exitLoad')}
          value={scheme.exit_load || t('fundDetails.applicable')}
        />
        <DetailCard
          icon="calendar-alt"
          label={t('schemeDetails.launchDate')}
          value={formatDate(scheme.listing_date)}
        />
        <DetailCard
          icon="university"
          label={t('fundDetails.amc')}
          value={scheme.amc_name || t('schemeDetails.na')}
        />
        <DetailCard
          icon="folder-open"
          label={t('schemeDetails.rta')}
          value={scheme.rta || t('schemeDetails.na')}
        />
      </View>

      {/* Contact Details */}
      {contactAddress ? (
        <DetailCard
          icon="address-card"
          label={t('fundDetails.contactDetails')}
          value={contactAddress}
          fullWidth
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  objectiveSection: {
    marginBottom: 20,
  },
  objectiveBold: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  objectiveText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCard: {
    width: '48%',
    marginBottom: 20,
  },
  detailCardFull: {
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    paddingLeft: 22,
  },
});
