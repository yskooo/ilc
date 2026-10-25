import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  TABS,
  PrototypeTab,
  ThemeMode,
  PROTOTYPE_THEMES,
} from '../constants/prototypeTheme';
import { FONT_STACK, TYPO } from '../constants/uiTokens';

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

  // Apple SF Symbols - aligned icon mapping
  const renderTabIcon = (tab: PrototypeTab, color: string, active: boolean) => {
    switch (tab) {
      case 'home':
        return (
          <Ionicons
            name={active ? 'tv' : 'tv-outline'}
            size={20}
            color={color}
          />
        );
      case 'live':
        return (
          <View style={styles.liveIconContainer}>
            <Ionicons
              name={active ? 'radio' : 'radio-outline'}
              size={20}
              color={color}
            />
            {/* Live broadcast pulse dot */}
            <View
              style={[
                styles.liveBeaconDot,
                { borderColor: isDark ? '#0A2417' : '#FFFFFF' },
              ]}
            />
          </View>
        );
      case 'rewards':
        return (
          <Ionicons
            name={active ? 'ticket' : 'ticket-outline'}
            size={20}
            color={color}
          />
        );
      case 'travel':
        return (
          <Ionicons
            name={active ? 'compass' : 'compass-outline'}
            size={21}
            color={color}
          />
        );
      case 'more':
        return (
          <Ionicons
            name={active ? 'grid' : 'grid-outline'}
            size={19}
            color={color}
          />
        );
      default:
        return (
          <Ionicons
            name={active ? 'apps' : 'apps-outline'}
            size={20}
            color={color}
          />
        );
    }
  };

  const activeTint = isDark ? '#C9DC3F' : '#0B6A2E';
  const inactiveTint = isDark
    ? 'rgba(255, 255, 255, 0.44)'
    : 'rgba(20, 31, 24, 0.46)';

  return (
    <View style={styles.floatingDockWrapper} pointerEvents="box-none">
      <View
        style={[
          styles.liquidGlassBar,
          {
            backgroundColor: isDark
              ? 'rgba(10, 28, 18, 0.82)'
              : 'rgba(255, 255, 255, 0.86)',
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.16)'
              : 'rgba(0, 0, 0, 0.08)',
          },
          Platform.OS === 'web' &&
            ({
              backdropFilter: 'blur(30px) saturate(210%)',
              WebkitBackdropFilter: 'blur(30px) saturate(210%)',
              boxShadow: isDark
                ? '0 16px 36px -6px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.22), inset 0 -1px 1px rgba(0, 0, 0, 0.4)'
                : '0 12px 30px -4px rgba(0, 0, 0, 0.12), inset 0 1px 1.5px rgba(255, 255, 255, 0.95), inset 0 -1px 1px rgba(0, 0, 0, 0.04)',
            } as any),
        ]}
      >
        <View style={styles.tabsRow}>
          {TABS.map(([key, label]) => {
            const isActive = currentTab === key;
            const color = isActive ? activeTint : inactiveTint;

            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.tabButton,
                  isActive && [
                    styles.activeLiquidPill,
                    {
                      backgroundColor: isDark
                        ? 'rgba(201, 220, 63, 0.14)'
                        : 'rgba(11, 106, 46, 0.09)',
                      borderColor: isDark
                        ? 'rgba(201, 220, 63, 0.28)'
                        : 'rgba(11, 106, 46, 0.18)',
                    },
                  ],
                ]}
                onPress={() => onSelectTab(key)}
                activeOpacity={0.7}
              >
                <View style={styles.iconWrap}>
                  {renderTabIcon(key, color, isActive)}
                </View>

                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingDockWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 26,
    zIndex: 30,
  },
  liquidGlassBar: {
    width: '100%',
    maxWidth: 400,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 5,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 2.5,
  },
  activeLiquidPill: {
    // Styling applied when active
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
  },
  liveIconContainer: {
    position: 'relative',
  },
  liveBeaconDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
  },
  tabLabel: {
    fontFamily: FONT_STACK,
    fontSize: 10,
    letterSpacing: -0.1,
  },
});
