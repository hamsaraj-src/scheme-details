import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { formatDate } from '../utils/formatters';

interface SchemeHeaderProps {
  schemeName: string;
  amcName: string;
  amcImageUrl: string;
  categoryName: string;
  subCategoryName: string;
  planType: string;
  fundRating: string;
  navValue: number;
  navDate: string;
  perDayNav: string;
  perDayNavPercentage: string;
  aumValue: string;
  oneYearReturn: number;
  benchmarkIndex: string;
  schemeDescription: string;
}

export const SchemeHeader: React.FC<SchemeHeaderProps> = ({
  schemeName,
  amcName,
  amcImageUrl,
  categoryName,
  subCategoryName,
  planType,
  fundRating,
  navValue,
  navDate,
  perDayNav,
  perDayNavPercentage,
  aumValue,
  oneYearReturn,
  benchmarkIndex,
  schemeDescription,
}) => {
  const { t } = useTranslation();
  const [bookmarked, setBookmarked] = useState(false);

  const navChangeNum = parseFloat(perDayNav) || 0;
  const isPositive = navChangeNum >= 0;
  const ratingStars = parseInt(fundRating, 10) || 0;
  const formattedNavDate = formatDate(navDate);
  const safeNavValue = typeof navValue === 'number' ? navValue : 0;
  const safeOneYearReturn = typeof oneYearReturn === 'number' ? oneYearReturn : 0;

  return (
    <View style={styles.container}>
      {/* Tags row + bookmark */}
      <View style={styles.tagsBookmarkRow}>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{categoryName}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{subCategoryName}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{planType || t('schemeDetails.growth')}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookmarkButton} onPress={() => setBookmarked(!bookmarked)}>
          <FontAwesome5 name="bookmark" solid={bookmarked} size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* AMC Logo + Scheme Name + Resilient badge */}
      <View style={styles.schemeRow}>
        <Image
          source={{ uri: amcImageUrl }}
          style={styles.amcLogo}
          resizeMode="contain"
        />
        <View style={styles.schemeInfo}>
          <Text style={styles.schemeName} numberOfLines={2}>
            {schemeName}
          </Text>
          <LinearGradient
            colors={[Colors.resilientGradientStart, Colors.resilientGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.resilientBadge}
          >
            <Text style={styles.resilientIcon}>✦</Text>
            <Text style={styles.resilientText}>{t('schemeDetails.resilient')}</Text>
          </LinearGradient>
        </View>
      </View>

      {/* NAV + AUM row */}
      <View style={styles.infoRow}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>
            {t('schemeDetails.nav')} : {formattedNavDate}
          </Text>
          <View style={styles.navValueRow}>
            <Text style={styles.navValue}>₹{safeNavValue.toFixed(4)}</Text>
            <Text
              style={[
                styles.navChange,
                { color: isPositive ? Colors.positive : Colors.negative },
              ]}
            >
              {' '}▲ ₹{perDayNav} (+{perDayNavPercentage}%)
            </Text>
          </View>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.infoLabel}>{t('schemeDetails.aum')}</Text>
          <Text style={styles.infoValueBold}>₹{aumValue}</Text>
        </View>
      </View>

      {/* 1 Yr Return + Benchmark Index */}
      <View style={styles.infoRow}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>{t('schemeDetails.oneYrReturn')}</Text>
          <Text style={styles.infoValueBoldGreen}>
            {safeOneYearReturn.toFixed(2)}%
          </Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.infoLabel}>{t('schemeDetails.benchmarkIndex')}</Text>
          <Text style={styles.infoValueBold}>{benchmarkIndex || t('schemeDetails.na')}</Text>
        </View>
      </View>

      {/* 1 Yr Benchmark Return + Value Research Rating */}
      <View style={styles.infoRow}>
        <View style={styles.infoCol}>
          <Text style={styles.infoLabel}>{t('schemeDetails.oneYrBenchmarkReturn')}</Text>
          <Text style={styles.infoValueBoldGreen}>{safeOneYearReturn.toFixed(2)}%</Text>
        </View>
        <View style={styles.infoColRight}>
          <Text style={styles.infoLabel}>{t('schemeDetails.valueResearchRating')}</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text
                key={star}
                style={[
                  styles.starIcon,
                  { color: star <= ratingStars ? Colors.starFilled : Colors.starEmpty },
                ]}
              >
                ★
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Description */}
      {schemeDescription ? (
        <Text style={styles.description}>
          "{schemeDescription}"
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceGreenLight,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  tagsBookmarkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  tag: {
    borderWidth: 1,
    borderColor: Colors.tagBorder,
    // backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '500',
  },
  bookmarkButton: {
    padding: 4,
    marginLeft: 8,
  },
  schemeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  amcLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginRight: 12,
    marginTop: 2,
    backgroundColor: Colors.amcImageBorder,
  },
  schemeInfo: {
    flex: 1,
  },
  schemeName: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: 6,
  },
  resilientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  resilientIcon: {
    ...Typography.caption,
    color: Colors.white,
    marginRight: 4,
  },
  resilientText: {
    ...Typography.tinyBold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  infoCol: {
    flex: 1,
  },
  infoColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  navValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  navValue: {
    ...Typography.h1,
    color: Colors.text,
  },
  navChange: {
    ...Typography.captionMedium,
  },
  infoValueBold: {
    ...Typography.label,
    color: Colors.text,
  },
  infoValueBoldGreen: {
    ...Typography.h2,
    color: Colors.text,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  starIcon: {
    fontSize: Typography.h2.fontSize,
  },
  description: {
    ...Typography.body,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 22,
    marginTop: 2,
  },
});
