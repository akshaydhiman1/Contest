import { Platform } from 'react-native';

// App theme constants to maintain consistent UI across the application

export const colors = {
  // Primary palette
  primary: '#4CAF50',  // Green
  primaryLight: '#80E27E',
  primaryDark: '#087f23',
  
  // Secondary palette
  secondary: '#2196F3',  // Blue
  secondaryLight: '#6EC6FF',
  secondaryDark: '#0069C0',
  
  // Accent colors
  accent: '#FF9800',  // Orange
  accentLight: '#FFC947',
  accentDark: '#C66900',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  
  // Grayscale
  white: '#FFFFFF',
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey200: '#EEEEEE',
  grey300: '#E0E0E0',
  grey400: '#BDBDBD',
  grey500: '#9E9E9E',
  grey600: '#757575',
  grey700: '#616161',
  grey800: '#424242',
  grey900: '#212121',
  black: '#000000',
  
  // UI specific
  background: '#F9F9F9',
  cardBackground: '#FFFFFF',
  divider: '#E0E0E0',
  textPrimary: '#212121',
  textSecondary: '#757575',
  textHint: '#9E9E9E',
  textDisabled: '#BDBDBD',
  textLink: '#1976D2',
  
  // Tab bar
  tabActive: '#4CAF50',
  tabInactive: '#757575',
  
  // Transparent colors for overlays
  transparentBlack20: 'rgba(0, 0, 0, 0.2)',
  transparentBlack50: 'rgba(0, 0, 0, 0.5)',
  transparentWhite20: 'rgba(255, 255, 255, 0.2)',
  transparentWhite50: 'rgba(255, 255, 255, 0.5)',
};

export const typography = {
  // Font sizes
  fontSizeXSmall: 10,
  fontSizeSmall: 12,
  fontSizeMedium: 14,
  fontSizeRegular: 16,
  fontSizeLarge: 18,
  fontSizeXLarge: 20,
  fontSizeXXLarge: 24,
  fontSizeXXXLarge: 30,
  
  // Font weights
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
};

export const spacing = {
  // Padding and margin
  tiny: 4,
  small: 8,
  medium: 12,
  regular: 16,
  large: 24,
  xLarge: 32,
  xxLarge: 48,
  
  // Common spacing
  screenPadding: 16,
  cardPadding: 16,
  listItemPadding: 16,
  inputPadding: 12,
  iconPadding: 8,
  buttonPadding: 12,
};

export const roundness = {
  // Border radius
  none: 0,
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  round: 1000,  // Used for round buttons or avatars
};

export const elevation = {
  // Shadow depths for iOS and elevation for Android
  none: 0,
  tiny: 1,
  small: 2,
  medium: 3,
  large: 4,
  xlarge: 6,
};

export const buttonSizes = {
  small: {
    height: 32,
    paddingHorizontal: spacing.regular,
    fontSize: typography.fontSizeSmall,
  },
  medium: {
    height: 40,
    paddingHorizontal: spacing.regular,
    fontSize: typography.fontSizeMedium,
  },
  large: {
    height: 48,
    paddingHorizontal: spacing.large,
    fontSize: typography.fontSizeRegular,
  },
};

// Common styling helper functions
export const getShadow = (level = elevation.small) => {
  return Platform.select({
    ios: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: level },
      shadowOpacity: 0.1,
      shadowRadius: level * 2,
    },
    android: {
      elevation: level,
    },
    default: {},
  });
};

export const getCardStyle = (elevationLevel = elevation.small, borderRadius = roundness.medium) => {
  return {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius,
    ...getShadow(elevationLevel),
  };
};

// Usage: `import { colors, typography, spacing, roundness, elevation, buttonSizes, getShadow, getCardStyle } from '../theme/theme';`

export default {
  colors,
  typography,
  spacing,
  roundness,
  elevation,
  buttonSizes,
  getShadow,
  getCardStyle,
};
