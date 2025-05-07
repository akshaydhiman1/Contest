import React, { ReactNode } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  StyleProp, 
  ViewStyle
} from 'react-native';
import { colors, elevation, getCardStyle, roundness, spacing } from '../../theme/theme';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  elevationLevel?: number;
  borderRadius?: number;
  onPress?: () => void;
  padded?: boolean;
}

/**
 * Card component for displaying content in a card-like container
 * with consistent styling across the app
 */
const Card: React.FC<CardProps> = ({
  children,
  style,
  elevationLevel = elevation.small,
  borderRadius = roundness.medium,
  onPress,
  padded = true,
}) => {
  // Base card style with shadow and rounded corners
  const cardBaseStyle = [
    getCardStyle(elevationLevel, borderRadius),
    padded && styles.padded,
    style,
  ];
  
  // If onPress provided, wrap in TouchableOpacity, otherwise use View
  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardBaseStyle} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  return <View style={cardBaseStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  padded: {
    padding: spacing.cardPadding,
  },
});

export default Card;
