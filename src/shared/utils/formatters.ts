type TFunction = (key: string, opts?: Record<string, unknown>) => string;

export const formatCurrency = (value: number, t: TFunction): string => {
  if (value >= 10000000) {
    return `${t('common.currencyValue', { value: (value / 10000000).toFixed(2) })} ${t('common.crores')}`;
  }
  if (value >= 100000) {
    return `${t('common.currencyValue', { value: (value / 100000).toFixed(2) })} ${t('common.lakhs')}`;
  }
  return t('common.currencyValue', { value: value.toLocaleString('en-IN') });
};

export const formatDate = (dateStr: string, t?: TFunction): string => {
  if (!dateStr) return t ? t('common.na') : 'N/A';
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-IN', options);
};

export const formatPercentage = (value: number | string | undefined, t: TFunction): string => {
  if (value === undefined || value === null || value === '') return t('common.na');
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return t('common.na');
  return num >= 0
    ? t('common.positivePercent', { value: num.toFixed(2) })
    : t('common.negativePercent', { value: num.toFixed(2) });
};

export const formatNumber = (value: number | string | undefined, t?: TFunction): string => {
  if (value === undefined || value === null || value === '') return t ? t('common.na') : 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return t ? t('common.na') : 'N/A';
  return num.toFixed(2);
};

export const getLockInPeriodText = (days: string | undefined, t: TFunction): string => {
  if (!days) return t('common.none');
  const numDays = parseInt(days, 10);
  if (isNaN(numDays)) return days;
  const years = Math.floor(numDays / 365);
  const remainingDays = numDays % 365;
  if (years > 0 && remainingDays === 0) {
    return `${years} ${years > 1 ? t('common.yearsPlural') : t('common.years')}`;
  }
  if (years > 0) return `${years}${t('common.yearShort')} ${remainingDays}${t('common.dayShort')}`;
  return `${numDays} ${t('common.days')}`;
};
