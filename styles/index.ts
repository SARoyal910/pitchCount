/**
 * Central export file for all styles
 * Import this file to access all available styles across the app
 */

export { colorCombos, createColorStyles } from './colorStyles';
export { componentStyles } from './componentStyles';
export { globalStyles } from './globalStyles';
export { screenStyles } from './screenStyles';
export { typography } from './typography';

/**
 * Usage examples:
 * 
 * // Import individual style modules
 * import { globalStyles, typography, componentStyles } from '@/styles';
 * 
 * // Or use destructuring for specific styles
 * import { globalStyles } from '@/styles';
 * import { buttonPrimary, card } from '@/styles/componentStyles';
 * 
 * // For color styles (theme-aware)
 * import { createColorStyles } from '@/styles';
 * const colorStyles = createColorStyles(colorScheme);
 * 
 * // Combine styles
 * <View style={[globalStyles.screenContainer, colorStyles.backgroundPrimary]}>
 *   <Text style={[typography.headingLarge, colorStyles.textPrimary]}>Title</Text>
 * </View>
 */
