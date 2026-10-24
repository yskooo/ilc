import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import {
  PROTOTYPE_THEMES,
  ThemeMode,
  SERIF_FONT,
  SANS_FONT,
} from '../constants/prototypeTheme';
import { FONT_STACK } from '../constants/uiTokens';

export const H1: React.FC<{
  theme: ThemeMode;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}> = ({ theme, children, style }) => {
  const t = PROTOTYPE_THEMES[theme];
  return (
    <Text
      style={[
        styles.h1,
        { color: t.ink, fontFamily: SERIF_FONT },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const H2: React.FC<{
  theme: ThemeMode;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}> = ({ theme, children, style }) => {
  const t = PROTOTYPE_THEMES[theme];
  return (
    <Text
      style={[
        styles.h2,
        { color: t.ink, fontFamily: SERIF_FONT },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const H3: React.FC<{
  theme: ThemeMode;
  children: React.ReactNode;
  serif?: boolean;
  style?: StyleProp<TextStyle>;
}> = ({ theme, children, serif = false, style }) => {
  const t = PROTOTYPE_THEMES[theme];
  return (
    <Text
      style={[
        styles.h3,
        {
          color: t.ink,
          fontFamily: serif ? SERIF_FONT : SANS_FONT,
          fontWeight: serif ? '500' : '700',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const MuteText: React.FC<{
  theme: ThemeMode;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}> = ({ theme, children, style }) => {
  const t = PROTOTYPE_THEMES[theme];
  return (
    <Text style={[styles.mute, { color: t.mute }, style]}>
      {children}
    </Text>
  );
};

export const FieldLabel: React.FC<{
  theme: ThemeMode;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  const t = PROTOTYPE_THEMES[theme];
  return <Text style={[styles.label, { color: t.mute }]}>{children}</Text>;
};

export const ProtoButton: React.FC<{
  theme: ThemeMode;
  label: string;
  onPress: () => void;
  alt?: boolean;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ theme, label, onPress, alt = false, full = false, style }) => {
  const t = PROTOTYPE_THEMES[theme];

  if (alt) {
    return (
      <TouchableOpacity
        style={[
          styles.btnAlt,
          { borderColor: t.btnAltBorder },
          full && styles.btnFull,
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.btnAltText, { color: t.btnAltColor }]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: t.btnBg },
        Platform.OS === 'web' &&
          ({
            backgroundImage: t.btnGradient,
            boxShadow: `0 6px 18px ${t.btnShadow}`,
          } as any),
        full && styles.btnFull,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.btnText, { color: t.btnText }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export const ProtoChip: React.FC<{
  theme: ThemeMode;
  label: string;
  active?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ theme, label, active = false, onPress, style }) => {
  const t = PROTOTYPE_THEMES[theme];
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          borderColor: active ? t.chipOnBg : t.line,
          backgroundColor: active ? t.chipOnBg : 'transparent',
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.chipText,
          {
            color: active ? t.chipOnText : t.mute,
            fontWeight: active ? '600' : '400',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const PromoBox: React.FC<{
  theme: ThemeMode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ theme, children, style }) => {
  const t = PROTOTYPE_THEMES[theme];
  return (
    <View
      style={[
        styles.promo,
        {
          borderColor: t.promoBorder,
          backgroundColor: t.promoBg,
        },
        Platform.OS === 'web' && ({ backgroundImage: t.promoGradient } as any),
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const ProtoInput: React.FC<{
  theme: ThemeMode;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address';
}> = ({
  theme,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
}) => {
  const t = PROTOTYPE_THEMES[theme];
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={t.mute}
      multiline={multiline}
      numberOfLines={numberOfLines}
      keyboardType={keyboardType}
      style={[
        styles.input,
        {
          backgroundColor: t.inputBg,
          borderColor: t.inputBorder,
          color: t.ink,
        },
        multiline && { minHeight: 78, textAlignVertical: 'top' },
      ]}
    />
  );
};

export const ProtoSelect: React.FC<{
  theme: ThemeMode;
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}> = ({ theme, options, value, onChange }) => {
  const t = PROTOTYPE_THEMES[theme];
  const [open, setOpen] = useState(false);

  if (Platform.OS === 'web') {
    return React.createElement(
      'select',
      {
        value,
        onChange: (e: any) => onChange(e.target.value),
        style: {
          width: '100%',
          padding: '12px 14px',
          border: `1px solid ${t.inputBorder}`,
          borderRadius: 14,
          backgroundColor: t.inputBg,
          color: t.ink,
          fontSize: 15,
          fontFamily: SANS_FONT,
          marginTop: 4,
          marginBottom: 10,
          outline: 'none',
          cursor: 'pointer',
        },
      },
      options.map((o) =>
        React.createElement(
          'option',
          {
            key: o.value,
            value: o.value,
            style: {
              backgroundColor: theme === 'dark' ? '#061A0E' : '#FFFFFF',
              color: t.ink,
            },
          },
          o.label
        )
      )
    );
  }

  // Native fallback selector for iOS / Android
  const currentLabel = options.find((o) => o.value === value)?.label || value;
  return (
    <View style={{ marginTop: 4, marginBottom: 10 }}>
      <TouchableOpacity
        style={[
          styles.selectNativeBtn,
          { backgroundColor: t.inputBg, borderColor: t.inputBorder },
        ]}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Text style={{ color: t.ink, fontSize: 15 }}>{currentLabel}</Text>
        <Text style={{ color: t.mute, fontSize: 12 }}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && (
        <View
          style={[
            styles.selectNativeDropdown,
            { backgroundColor: t.surf, borderColor: t.inputBorder },
          ]}
        >
          {options.map((o) => (
            <TouchableOpacity
              key={o.value}
              style={[
                styles.selectNativeOption,
                { borderBottomColor: t.line },
              ]}
              onPress={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              <Text
                style={{
                  color: o.value === value ? t.brand : t.ink,
                  fontWeight: o.value === value ? '700' : '400',
                  fontSize: 14,
                }}
              >
                {o.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    letterSpacing: -0.6,
    lineHeight: 34,
    fontWeight: '700',
    margin: 0,
  },
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 24,
    marginBottom: 10,
  },
  h3: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    margin: 0,
  },
  mute: {
    fontFamily: FONT_STACK,
    fontSize: 13.5,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  label: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  btn: {
    borderRadius: 99,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFull: {
    width: '100%',
  },
  btnText: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  btnAlt: {
    borderRadius: 99,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAltText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  chip: {
    borderRadius: 99,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  promo: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginVertical: 14,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 14,
    fontSize: 15,
    marginTop: 4,
    marginBottom: 10,
  },
  selectNativeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 14,
  },
  selectNativeDropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  selectNativeOption: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
});

