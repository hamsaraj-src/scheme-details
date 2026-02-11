import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSchemeData } from '../hooks/useSchemeData';
import { Colors } from '../constants/colors';


import { SchemeHeader } from '../components/SchemeHeader';
import { Accordion } from '../components/Accordion';
import { NavGraph } from '../components/NavGraph';
import { FundDetails } from '../components/FundDetails';
import { ReturnAnalysis } from '../components/ReturnAnalysis';
import { ReturnCalculator } from '../components/ReturnCalculator';
import { Riskometer } from '../components/Riskometer';
import { SectorAllocation } from '../components/SectorAllocation';
import { Holdings } from '../components/Holdings';
import { FundManagers } from '../components/FundManagers';
import { AnalyticsData } from '../components/AnalyticsData';
import { FontAwesome5 } from '@expo/vector-icons';

export const SchemeDetailsScreen: React.FC = () => {
  const { t } = useTranslation();
  const scheme = useSchemeData();

  if (!scheme) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.headerGreen} />

      {/* AppBar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton}>
          <FontAwesome5 name="chevron-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {t('schemeDetails.title')}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <FontAwesome5 name="search" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton}>
            <View style={styles.cartCircle}>
              <FontAwesome5 name="shopping-cart" size={14} color={Colors.headerGreen} />
            </View>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bodyWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Green semicircle behind the card — scrolls with content */}
          <View style={styles.greenSemicircle} />

          {/* Scheme Header Card */}
          <SchemeHeader
            schemeName={scheme.scheme_name}
            amcName={scheme.amc_name}
            amcImageUrl={scheme.amc_image_icons}
            categoryName={scheme.category_name}
            subCategoryName={scheme.sub_category_name}
            planType={scheme.plan_type}
            fundRating={scheme.fund_rating}
            navValue={scheme.latest_nav}
            navDate={scheme.latest_nav_date}
            perDayNav={scheme.per_day_nav}
            perDayNavPercentage={scheme.per_day_nav_percentage}
            aumValue={scheme.aum_value}
            oneYearReturn={scheme.one_year_return}
            benchmarkIndex={scheme.benchmark_index_name}
            schemeDescription={scheme.scheme_description_ai}
          />

          {/* NAV Graph Section — standalone card, not accordion */}
          <NavGraph
            navData={scheme.nav_json}
            latestNav={scheme.latest_nav}
            latestNavDate={scheme.latest_nav_date}
            perDayNav={scheme.per_day_nav}
            perDayNavPercentage={scheme.per_day_nav_percentage}
            minInvestment={scheme.min_investment}
            minSipAmount={scheme.min_sip_amount}
          />

          {/* Return Analysis Section */}
          <Accordion title={t('sections.returnAnalysis')}>
            <ReturnAnalysis
              sipReturns={scheme.sip_returns}
              lumpsumReturns={scheme.lumpsum_return}
            />
          </Accordion>

          {/* Return Calculator Section */}
          <Accordion title={t('sections.returnCalculator')}>
            <ReturnCalculator
              oneYearReturn={scheme.one_year_return}
              threeYearReturn={scheme.three_year_return}
              fiveYearReturn={scheme.five_year_return}
              threeMonthReturn={scheme.three_month}
              sixMonthReturn={scheme.six_month}
              minInvestment={scheme.min_investment}
              minSipAmount={scheme.min_sip_amount}
            />
          </Accordion>

          {/* Riskometer Section */}
          <Accordion title={t('sections.riskometer')}>
            <Riskometer riskLevel={scheme.riskometer_value} />
          </Accordion>

          {/* Allocation Analysis Section */}
          {scheme.mf_sector_details && scheme.mf_sector_details.length > 0 && (
            <Accordion title={t('sections.allocationAnalysis')}>
              <SectorAllocation
                sectors={scheme.mf_sector_details}
                assets={scheme.holding_asset_allocation}
              />
            </Accordion>
          )}

          {/* Holdings Section */}
          {scheme.holdings_data && scheme.holdings_data.length > 0 && (
            <Accordion title={t('sections.holdings')}>
              <Holdings holdings={scheme.holdings_data} />
            </Accordion>
          )}

          {/* Fund Managers Section */}
          {scheme.fund_managers && scheme.fund_managers.length > 0 && (
            <Accordion title={t('sections.fundManagers')}>
              <FundManagers managers={scheme.fund_managers} />
            </Accordion>
          )}

          {/* Scheme Info Section */}
          <Accordion title={t('sections.fundDetails')}>
            <FundDetails scheme={scheme} />
          </Accordion>

          {/* Analytics Data Section */}
          {scheme.analytics_data && (
            <Accordion title={t('sections.analyticsData')}>
              <AnalyticsData analytics={scheme.analytics_data} />
            </Accordion>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>

    </SafeAreaView>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.headerGreen,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.headerGreen,
  },
  backButton: {
    width: 70,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: 'row',
    width: 70,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerIconBtn: {
    padding: 6,
  },
  cartButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.headerGreenLight,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bodyWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  greenSemicircle: {
    position: 'absolute',
    top: -SCREEN_WIDTH * 0.95,
    left: -(SCREEN_WIDTH * 1.6 - SCREEN_WIDTH) / 2,
    width: SCREEN_WIDTH * 1.6,
    height: SCREEN_WIDTH * 1.6,
    borderRadius: SCREEN_WIDTH * 0.8,
    backgroundColor: Colors.headerGreen,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  bottomSpacer: {
    height: 16,
  },
});
