import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

/**
 * Theme-aware color styles for light and dark modes
 */

export const createColorStyles = (colorScheme: 'light' | 'dark') => {
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;
  const borderColor = isDark ? '#333' : '#e0e0e0';
  const tintColor = isDark ? Colors.dark.tint : Colors.light.tint;

  return StyleSheet.create({
    // Background colors
    backgroundPrimary: {
      backgroundColor,
    },
    backgroundSecondary: {
      backgroundColor: isDark ? '#1e1f20' : '#f5f5f5',
    },
    backgroundTertiary: {
      backgroundColor: isDark ? '#262728' : '#eeeeee',
    },

    // Text colors
    textPrimary: {
      color: textColor,
    },
    textSecondary: {
      color: isDark ? '#9BA1A6' : '#687076',
    },
    textTertiary: {
      color: isDark ? '#6e7578' : '#999999',
    },
    textInverse: {
      color: isDark ? Colors.light.text : Colors.dark.text,
    },

    // Border colors
    borderPrimary: {
      borderColor,
    },
    borderSecondary: {
      borderColor: isDark ? '#444' : '#d0d0d0',
    },

    // Tint/Accent colors
    tint: {
      color: tintColor,
    },
    backgroundTint: {
      backgroundColor: tintColor,
    },

    // Status colors
    success: {
      color: '#4CAF50',
    },
    error: {
      color: '#F44336',
    },
    warning: {
      color: '#FF9800',
    },
    info: {
      color: '#2196F3',
    },
    backgroundSuccess: {
      backgroundColor: isDark ? '#1b5e20' : '#c8e6c9',
    },
    backgroundError: {
      backgroundColor: isDark ? '#b71c1c' : '#ffcdd2',
    },
    backgroundWarning: {
      backgroundColor: isDark ? '#e65100' : '#ffe0b2',
    },
    backgroundInfo: {
      backgroundColor: isDark ? '#01579b' : '#bbdefb',
    },
  });
};

/**
 * Preset color combinations for common UI patterns
 */
export const colorCombos = {
  primaryButton: (colorScheme: 'light' | 'dark') => {
    const isDark = colorScheme === 'dark';
    return {
      backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
      borderColor: isDark ? Colors.dark.tint : Colors.light.tint,
    };
  },
  secondaryButton: (colorScheme: 'light' | 'dark') => {
    const isDark = colorScheme === 'dark';
    return {
      backgroundColor: 'transparent',
      borderColor: isDark ? '#444' : '#d0d0d0',
    };
  },
  card: (colorScheme: 'light' | 'dark') => {
    const isDark = colorScheme === 'dark';
    return {
      backgroundColor: isDark ? '#1e1f20' : '#ffffff',
      borderColor: isDark ? '#333' : '#e0e0e0',
    };
  },
};
