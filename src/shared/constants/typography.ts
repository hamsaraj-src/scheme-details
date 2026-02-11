import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  // Headings
  h1: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    lineHeight: 28,
  },
  h1Medium: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
    lineHeight: 28,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    lineHeight: 24,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 22,
  },
  h3Bold: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    lineHeight: 22,
  },

  // Labels (15px)
  label: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    lineHeight: 20,
  },
  labelSemibold: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  labelRegular: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
    lineHeight: 20,
  },

  // Body (14px)
  body: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  bodyStrong: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    lineHeight: 20,
  },

  // Caption (12-13px)
  caption: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 16,
  },
  captionMedium: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 18,
  },
  captionRegular: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },

  // Small (10-11px)
  small: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
    lineHeight: 14,
  },
  smallBold: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    lineHeight: 14,
  },
  tiny: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Inter_400Regular',
    lineHeight: 14,
  },
  tinyBold: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    lineHeight: 14,
  },

  // Special
  button: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  navValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    lineHeight: 32,
  },
};
