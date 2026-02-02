import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Custom hook to get theme-aware colors for the current color scheme
 * Use this in any component to automatically get the right colors
 * 
 * Example:
 * const { backgroundColor, textColor, borderColor } = useTheme();
 */
export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    colorScheme,
    isDark,
    backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
    backgroundSecondary: isDark ? Colors.dark.backgroundSecondary : Colors.light.backgroundSecondary,
    textColor: isDark ? Colors.dark.text : Colors.light.text,
    textSecondary: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary,
    borderColor: isDark ? Colors.dark.border : Colors.light.border,
    tintColor: isDark ? Colors.dark.tint : Colors.light.tint,
    icon: isDark ? Colors.dark.icon : Colors.light.icon,
    // All color values
    colors: isDark ? Colors.dark : Colors.light,
  };
};
