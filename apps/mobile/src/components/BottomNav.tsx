import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  TABS,
  PrototypeTab,
  ThemeMode,
  PROTOTYPE_THEMES,
} from '../constants/prototypeTheme';
import { RADII, TYPO } from '../constants/uiTokens';

export type TabType = PrototypeTab;

interface BottomNavProps {
  currentTab: PrototypeTab;
  onSelectTab: (tab: PrototypeTab) => void;
  theme?: ThemeMode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  theme = 'dark',
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';

  const renderTabIcon = (tab: PrototypeTab, color: string, active: boolean) => {
    switch (tab) {
      case 'home':
        return <Feather name="play-circle" size={20} color={color} />;
      case 'live':
        return <MaterialCommunityIcons name="broadcast" size={21} color={color} />;
      case 'rewards':
        return <Feather name="award" size={20} color={color} />;
      case 'travel':
        return <Feather name="navigation" size={19} color={color} />;
      case 'more':
        return <Feather name="user" size={20} color={color} />;
      default:
        return <Feather name="grid" size={20} color={color} />;
    }
  };

  const activeColor = isDark ? '#C9DC3F' : '#0B6A2E';
  const inactiveColor = isDark ? 'rgba(255, 255, 255, 0.42)' : '#8E8E93';

  return (
    <View
      style={[
        styles.tabsDock,
        {
          backgroundColor: isDark ? 'rgba(4, 21, 11, 0.90)' : 'rgba(255, 255, 255, 0.92)',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        },
        Platform.OS === 'web' &&
          ({
            backdropFilter: 'blur(24px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
            boxShadow: isDark
              ? '0 -8px 24px rgba(0, 0, 0, 0.5)'
              : '0 -4px 20px rgba(0, 0, 0, 0.06)',
          } as any),
      ]}
    >
      <View style={styles.tabsRow}>
        {TABS.map(([key, label]) => {
          const isActive = currentTab === key;
          const color = isActive ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={key}
              style={styles.tabButton}
              onPress={() => onSelectTab(key)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrap}>
                {renderTabIcon(key, color, isActive)}
                {isActive && (
                  <View
                    style={[
                      styles.activeDot,
                      { backgroundColor: activeColor },
                    ]}
                  />
                )}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  {
                    color,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 24,
  },
  activeDot: {
    position: 'absolute',
    bottom: -3,
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
  },
  tabLabel: {
    ...TYPO.micro,
    fontSize: 10,
    letterSpacing: 0.1,
    textTransform: 'none',
    marginTop: 2,
  },
});
