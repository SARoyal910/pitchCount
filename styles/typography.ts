import { StyleSheet } from 'react-native';

/**
 * Typography styles for consistent text styling across the app
 */

export const typography = StyleSheet.create({
  // Display styles
  display: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
  },
  displayLarge: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 44,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  displaySmall: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },

  // Heading styles
  headingXL: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  headingLarge: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  headingMedium: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  headingSmall: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },

  // Title styles
  titleLarge: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  titleMedium: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  titleSmall: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },

  // Body styles
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
  },

  // Label styles
  labelLarge: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
  },

  // Utility text styles
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  center: {
    textAlign: 'center',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});
