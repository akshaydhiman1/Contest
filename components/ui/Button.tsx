import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, roundness, spacing } from '../../theme/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: string;
  rightIcon?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconSize?: number;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  style,
  textStyle,
  iconSize,
  ...rest
}: ButtonProps) => {
  
  // Calculate styles based on variant and size
  const buttonStyle = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    disabled && styles.disabledButton,
    disabled && styles[`${variant}DisabledButton`],
    style,
  ];
  
  const titleStyle = [
    styles.title,
    styles[`${variant}Title`],
    styles[`${size}Title`],
    disabled && styles.disabledTitle,
    textStyle,
  ];
  
  const iconColor = getIconColor(variant, disabled);
  const iconDimension = getIconSize(size, iconSize);

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white} 
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && (
            <Icon 
              name={leftIcon} 
              size={iconDimension} 
              color={iconColor} 
              style={styles.leftIcon} 
            />
          )}
          
          <Text style={titleStyle}>{title}</Text>
          
          {rightIcon && (
            <Icon 
              name={rightIcon} 
              size={iconDimension} 
              color={iconColor} 
              style={styles.rightIcon} 
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Helper functions for determining styles
const getIconColor = (variant: string, disabled: boolean): string => {
  if (disabled) {
    return colors.grey400;
  }
  
  switch (variant) {
    case 'primary':
      return colors.white;
    case 'secondary':
      return colors.white;
    case 'outline':
      return colors.primary;
    case 'ghost':
      return colors.primary;
    default:
      return colors.white;
  }
};

const getIconSize = (size: string, customSize?: number): number => {
  if (customSize) return customSize;
  
  switch (size) {
    case 'small':
      return 16;
    case 'medium':
      return 18;
    case 'large':
      return 20;
    default:
      return 18;
  }
};

const styles = StyleSheet.create({
  button: {
    borderRadius: roundness.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600', // Using direct value instead of typography.fontWeightSemiBold
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: spacing.small,
  },
  rightIcon: {
    marginLeft: spacing.small,
  },
  
  // Variant styles
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  
  primaryTitle: {
    color: colors.white,
  },
  secondaryTitle: {
    color: colors.white,
  },
  outlineTitle: {
    color: colors.primary,
  },
  ghostTitle: {
    color: colors.primary,
  },
  
  // Size styles
  smallButton: {
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.regular,
    minWidth: 80,
  },
  mediumButton: {
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.regular,
    minWidth: 120,
  },
  largeButton: {
    paddingVertical: spacing.regular,
    paddingHorizontal: spacing.large,
    minWidth: 160,
  },
  
  smallTitle: {
    fontSize: typography.fontSizeSmall,
  },
  mediumTitle: {
    fontSize: typography.fontSizeMedium,
  },
  largeTitle: {
    fontSize: typography.fontSizeRegular,
  },
  
  // Disabled styles
  disabledButton: {
    opacity: 0.6,
  },
  primaryDisabledButton: {
    backgroundColor: colors.grey300,
  },
  secondaryDisabledButton: {
    backgroundColor: colors.grey300,
  },
  outlineDisabledButton: {
    borderColor: colors.grey300,
  },
  ghostDisabledButton: {},
  
  disabledTitle: {
    color: colors.grey600,
  },
});

export default Button;
