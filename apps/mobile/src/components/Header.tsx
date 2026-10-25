import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from './PrototypeArtwork';
import {
  PROTOTYPE_THEMES,
  ThemeMode,
} from '../constants/prototypeTheme';
import { FONT_STACK } from '../constants/uiTokens';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  isRegistered: boolean;
  memberEmail: string;
  unreadNotificationsCount: number;
  onPressMember?: () => void;
  onOpenDrawer?: () => void;
  onOpenInbox: () => void;
  onPressSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  isRegistered,
  memberEmail,
  unreadNotificationsCount,
  onOpenInbox,
  onPressSearch,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: isDark
            ? 'rgba(6, 20, 13, 0.78)'
            : 'rgba(255, 255, 255, 0.84)',
          borderBottomColor: isDark
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.06)',
        },
        Platform.OS === 'web' &&
          ({
            backdropFilter: 'blur(30px) saturate(210%)',
            WebkitBackdropFilter: 'blur(30px) saturate(210%)',
            boxShadow: isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.25), inset 0 -1px 0 rgba(255, 255, 255, 0.05)'
              : '0 2px 14px rgba(0, 0, 0, 0.04), inset 0 -1px 0 rgba(0, 0, 0, 0.04)',
          } as any),
      ]}
    >
      <View style={styles.topRow}>
        {/* Left: Official Brand Logo */}
        <View style={styles.brandWrap}>
          <BrandLogo theme={theme} />
        </View>

        {/* Right: Apple VisionOS / iOS 18 Liquid Glass Action Capsule */}
        <View
          style={[
            styles.liquidActionCapsule,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.07)'
                : 'rgba(0, 0, 0, 0.04)',
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.14)'
                : 'rgba(0, 0, 0, 0.08)',
            },
            Platform.OS === 'web' &&
              ({
                boxShadow: isDark
                  ? 'inset 0 1px 1px rgba(255, 255, 255, 0.15)'
                  : 'inset 0 1px 1.5px rgba(255, 255, 255, 0.8)',
              } as any),
          ]}
        >
          {/* Notification Bell */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenInbox}
            activeOpacity={0.7}
            accessibilityLabel="Open notification inbox"
          >
            <Ionicons
              name={unreadNotificationsCount > 0 ? 'notifications' : 'notifications-outline'}
              size={18}
              color={t.ink}
            />
            {unreadNotificationsCount > 0 && (
              <View
                style={[
                  styles.unreadBadge,
                  { borderColor: isDark ? '#06140D' : '#FFFFFF' },
                ]}
              >
                <Text style={styles.unreadBadgeText}>
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Vertical Glass Divider */}
          <View
            style={[
              styles.capsuleDivider,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
          />

          {/* Theme Mode Toggle (Moon / Sun) */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onToggleTheme}
            activeOpacity={0.7}
            accessibilityLabel="Switch light or dark mode"
          >
            <Ionicons
              name={theme === 'light' ? 'moon' : 'sunny'}
              size={17}
              color={theme === 'dark' ? '#FBBF24' : t.ink}
            />
          </TouchableOpacity>

          {/* Vertical Glass Divider */}
          <View
            style={[
              styles.capsuleDivider,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
          />

          {/* Search Icon */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onPressSearch}
            activeOpacity={0.7}
            accessibilityLabel="Search films and experiences"
          >
            <Ionicons name="search" size={17} color={t.ink} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 36 : 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    zIndex: 20,
  },
  topRow: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liquidActionCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  capsuleDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 1,
  },
  unreadBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
  },
  unreadBadgeText: {
    fontFamily: FONT_STACK,
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
});
