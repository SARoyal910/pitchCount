import { StyleSheet } from 'react-native';

/**
 * Component-specific styles for buttons, cards, inputs, etc.
 */

export const componentStyles = StyleSheet.create({
  // Button styles
  buttonPrimary: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLarge: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Button text
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextSmall: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextLarge: {
    fontSize: 18,
    fontWeight: '700',
  },

  // Card styles
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardBordered: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardShadow: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Input styles
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  inputSmall: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },

  // Badge styles
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSmall: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Divider
  divider: {
    height: 1,
    marginVertical: 12,
  },
  dividerThick: {
    height: 2,
    marginVertical: 12,
  },

  // Separators
  spacerSmall: {
    height: 8,
  },
  spacerMedium: {
    height: 16,
  },
  spacerLarge: {
    height: 24,
  },
});
