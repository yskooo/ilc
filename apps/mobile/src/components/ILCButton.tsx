import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PROTOTYPE_THEMES, ThemeMode } from '../constants/prototypeTheme';
import { RADII, TYPO } from '../constants/uiTokens';

export interface ILCButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  theme?: ThemeMode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  badge?: string;
}

export const ILCButton: React.FC<ILCButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  theme = 'light',
  style,
  textStyle,
  badge,
}) => {
  const t = PROTOTYPE_THEMES[theme];

  // Resolve Variant Colors
  let bg: string = t.btnBg;
  let fg: string = t.btnText;
  let border: string = 'transparent';

  if (variant === 'primary') {
    // Grab-inspired vibrant emerald / palm green
    bg = '#0B6A2E';
    fg = '#FFFFFF';
  } else if (variant === 'secondary') {
    bg = theme === 'dark' ? 'rgba(255,255,255,0.12)' : '#EAF2E6';
    fg = theme === 'dark' ? '#FFFFFF' : '#0B6A2E';
  } else if (variant === 'outline') {
    bg = 'transparent';
    border = theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(11, 106, 46, 0.35)';
    fg = theme === 'dark' ? '#FFFFFF' : '#0B6A2E';
  } else if (variant === 'ghost') {
    bg = 'transparent';
    fg = t.ink;
  } else if (variant === 'accent') {
    bg = '#C9DC3F'; // ILC Lime / SunGold
    fg = '#06240F';
  }

  // Resolve Sizes
  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 14, minHeight: 34, fontSize: 13 },
    md: { paddingVertical: 12, paddingHorizontal: 18, minHeight: 46, fontSize: 14.5 },
    lg: { paddingVertical: 16, paddingHorizontal: 24, minHeight: 54, fontSize: 16 },
  }[size];

  const iconSize = size === 'sm' ? 14 : size === 'md' ? 17 : 20;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonBase,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: border !== 'transparent' ? 1.5 : 0,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          minHeight: sizeStyles.minHeight,
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Feather
              name={icon}
              size={iconSize}
              color={fg}
              style={{ marginRight: 8 }}
            />
          )}

          <Text
            style={[
              TYPO.bodyBold,
              {
                color: fg,
                fontSize: sizeStyles.fontSize,
                textAlign: 'center',
              },
              textStyle,
            ]}
          >
            {label}
          </Text>

          {badge && (
            <View
              style={[
                styles.badgePill,
                {
                  backgroundColor:
                    variant === 'primary' ? 'rgba(255,255,255,0.22)' : '#0B6A2E',
                },
              ]}
            >
              <Text
                style={[
                  TYPO.micro,
                  { color: variant === 'primary' ? '#FFFFFF' : '#FFFFFF' },
                ]}
              >
                {badge}
              </Text>
            </View>
          )}

          {icon && iconPosition === 'right' && (
            <Feather
              name={icon}
              size={iconSize}
              color={fg}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: RADII.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: RADII.pill,
    marginLeft: 8,
  },
});
