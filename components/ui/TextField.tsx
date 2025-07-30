import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { IconSymbol } from './IconSymbol';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  helperStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  labelStyle,
  inputStyle,
  helperStyle,
  errorStyle,
  style,
  ...inputProps
}) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (inputProps.onFocus) {
      inputProps.onFocus(undefined as any);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputProps.onBlur) {
      inputProps.onBlur(undefined as any);
    }
  };

  // Determine border color based on state
  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.tint;
    return colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }, labelStyle]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: colorScheme === 'dark' ? colors.card : '#F9F9FB',
          },
          isFocused && styles.focused,
          style,
        ]}
      >
        {leftIcon && (
          <IconSymbol
            name={leftIcon as any}
            size={20}
            color={colors.icon}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={colors.secondaryText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...inputProps}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconContainer}
          >
            <IconSymbol
              name={rightIcon as any}
              size={20}
              color={colors.icon}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      {(helper || error) && (
        <Text
          style={[
            styles.helper,
            { color: error ? colors.error : colors.secondaryText },
            error ? errorStyle : helperStyle,
          ]}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  focused: {
    borderWidth: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    marginLeft: 12,
  },
  rightIconContainer: {
    padding: 8,
  },
  rightIcon: {
    marginRight: 4,
  },
  helper: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});