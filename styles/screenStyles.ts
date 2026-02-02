import { StyleSheet } from 'react-native';

/**
 * Specialized styles for specific screens and features
 */

export const screenStyles = StyleSheet.create({
  // Dashboard screen
  dashboardContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  dashboardTitle: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
  },
  dashboardSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 18,
  },

  // Live/Pitch counter screen
  counterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  counterTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  counterRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  counterBox: {
    alignItems: 'center',
    minWidth: 90,
  },
  counterLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  counterValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 20,
  },

  // Stats screen
  statsContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  statsTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  statsSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },

  // Loading states
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
