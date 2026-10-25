import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BrandLogo } from './PrototypeArtwork';
import {
  PROTOTYPE_THEMES,
  ThemeMode,
} from '../constants/prototypeTheme';
import { RADII, TYPO } from '../constants/uiTokens';

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
  onPressMember,
  onOpenInbox,
  onPressSearch,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';
  const initial = (memberEmail ? memberEmail[0] : 'J').toUpperCase();

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: isDark ? 'rgba(4, 21, 11, 0.92)' : 'rgba(255, 255, 255, 0.94)',
          borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        },
        Platform.OS === 'web' &&
          ({
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          } as any),
      ]}
    >
      <View style={styles.topRow}>
        {/* Left: Official Brand Logo (Clean & Spacious) */}
        <View style={styles.brandWrap}>
          <BrandLogo theme={theme} />
        </View>

        {/* Right: Apple-standard Action Icons */}
        <View style={styles.actionsRow}>
          {/* Notification Bell */}
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
              },
            ]}
            onPress={onOpenInbox}
            activeOpacity={0.75}
            accessibilityLabel="Open notification inbox"
          >
            <Feather name="bell" size={17} color={t.ink} />
            {unreadNotificationsCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadNotificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Theme Mode Toggle (Moon / Sun) */}
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
              },
            ]}
            onPress={onToggleTheme}
            activeOpacity={0.75}
            accessibilityLabel="Switch light or dark mode"
          >
            <Feather
              name={theme === 'light' ? 'moon' : 'sun'}
              size={17}
              color={t.ink}
            />
          </TouchableOpacity>

          {/* Top Right: Search Icon (Replaces Profile Button as requested) */}
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
              },
            ]}
            onPress={onPressSearch}
            activeOpacity={0.75}
            accessibilityLabel="Search films and experiences"
          >
            <Feather name="search" size={17} color={t.ink} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 44 : 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  topRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  avatarInitial: {
    ...TYPO.caption,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  unreadBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#E1251B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
  },
});
