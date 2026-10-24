import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { PROTOTYPE_THEMES, ThemeMode } from '../constants/prototypeTheme';
import { RADII, TYPO } from '../constants/uiTokens';

export type TravelServiceType = 'Flights' | 'Ferries' | 'Stays' | 'Tours';

interface ServicePillProps {
  label: TravelServiceType;
  active: boolean;
  onPress: () => void;
  theme?: ThemeMode;
  badge?: string;
}

export const ServicePill: React.FC<ServicePillProps> = ({
  label,
  active,
  onPress,
  theme = 'light',
  badge,
}) => {
  const t = PROTOTYPE_THEMES[theme];

  const renderIcon = (color: string) => {
    switch (label) {
      case 'Flights':
        return <MaterialCommunityIcons name="airplane" size={18} color={color} />;
      case 'Ferries':
        return <MaterialCommunityIcons name="ferry" size={18} color={color} />;
      case 'Stays':
        return <Feather name="home" size={16} color={color} />;
      case 'Tours':
        return <Feather name="compass" size={16} color={color} />;
      default:
        return <Feather name="map-pin" size={16} color={color} />;
    }
  };

  const activeBg = '#0B6A2E';
  const inactiveBg = theme === 'dark' ? 'rgba(255,255,255,0.06)' : '#F3F7F0';
  const activeFg = '#FFFFFF';
  const inactiveFg = theme === 'dark' ? 'rgba(255,255,255,0.85)' : '#122618';
  const borderColor = active ? '#0B6A2E' : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(11,106,46,0.12)';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.pillContainer,
        {
          backgroundColor: active ? activeBg : inactiveBg,
          borderColor: borderColor,
        },
      ]}
    >
      <View style={styles.iconWrap}>
        {renderIcon(active ? activeFg : inactiveFg)}
      </View>
      <Text
        style={[
          TYPO.bodyMedium,
          {
            color: active ? activeFg : inactiveFg,
            fontWeight: active ? '700' : '500',
            fontSize: 13.5,
          },
        ]}
      >
        {label}
      </Text>
      {badge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: active ? 'rgba(255,255,255,0.25)' : '#C9DC3F',
            },
          ]}
        >
          <Text
            style={[
              TYPO.micro,
              { color: active ? '#FFFFFF' : '#06240F' },
            ]}
          >
            {badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADII.pill,
    borderWidth: 1,
    gap: 8,
    marginRight: 8,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADII.pill,
    marginLeft: 2,
  },
});
