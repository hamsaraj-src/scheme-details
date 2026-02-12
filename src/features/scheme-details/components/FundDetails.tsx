import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SchemeData } from '../../../data/schemeData';
import { formatDate, getLockInPeriodText } from '../../../shared/utils/formatters';
import { Colors } from '../../../shared/constants/colors';
import { Typography } from '../../../shared/constants/typography';
import { DetailCard } from '../../../shared/components';

interface FundDetailsProps {
  scheme: SchemeData;
}

export const FundDetails: React.FC<FundDetailsProps> = memo(({ scheme }) => {
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
          value={scheme.expense_ratio ? t('common.percentValue', { value: scheme.expense_ratio }) : t('schemeDetails.na')}
        />
        <DetailCard
          icon="clock"
          label={t('schemeDetails.aum')}
          value={scheme.aum_value ? t('common.currencyValue', { value: scheme.aum_value }) : t('schemeDetails.na')}
        />
        <DetailCard
          icon="lock"
          label={t('schemeDetails.lockInPeriod')}
          value={getLockInPeriodText(scheme.lock_in_period, t)}
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
          value={formatDate(scheme.listing_date, t)}
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
});

const styles = StyleSheet.create({
  objectiveSection: {
    marginBottom: 20,
  },
  objectiveBold: {
    ...Typography.label,
    color: Colors.text,
  },
  objectiveText: {
    ...Typography.labelRegular,
    color: Colors.text,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
