import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  PROTOTYPE_THEMES,
  PrototypeTravelQuery,
  TRAVEL_RESULTS,
  ThemeMode,
} from '../constants/prototypeTheme';
import { RADII, SHADOWS, TYPO } from '../constants/uiTokens';
import { ServicePill, TravelServiceType } from '../components/ServicePill';
import { RouteSelectorCard } from '../components/RouteSelectorCard';
import { TravelTicketCard } from '../components/TravelTicketCard';
import { ILCButton } from '../components/ILCButton';

interface TravelScreenProps {
  theme: ThemeMode;
  query: PrototypeTravelQuery;
  searched: boolean;
  onChangeQuery: (next: Partial<PrototypeTravelQuery>, resetSearch?: boolean) => void;
  onSearch: () => void;
  onPushToast: (title: string, msg: string) => void;
}

const SERVICE_TABS: TravelServiceType[] = ['Ferries', 'Flights', 'Stays'];

export const TravelScreen: React.FC<TravelScreenProps> = ({
  theme,
  query,
  searched,
  onChangeQuery,
  onSearch,
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';
  const partnerUrl = 'https://otamigo.com';

  const handleSwap = () => {
    onChangeQuery({
      from: query.to,
      to: query.from,
    });
  };

  const handleBook = (slot: string, price: string) => {
    onPushToast(
      'Otamigo Partner Booking',
      `${slot} (${price}) selected with your 5% ILC member discount.`
    );
    Linking.openURL(partnerUrl).catch(() => { });
  };

  return (
    <View style={styles.container}>
      {/* Editorial Header */}
      <View style={styles.header}>
        <View style={styles.taglineRow}>
          <Text style={[TYPO.micro, { color: '#0B6A2E', letterSpacing: 1.2 }]}>
            ISLAND LIVING CHANNEL TRAVEL
          </Text>
        </View>

        <Text style={[TYPO.h1, { color: t.ink, marginTop: 4 }]}>
          Travel across the islands
        </Text>
      </View>

      {/* Step 1: Grab-style Service Pills */}
      <View style={styles.serviceRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.serviceScroll}
        >
          {SERVICE_TABS.map((type) => (
            <ServicePill
              key={type}
              label={type}
              active={query.type === type}
              theme={theme}
              badge={type === 'Ferries' ? 'Fast' : undefined}
              onPress={() => onChangeQuery({ type: type as any }, true)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Step 2: Grab-style Route & Date Selector Card */}
      <RouteSelectorCard
        theme={theme}
        serviceType={query.type}
        from={query.from}
        to={query.to}
        date={query.date}
        onChangeFrom={(from) => onChangeQuery({ from })}
        onChangeTo={(to) => onChangeQuery({ to })}
        onChangeDate={(date) => onChangeQuery({ date })}
        onSwapLocations={handleSwap}
      />

      {/* Step 3: High-Affordance Grab CTA */}
      <ILCButton
        label={`Find ${query.type} on Otamigo`}
        variant="primary"
        size="lg"
        fullWidth
        icon="search"
        iconPosition="left"
        badge="5% OFF"
        onPress={onSearch}
        style={{ marginBottom: 24 }}
      />

      {/* Step 4: Miller's Law Curated Results (3 Top Schedules) */}
      {searched && (
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <View>
              <Text style={[TYPO.micro, { color: isDark ? 'rgba(255,255,255,0.5)' : '#7C8E82' }]}>
                CURATED SCHEDULES
              </Text>
              <Text style={[TYPO.h3, { color: t.ink, marginTop: 2 }]}>
                Recommended {query.type}
              </Text>
            </View>
            <View style={styles.otamigoTag}>
              <MaterialCommunityIcons name="ticket-percent-outline" size={14} color="#0B6A2E" />
              <Text style={[TYPO.caption, { color: '#0B6A2E', fontWeight: '700', marginLeft: 4 }]}>
                Member Rate
              </Text>
            </View>
          </View>

          {TRAVEL_RESULTS.map(([slot, price, hours]) => (
            <TravelTicketCard
              key={slot}
              theme={theme}
              slot={`${slot} Departure`}
              price={price}
              duration={hours}
              origin={query.from}
              destination={query.to}
              serviceType={query.type}
              onBook={() => handleBook(slot, price)}
            />
          ))}

          {/* Otamigo Live Redirect Banner */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => Linking.openURL(partnerUrl).catch(() => { })}
            style={[
              styles.partnerBanner,
              {
                backgroundColor: isDark ? 'rgba(11,106,46,0.18)' : '#F3F8F2',
                borderColor: isDark ? 'rgba(201,220,63,0.3)' : 'rgba(11,106,46,0.2)',
              },
            ]}
          >
            <View style={styles.partnerBannerLeft}>
              <Feather name="external-link" size={18} color="#0B6A2E" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[TYPO.bodyBold, { color: t.ink }]}>
                  View all live seats on Otamigo
                </Text>
                <Text style={[TYPO.caption, { color: isDark ? 'rgba(255,255,255,0.6)' : '#6B7E72' }]}>
                  More ferry schedules, flight options, and seat choices
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#0B6A2E" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partnerMiniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADII.pill,
  },
  serviceRow: {
    marginBottom: 16,
  },
  serviceScroll: {
    paddingRight: 10,
  },
  resultsSection: {
    marginTop: 4,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  otamigoTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: RADII.md,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 16,
  },
  partnerBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
