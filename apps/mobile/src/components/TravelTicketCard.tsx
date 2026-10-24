import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { PROTOTYPE_THEMES, ThemeMode } from '../constants/prototypeTheme';
import { RADII, SHADOWS, TYPO } from '../constants/uiTokens';
import { ILCButton } from './ILCButton';

export interface TravelTicketCardProps {
  theme?: ThemeMode;
  slot: string;
  price: string;
  duration: string;
  origin: string;
  destination: string;
  serviceType: string;
  onBook: () => void;
}

export const TravelTicketCard: React.FC<TravelTicketCardProps> = ({
  theme = 'light',
  slot,
  price,
  duration,
  origin,
  destination,
  serviceType,
  onBook,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#0F2618' : '#FFFFFF';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(11,106,46,0.12)';
  const badgeBg = isDark ? 'rgba(201,220,63,0.15)' : '#EAF2E6';

  const isStay = serviceType === 'Stays';

  return (
    <View
      style={[
        styles.card,
        SHADOWS.card,
        {
          backgroundColor: cardBg,
          borderColor: border,
        },
      ]}
    >
      {/* Top Header: Operator & Member Perk Badge */}
      <View style={styles.topRow}>
        <View style={styles.carrierGroup}>
          <View style={[styles.carrierIconWrap, { backgroundColor: badgeBg }]}>
            {serviceType === 'Flights' ? (
              <MaterialCommunityIcons name="airplane-takeoff" size={16} color="#0B6A2E" />
            ) : serviceType === 'Ferries' ? (
              <MaterialCommunityIcons name="ferry" size={16} color="#0B6A2E" />
            ) : (
              <Feather name="home" size={15} color="#0B6A2E" />
            )}
          </View>
          <View>
            <Text style={[TYPO.bodyBold, { color: t.ink }]}>
              {slot}
            </Text>
            <Text style={[TYPO.caption, { color: isDark ? 'rgba(255,255,255,0.6)' : '#6B7E72' }]}>
              Otamigo Partner Carrier
            </Text>
          </View>
        </View>

        <View style={[styles.memberBadge, { backgroundColor: '#C9DC3F' }]}>
          <Text style={[TYPO.micro, { color: '#06240F' }]}>
            5% OFF
          </Text>
        </View>
      </View>

      {/* Timeline Section */}
      {!isStay ? (
        <View style={styles.timelineRow}>
          <View style={styles.timeCol}>
            <Text style={[TYPO.h3, { color: t.ink }]}>08:30 AM</Text>
            <Text style={[TYPO.caption, { color: isDark ? 'rgba(255,255,255,0.6)' : '#6B7E72' }]} numberOfLines={1}>
              {origin || 'Origin'}
            </Text>
          </View>

          <View style={styles.durationCol}>
            <Text style={[TYPO.micro, { color: '#0B6A2E', marginBottom: 2 }]}>
              {duration}
            </Text>
            <View style={styles.flightLine}>
              <View style={styles.flightDot} />
              <View style={[styles.flightDashes, { borderColor: isDark ? 'rgba(255,255,255,0.3)' : '#A3C4AC' }]} />
              <Feather name="chevron-right" size={14} color="#0B6A2E" />
            </View>
            <Text style={[TYPO.micro, { color: isDark ? 'rgba(255,255,255,0.45)' : '#8FA496' }]}>
              Direct
            </Text>
          </View>

          <View style={[styles.timeCol, { alignItems: 'flex-end' }]}>
            <Text style={[TYPO.h3, { color: t.ink }]}>09:30 AM</Text>
            <Text style={[TYPO.caption, { color: isDark ? 'rgba(255,255,255,0.6)' : '#6B7E72' }]} numberOfLines={1}>
              {destination || 'Destination'}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.stayDetailsRow}>
          <Feather name="map-pin" size={14} color="#0B6A2E" style={{ marginRight: 6 }} />
          <Text style={[TYPO.caption, { color: isDark ? 'rgba(255,255,255,0.8)' : '#334438' }]}>
            {origin || 'Visayas Island Retreat'} · Verified Partner Resort
          </Text>
        </View>
      )}

      {/* Bottom Row: Price & Booking Button */}
      <View style={[styles.bottomRow, { borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(11,106,46,0.08)' }]}>
        <View>
          <Text style={[TYPO.micro, { color: isDark ? 'rgba(255,255,255,0.5)' : '#7C8E82' }]}>
            ILC MEMBER RATE
          </Text>
          <View style={styles.priceRow}>
            <Text style={[TYPO.h2, { color: '#0B6A2E', fontWeight: '800' }]}>
              {price}
            </Text>
            <Text style={[TYPO.caption, { color: isDark ? 'rgba(255,255,255,0.5)' : '#8FA496', marginLeft: 4 }]}>
              / person
            </Text>
          </View>
        </View>

        <ILCButton
          label="Book Fare"
          size="sm"
          variant="primary"
          icon="external-link"
          iconPosition="right"
          onPress={onBook}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADII.lg,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  carrierGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  carrierIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADII.pill,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  timeCol: {
    width: '32%',
  },
  durationCol: {
    alignItems: 'center',
    width: '36%',
  },
  flightLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  flightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0B6A2E',
  },
  flightDashes: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    marginHorizontal: 4,
  },
  stayDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 10,
    borderTopWidth: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
