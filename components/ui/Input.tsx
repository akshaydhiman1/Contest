import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,

} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, roundness, spacing } from '../../theme/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  touched?: boolean;
}

/**
 * Input component that provides a consistent look for text inputs
 * across the application
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  iconSize = 20,
  touched = false,
  ...rest
}) => {
  const showError = !!error && touched;
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        showError && styles.inputError,
        rest.editable === false && styles.inputDisabled,
      ]}>
        {leftIcon && (
          <Icon 
            name={leftIcon} 
            size={iconSize} 
            color={showError ? colors.error : colors.grey600} 
            style={styles.leftIcon} 
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={colors.grey500}
          {...rest}
        />
        
        {rightIcon && (
          <Icon
            name={rightIcon}
            size={iconSize}
            color={showError ? colors.error : colors.grey600}
            style={[styles.rightIcon, onRightIconPress && styles.touchableIcon]}
            onPress={onRightIconPress}
          />
        )}
      </View>
      
      {showError && (
        <Text style={[styles.errorText, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.regular,
  },
  label: {
    fontSize: typography.fontSizeMedium,
    marginBottom: spacing.tiny,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: roundness.medium,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.inputPadding,
    paddingHorizontal: spacing.inputPadding,
    fontSize: typography.fontSizeRegular,
    color: colors.textPrimary,
    minHeight: 48,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    marginLeft: spacing.inputPadding,
    marginRight: spacing.tiny,
  },
  rightIcon: {
    marginRight: spacing.inputPadding,
    marginLeft: spacing.tiny,
  },
  touchableIcon: {
    padding: spacing.tiny,
  },
  errorText: {
    fontSize: typography.fontSizeSmall,
    color: colors.error,
    marginTop: spacing.tiny,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.grey100,
    borderColor: colors.grey300,
  },
});

export default Input;
