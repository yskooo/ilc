import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PROTOTYPE_THEMES, ThemeMode } from '../constants/prototypeTheme';
import { RADII, SHADOWS, TYPO } from '../constants/uiTokens';

export interface RouteSelectorCardProps {
  theme?: ThemeMode;
  serviceType: string;
  from: string;
  to: string;
  date: string;
  onChangeFrom: (val: string) => void;
  onChangeTo: (val: string) => void;
  onChangeDate: (val: string) => void;
  onSwapLocations?: () => void;
}

const VISAYAS_HUBS = [
  { name: 'Bacolod', code: 'BCD' },
  { name: 'Iloilo', code: 'ILO' },
  { name: 'Cebu', code: 'CEB' },
  { name: 'Boracay', code: 'MPH' },
];

export const RouteSelectorCard: React.FC<RouteSelectorCardProps> = ({
  theme = 'light',
  serviceType,
  from,
  to,
  date,
  onChangeFrom,
  onChangeTo,
  onChangeDate,
  onSwapLocations,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isStay = serviceType === 'Stays';

  const isDark = theme === 'dark';
  const cardBg = isDark ? '#0F2618' : '#FFFFFF';
  const lineBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(11,106,46,0.12)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#F6F9F5';

  // Helper date pre-fill
  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const iso = d.toISOString().split('T')[0];
    onChangeDate(iso);
  };

  return (
    <View
      style={[
        styles.card,
        SHADOWS.card,
        {
          backgroundColor: cardBg,
          borderColor: lineBorder,
        },
      ]}
    >
      {/* Route Inputs with Grab-style Vertical Connector */}
      <View style={styles.routeContainer}>
        {/* Connector Line & Indicators */}
        <View style={styles.indicatorCol}>
          <View style={styles.originDot} />
          <View style={[styles.connectorLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : '#CBDCD0' }]} />
          <View style={[styles.destRing, { borderColor: '#0B6A2E' }]} />
        </View>

        {/* Inputs Column */}
        <View style={styles.inputsCol}>
          {/* Origin / Destination for Stays */}
          <View style={styles.fieldBox}>
            <Text style={[TYPO.micro, { color: isDark ? 'rgba(255,255,255,0.5)' : '#6B7E72' }]}>
              {isStay ? 'DESTINATION' : 'FROM (ORIGIN)'}
            </Text>
            <TextInput
              value={from}
              onChangeText={onChangeFrom}
              placeholder={isStay ? 'e.g. Bacolod or Iloilo City' : 'Departure city or port'}
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#9AA7A0'}
              style={[
                styles.textInput,
                {
                  color: t.ink,
                  backgroundColor: inputBg,
                  borderColor: lineBorder,
                },
              ]}
            />
          </View>

          {/* Destination (if not stay) */}
          {!isStay && (
            <View style={[styles.fieldBox, { marginTop: 10 }]}>
              <Text style={[TYPO.micro, { color: isDark ? 'rgba(255,255,255,0.5)' : '#6B7E72' }]}>
                TO (DESTINATION)
              </Text>
              <TextInput
                value={to}
                onChangeText={onChangeTo}
                placeholder="Arrival city or island"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#9AA7A0'}
                style={[
                  styles.textInput,
                  {
                    color: t.ink,
                    backgroundColor: inputBg,
                    borderColor: lineBorder,
                  },
                ]}
              />
            </View>
          )}
        </View>

        {/* Swap Button */}
        {!isStay && onSwapLocations && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onSwapLocations}
            style={[
              styles.swapBtn,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#EAF2E6',
                borderColor: lineBorder,
              },
            ]}
          >
            <Feather name="refresh-cw" size={15} color="#0B6A2E" />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Island Hubs */}
      <View style={styles.hubChipsRow}>
        <Text style={[TYPO.micro, { color: isDark ? 'rgba(255,255,255,0.5)' : '#6B7E72', marginRight: 4 }]}>
          Popular:
        </Text>
        {VISAYAS_HUBS.map((hub) => (
          <TouchableOpacity
            key={hub.code}
            onPress={() => {
              if (!from || from === hub.name) {
                onChangeTo(hub.name);
              } else {
                onChangeFrom(hub.name);
              }
            }}
            style={[
              styles.hubChip,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F0F5EE',
                borderColor: lineBorder,
              },
            ]}
          >
            <Text style={[TYPO.caption, { color: isDark ? '#FFFFFF' : '#0B6A2E', fontWeight: '600' }]}>
              {hub.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: lineBorder }]} />

      {/* Date Selection Chunk */}
      <View style={styles.dateRow}>
        <View style={styles.dateLabelGroup}>
          <Feather name="calendar" size={16} color="#0B6A2E" style={{ marginRight: 6 }} />
          <Text style={[TYPO.micro, { color: isDark ? 'rgba(255,255,255,0.6)' : '#55665A' }]}>
            DEPARTURE DATE
          </Text>
        </View>

        <View style={styles.quickDateChips}>
          <TouchableOpacity
            onPress={() => setQuickDate(0)}
            style={[styles.dateChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F0F5EE' }]}
          >
            <Text style={[TYPO.caption, { color: isDark ? '#FFFFFF' : '#0B6A2E' }]}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setQuickDate(1)}
            style={[styles.dateChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F0F5EE' }]}
          >
            <Text style={[TYPO.caption, { color: isDark ? '#FFFFFF' : '#0B6A2E' }]}>Tomorrow</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Actual Date Input */}
      {Platform.OS === 'web' ? (
        React.createElement('input', {
          type: 'date',
          value: date,
          onChange: (e: any) => onChangeDate(e.target.value),
          style: {
            width: '100%',
            padding: '12px 14px',
            border: `1px solid ${lineBorder}`,
            borderRadius: RADII.sm,
            backgroundColor: inputBg,
            color: t.ink,
            fontSize: 14.5,
            fontWeight: '600',
            outline: 'none',
            boxSizing: 'border-box',
            marginTop: 6,
          },
        })
      ) : (
        <TextInput
          value={date}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={isDark ? 'rgba(255,255,255,0.35)' : '#9AA7A0'}
          onChangeText={onChangeDate}
          style={[
            styles.textInput,
            {
              color: t.ink,
              backgroundColor: inputBg,
              borderColor: lineBorder,
              marginTop: 6,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADII.lg,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  indicatorCol: {
    alignItems: 'center',
    width: 22,
    marginRight: 10,
    paddingVertical: 14,
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0B6A2E',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
    minHeight: 28,
  },
  destRing: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2.5,
  },
  inputsCol: {
    flex: 1,
  },
  fieldBox: {
    gap: 4,
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADII.sm,
    borderWidth: 1,
    fontSize: 14.5,
    fontWeight: '600',
  },
  swapBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  hubChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 14,
  },
  hubChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: RADII.pill,
    borderWidth: 1,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickDateChips: {
    flexDirection: 'row',
    gap: 6,
  },
  dateChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADII.pill,
  },
});
