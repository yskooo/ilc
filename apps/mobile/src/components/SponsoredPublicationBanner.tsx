import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { PROTOTYPE_THEMES, ThemeMode } from '../constants/prototypeTheme';
import { RADII, SHADOWS, TYPO } from '../constants/uiTokens';

export interface SponsoredPublicationBannerProps {
  theme?: ThemeMode;
  partnerName?: string;
  badge?: string;
  headline?: string;
  subtext?: string;
  imageUrl?: string;
  onPress: () => void;
}

export const SponsoredPublicationBanner: React.FC<SponsoredPublicationBannerProps> = ({
  theme = 'dark',
  partnerName = 'Discovery Shores Boracay',
  badge = 'FEATURED SPONSOR',
  headline = 'Luxury beachfront suites in Station 1 · Exclusive ILC sunset welcome perk',
  subtext = 'Book via our travel desk for complimentary catamaran passes & 5% member savings.',
  imageUrl = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
  onPress,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.bannerCard,
        SHADOWS.card,
        {
          backgroundColor: isDark ? '#0A2414' : '#FFFFFF',
          borderColor: isDark ? 'rgba(201,220,63,0.3)' : 'rgba(11,106,46,0.18)',
        },
      ]}
    >
      {/* Background Image / Resort visual */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.imageScrim} />
      </View>

      {/* Banner Content */}
      <View style={styles.contentWrap}>
        <View style={styles.headerRow}>
          <View style={styles.badgeRow}>
            <View style={[styles.sponsorPill, { backgroundColor: '#C9DC3F' }]}>
              <Text style={[TYPO.micro, { color: '#06240F', fontSize: 9 }]}>
                {badge}
              </Text>
            </View>
            <Text style={[TYPO.micro, { color: isDark ? '#C9DC3F' : '#0B6A2E' }]}>
              {partnerName}
            </Text>
          </View>

          <View style={styles.monetizeTag}>
            <Text style={[TYPO.micro, { color: isDark ? 'rgba(255,255,255,0.45)' : '#7C8E82', fontSize: 8.5 }]}>
              SPONSORED
            </Text>
          </View>
        </View>

        <Text style={[TYPO.h3, { color: t.ink, marginTop: 4, fontSize: 15 }]} numberOfLines={2}>
          {headline}
        </Text>
        <Text style={[TYPO.footnote, { color: isDark ? 'rgba(255,255,255,0.7)' : '#5C6D62', marginTop: 2 }]} numberOfLines={1}>
          {subtext}
        </Text>

        <View style={styles.ctaRow}>
          <Text style={[TYPO.caption, { color: isDark ? '#C9DC3F' : '#0B6A2E', fontWeight: '700' }]}>
            View Partner Offer
          </Text>
          <Feather name="arrow-up-right" size={15} color={isDark ? '#C9DC3F' : '#0B6A2E'} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bannerCard: {
    borderRadius: RADII.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 105,
  },
  imageWrap: {
    width: 105,
    height: '100%',
    position: 'relative',
    backgroundColor: '#04150B',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  imageScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  contentWrap: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sponsorPill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADII.pill,
  },
  monetizeTag: {
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
});
