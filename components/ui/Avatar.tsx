import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { colors, typography } from '../../theme/theme';

type AvatarSize = 'small' | 'medium' | 'large' | number;

interface AvatarProps {
  size?: AvatarSize;
  source?: string | null;
  name?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Avatar component for displaying user profile pictures
 * or initials when no picture is available
 */
const Avatar: React.FC<AvatarProps> = ({
  size = 'medium',
  source,
  name = '',
  onPress,
  style,
  imageStyle,
  textStyle,
  backgroundColor = colors.primary,
  textColor = colors.white,
}) => {
  // Convert size to a number
  const sizeValue = typeof size === 'number' ? size : getSizeValue(size);
  
  // Generate initials from name
  const initials = getInitials(name);
  
  // Base container styles
  const containerStyle: ViewStyle = {
    width: sizeValue,
    height: sizeValue,
    borderRadius: sizeValue / 2,
    backgroundColor: source ? 'transparent' : backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };
  
  // Font size based on avatar size
  const fontSize = sizeValue * 0.4;
  
  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={{ uri: source }}
          style={[
            {
              width: sizeValue,
              height: sizeValue,
            },
            imageStyle,
          ]}
          resizeMode="cover"
        />
      );
    }
    
    return (
      <Text
        style={[
          {
            fontSize,
            color: textColor,
            fontWeight: '600',
          },
          textStyle,
        ]}
      >
        {initials}
      </Text>
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[containerStyle, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      {renderContent()}
    </View>
  );
};

// Helper functions
const getSizeValue = (size: string): number => {
  switch (size) {
    case 'small':
      return 32;
    case 'medium':
      return 48;
    case 'large':
      return 72;
    default:
      return 48;
  }
};

const getInitials = (name: string): string => {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  
  if (parts.length === 1) {
    return name.charAt(0).toUpperCase();
  }
  
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

export default Avatar;
