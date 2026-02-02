import { StyleSheet } from 'react-native';

/**
 * Global styles used across all screens and components
 * These can be combined with other styles using StyleSheet composition
 */

export const globalStyles = StyleSheet.create({
  // Containers
  screenContainer: {
    flex: 1,
    padding: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },

  // Spacing helpers
  gap8: {
    gap: 8,
  },
  gap12: {
    gap: 12,
  },
  gap16: {
    gap: 16,
  },
  gap20: {
    gap: 20,
  },
  gap24: {
    gap: 24,
  },

  // Padding helpers
  p8: {
    padding: 8,
  },
  p12: {
    padding: 12,
  },
  p16: {
    padding: 16,
  },
  p20: {
    padding: 20,
  },
  p24: {
    padding: 24,
  },

  // Margins
  m8: {
    margin: 8,
  },
  m12: {
    margin: 12,
  },
  m16: {
    margin: 16,
  },
  m24: {
    margin: 24,
  },
  mb8: {
    marginBottom: 8,
  },
  mb12: {
    marginBottom: 12,
  },
  mb16: {
    marginBottom: 16,
  },
  mb24: {
    marginBottom: 24,
  },
  mt8: {
    marginTop: 8,
  },
  mt12: {
    marginTop: 12,
  },
  mt16: {
    marginTop: 16,
  },
  mt24: {
    marginTop: 24,
  },

  // Borders
  borderRadius8: {
    borderRadius: 8,
  },
  borderRadius12: {
    borderRadius: 12,
  },
  borderRadius16: {
    borderRadius: 16,
  },
  borderRadius24: {
    borderRadius: 24,
  },
  border: {
    borderWidth: 1,
  },
  border2: {
    borderWidth: 2,
  },
});
