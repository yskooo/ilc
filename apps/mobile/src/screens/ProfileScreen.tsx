import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { MembershipCardView } from '../components/MembershipCardView';
import {
  H1,
  H2,
  H3,
  MuteText,
  PromoBox,
  ProtoChip,
} from '../components/PrototypePrimitives';
import { ILCButton } from '../components/ILCButton';
import {
  MERCHANTS,
  PROTOTYPE_THEMES,
  PrototypeMerchant,
  ThemeMode,
  computeMemberId,
} from '../constants/prototypeTheme';
import { RADII, SHADOWS, TYPO } from '../constants/uiTokens';

interface ProfileScreenProps {
  theme: ThemeMode;
  isRegistered: boolean;
  memberName: string;
  memberEmail: string;
  gift: { text: string; days: number };
  city: string;
  onSelectCity: (city: string) => void;
  onOpenRegister: () => void;
  onSelectMerchant: (merchant: PrototypeMerchant) => void;
  onOpenFullscreenQr: (merchantName?: string) => void;
  onPushToast: (title: string, msg: string) => void;
}

const CITIES = ['All', 'Bacolod', 'Iloilo', 'Cebu'];

const getCategoryIcon = (category: string): keyof typeof Feather.glyphMap => {
  switch (category) {
    case 'Coffee':
      return 'coffee';
    case 'Dining':
      return 'compass';
    case 'Stay':
      return 'home';
    case 'Shopping':
      return 'shopping-bag';
    case 'Tours':
      return 'navigation';
    case 'Activities':
      return 'anchor';
    default:
      return 'map-pin';
  }
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  theme,
  isRegistered,
  memberName,
  memberEmail,
  gift,
  city,
  onSelectCity,
  onOpenRegister,
  onSelectMerchant,
  onOpenFullscreenQr,
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';
  const filteredMerchants = MERCHANTS.filter(
    (m) => city === 'All' || m.c === city
  );
  const memberId = computeMemberId(memberEmail);

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <H1 theme={theme}>Rewards</H1>
      <MuteText theme={theme} style={styles.subtitle}>
        Private member privileges, contactless digital pass, and curated island perks.
      </MuteText> */}

      {/* Guest Card / Digital Pass Preview */}
      {/* Guest Card / Join Membership Banner (GCash IPO Banner Style) */}
      {!isRegistered ? (
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={onOpenRegister}
          style={[
            styles.joinBannerCard,
            SHADOWS.card,
            {
              borderColor: isDark ? 'rgba(201,220,63,0.3)' : 'rgba(11,106,46,0.18)',
            },
          ]}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80' }}
            style={styles.joinBannerImage}
            resizeMode="cover"
          />
          <View style={[styles.joinScrim, { backgroundColor: 'rgba(4, 21, 11, 0.65)' }]} />

          <View style={styles.joinCardContent}>
            <View style={styles.joinTopRow}>
              <View style={[styles.passBadge, { backgroundColor: '#C9DC3F' }]}>
                <Text style={[TYPO.micro, { color: '#06240F', fontWeight: '900' }]}>
                  ILC OBSIDIAN PASS
                </Text>
              </View>
              <MaterialCommunityIcons name="contactless-payment" size={20} color="#C9DC3F" />
            </View>

            <View style={{ marginVertical: 3 }}>
              <Text style={styles.joinTitle}>Your contactless digital pass lives here</Text>
              <Text style={styles.joinSubtitle} numberOfLines={2}>
                Register free to claim your welcome gift ({gift.text}) and 5% off at verified island merchants.
              </Text>
            </View>

            <View style={styles.joinBottomRow}>
              <View style={styles.joinCtaBtn}>
                <Text style={styles.joinCtaText}>Create Free Account</Text>
                <Feather name="arrow-right" size={13} color="#FFFFFF" style={{ marginLeft: 5 }} />
              </View>
              <Text style={styles.joinWatermark}>TAP TO JOIN</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.cardSection}>
          <View style={styles.cardSectionHeader}>
            <View>
              <Text style={[TYPO.micro, { color: '#0B6A2E', letterSpacing: 1 }]}>
                DIGITAL WALLET PASS
              </Text>
              <Text style={[TYPO.h3, { color: t.ink, marginTop: 2 }]}>
                Obsidian Reserve Card
              </Text>
            </View>
            <TouchableOpacity onPress={() => onOpenFullscreenQr()}>
              <Text style={[TYPO.caption, { color: '#0B6A2E', fontWeight: '700' }]}>
                Fullscreen QR ↗
              </Text>
            </TouchableOpacity>
          </View>

          <MembershipCardView
            name={memberName}
            email={memberEmail}
            theme={theme}
            interactive
            onPress={() => onOpenFullscreenQr()}
          />

          <TouchableOpacity
            style={[
              styles.fullscreenQrHint,
              { borderColor: t.line, backgroundColor: t.inputBg },
            ]}
            onPress={() => onOpenFullscreenQr()}
            activeOpacity={0.8}
          >
            <Feather name="maximize-2" size={14} color="#0B6A2E" />
            <Text style={[TYPO.bodyMedium, { color: t.ink, fontSize: 13.5 }]}>
              Tap card to present Fullscreen Cashier QR
            </Text>
          </TouchableOpacity>

          {/* Welcome Gift Card */}
          <View
            style={[
              styles.giftCard,
              {
                borderColor: t.line,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F5F9F4',
              },
            ]}
          >
            <View style={styles.giftIconWrap}>
              <Feather name="gift" size={18} color="#0B6A2E" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.giftTagRow}>
                <Text style={[TYPO.micro, { color: '#0B6A2E' }]}>WELCOME GIFT</Text>
                <Text style={[TYPO.caption, { color: t.mute }]}>Expires in {gift.days}d</Text>
              </View>
              <Text style={[TYPO.bodyBold, { color: t.ink, marginTop: 2 }]}>
                {gift.text}
              </Text>
            </View>
            <ILCButton
              theme={theme}
              variant="primary"
              size="sm"
              label="Claim"
              onPress={() =>
                onPushToast(
                  'Gift Ready',
                  `Present code to cashier: ${memberId}`
                )
              }
            />
          </View>
        </View>
      )}

      {/* Partner Directory Section */}
      <View style={styles.directoryHeader}>
        <View style={styles.directoryTitleRow}>
          <Text style={[TYPO.micro, { color: '#0B6A2E', letterSpacing: 1 }]}>
            PARTNER DIRECTORY
          </Text>
          <View style={[styles.discountPill, { backgroundColor: '#C9DC3F' }]}>
            <Text style={[TYPO.micro, { color: '#06240F' }]}>5% OFF ALL</Text>
          </View>
        </View>
        <H2 theme={theme} style={{ marginTop: 4, marginBottom: 2 }}>
          Curated island perks
        </H2>
        <MuteText theme={theme} style={{ marginBottom: 12 }}>
          Show your digital card before ordering to receive partner rates.
        </MuteText>
      </View>

      {/* City Chips */}
      <View style={styles.chipsRow}>
        {CITIES.map((c) => (
          <ProtoChip
            key={c}
            theme={theme}
            label={c}
            active={city === c}
            onPress={() => onSelectCity(c)}
          />
        ))}
      </View>

      {/* Grouped Merchant Cards Container */}
      <View
        style={[
          styles.merchantsCard,
          SHADOWS.card,
          {
            backgroundColor: isDark ? '#0A2414' : '#FFFFFF',
            borderColor: t.line,
          },
        ]}
      >
        {filteredMerchants.map((m, index) => {
          const isLast = index === filteredMerchants.length - 1;
          const iconName = getCategoryIcon(m.t);

          return (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.merchantRow,
                !isLast && { borderBottomWidth: 1, borderBottomColor: t.line },
              ]}
              onPress={() => onSelectMerchant(m)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.categoryIconWrap,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#EAF2E6',
                    borderColor: t.line,
                  },
                ]}
              >
                <Feather name={iconName} size={15} color="#0B6A2E" />
              </View>

              <View style={styles.merchantInfo}>
                <Text style={[TYPO.bodyBold, { color: t.ink }]}>
                  {m.n}
                </Text>
                <Text style={[TYPO.caption, { color: t.mute, marginTop: 2 }]}>
                  {m.t} · {m.c} · {m.hours.split('·')[1]?.trim() || m.hours}
                </Text>
              </View>

              <View style={styles.merchantRight}>
                <Feather name="chevron-right" size={17} color={t.mute} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  subtitle: {
    marginTop: 4,
  },
  promoHeaderRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  passBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADII.pill,
  },
  promoSub: {
    marginTop: 4,
    marginBottom: 14,
  },
  cardSection: {
    marginTop: 12,
  },
  cardSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fullscreenQrHint: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADII.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  giftCard: {
    marginTop: 12,
    borderRadius: RADII.lg,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  giftIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF2E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  directoryHeader: {
    marginTop: 26,
  },
  directoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discountPill: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: RADII.pill,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  merchantsCard: {
    borderRadius: RADII.lg,
    borderWidth: 1,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantInfo: {
    flex: 1,
  },
  merchantRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBannerCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    height: 156,
    marginTop: 14,
  },
  joinBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  joinScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 18, 10, 0.78)',
  },
  joinCardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  joinTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  joinTitle: {
    ...TYPO.bodyBold,
    fontSize: 16.5,
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  joinSubtitle: {
    ...TYPO.footnote,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 16,
    marginTop: 2,
  },
  joinBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  joinCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 106, 46, 0.95)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADII.pill,
    borderWidth: 0.8,
    borderColor: 'rgba(201, 220, 63, 0.4)',
  },
  joinCtaText: {
    ...TYPO.caption,
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  joinWatermark: {
    ...TYPO.micro,
    fontSize: 8.5,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
});
