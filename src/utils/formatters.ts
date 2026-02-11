export const formatCurrency = (value: number): string => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-IN', options);
};

export const formatPercentage = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'N/A';
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};

export const formatNumber = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'N/A';
  return num.toFixed(2);
};

export const getLockInPeriodText = (days: string | undefined): string => {
  if (!days) return 'None';
  const numDays = parseInt(days, 10);
  if (isNaN(numDays)) return days;
  const years = Math.floor(numDays / 365);
  const remainingDays = numDays % 365;
  if (years > 0 && remainingDays === 0) return `${years} Year${years > 1 ? 's' : ''}`;
  if (years > 0) return `${years}Y ${remainingDays}D`;
  return `${numDays} Days`;
};
