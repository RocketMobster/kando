import React from 'react';
import { 
  View, 
  StyleSheet, 
  ViewStyle, 
  useColorScheme,
  Pressable,
  PressableProps
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface CardProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  elevation?: number;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  contentStyle,
  elevation = 1,
  onPress,
  ...pressableProps
}) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  // Calculate shadow based on elevation
  const getShadowStyle = (): ViewStyle => {
    if (colorScheme === 'dark') {
      // Less pronounced shadows for dark mode
      return {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: elevation,
        },
        shadowOpacity: 0.1 + (elevation * 0.03),
        shadowRadius: elevation,
        elevation: elevation,
      };
    }
    
    return {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: elevation,
      },
      shadowOpacity: 0.1 + (elevation * 0.05),
      shadowRadius: elevation,
      elevation: elevation,
    };
  };

  const cardContent = (
    <View 
      style={[
        styles.card,
        { backgroundColor: colors.card },
        getShadowStyle(),
        style,
      ]}
    >
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );

  // If onPress is provided, wrap the card in a Pressable
  if (onPress) {
    return (
      <Pressable 
        onPress={onPress} 
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        {...pressableProps}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
});