import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, roundness, spacing } from '../../theme/theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  outline?: boolean;
}

/**
 * Badge component for displaying status labels
 * with consistent styling across the application
 */
const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  outline = false,
}) => {
  return (
    <View 
      style={[
        styles.badge,
        styles[`${size}Badge`],
        outline ? styles[`${variant}OutlineBadge`] : styles[`${variant}Badge`],
        style
      ]}
    >
      <Text 
        style={[
          styles.label,
          styles[`${size}Label`],
          outline ? styles[`${variant}OutlineLabel`] : styles[`${variant}Label`],
          textStyle
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const getBadgeColors = (variant: BadgeVariant, outline: boolean) => {
  const variantColors = {
    primary: {
      background: colors.primary,
      text: colors.white,
    },
    success: {
      background: colors.success,
      text: colors.white,
    },
    warning: {
      background: colors.warning,
      text: colors.textPrimary,
    },
    error: {
      background: colors.error,
      text: colors.white,
    },
    info: {
      background: colors.info,
      text: colors.white,
    },
    neutral: {
      background: colors.grey200,
      text: colors.textPrimary,
    },
  };

  if (outline) {
    return {
      background: 'transparent',
      text: variantColors[variant].background,
      border: variantColors[variant].background,
    };
  }

  return {
    background: variantColors[variant].background,
    text: variantColors[variant].text,
    border: variantColors[variant].background,
  };
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: roundness.round,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
  },
  label: {
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  
  // Size variations
  smallBadge: {
    paddingVertical: spacing.tiny,
  },
  smallLabel: {
    fontSize: typography.fontSizeXSmall,
  },
  mediumBadge: {
    paddingVertical: spacing.small,
  },
  mediumLabel: {
    fontSize: typography.fontSizeSmall,
  },
  largeBadge: {
    paddingVertical: spacing.medium,
  },
  largeLabel: {
    fontSize: typography.fontSizeMedium,
  },
  
  // Variant styles - Filled
  primaryBadge: {
    backgroundColor: getBadgeColors('primary', false).background,
  },
  primaryLabel: {
    color: getBadgeColors('primary', false).text,
  },
  successBadge: {
    backgroundColor: getBadgeColors('success', false).background,
  },
  successLabel: {
    color: getBadgeColors('success', false).text,
  },
  warningBadge: {
    backgroundColor: getBadgeColors('warning', false).background,
  },
  warningLabel: {
    color: getBadgeColors('warning', false).text,
  },
  errorBadge: {
    backgroundColor: getBadgeColors('error', false).background,
  },
  errorLabel: {
    color: getBadgeColors('error', false).text,
  },
  infoBadge: {
    backgroundColor: getBadgeColors('info', false).background,
  },
  infoLabel: {
    color: getBadgeColors('info', false).text,
  },
  neutralBadge: {
    backgroundColor: getBadgeColors('neutral', false).background,
  },
  neutralLabel: {
    color: getBadgeColors('neutral', false).text,
  },
  
  // Variant styles - Outline
  primaryOutlineBadge: {
    backgroundColor: getBadgeColors('primary', true).background,
    borderWidth: 1,
    borderColor: getBadgeColors('primary', true).border,
  },
  primaryOutlineLabel: {
    color: getBadgeColors('primary', true).text,
  },
  successOutlineBadge: {
    backgroundColor: getBadgeColors('success', true).background,
    borderWidth: 1,
    borderColor: getBadgeColors('success', true).border,
  },
  successOutlineLabel: {
    color: getBadgeColors('success', true).text,
  },
  warningOutlineBadge: {
    backgroundColor: getBadgeColors('warning', true).background,
    borderWidth: 1,
    borderColor: getBadgeColors('warning', true).border,
  },
  warningOutlineLabel: {
    color: getBadgeColors('warning', true).text,
  },
  errorOutlineBadge: {
    backgroundColor: getBadgeColors('error', true).background,
    borderWidth: 1,
    borderColor: getBadgeColors('error', true).border,
  },
  errorOutlineLabel: {
    color: getBadgeColors('error', true).text,
  },
  infoOutlineBadge: {
    backgroundColor: getBadgeColors('info', true).background,
    borderWidth: 1,
    borderColor: getBadgeColors('info', true).border,
  },
  infoOutlineLabel: {
    color: getBadgeColors('info', true).text,
  },
  neutralOutlineBadge: {
    backgroundColor: getBadgeColors('neutral', true).background,
    borderWidth: 1,
    borderColor: getBadgeColors('neutral', true).border,
  },
  neutralOutlineLabel: {
    color: getBadgeColors('neutral', true).text,
  },
});

export default Badge;
