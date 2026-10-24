import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BrandLogo, PrototypeQrCode } from './PrototypeArtwork';
import { computeMemberId, ThemeMode, PROTOTYPE_THEMES } from '../constants/prototypeTheme';
import { ASPECT_RATIOS, RADII, SHADOWS, TYPO } from '../constants/uiTokens';

interface MembershipCardViewProps {
  name: string;
  email: string;
  theme?: ThemeMode;
  onPress?: () => void;
  interactive?: boolean;
}

/**
 * Ultra-Luxury Digital Membership Pass (Apple Pay / Google Wallet Standard).
 *
 * Designed with:
 * - ISO/IEC 7810 Card Aspect Ratio (1.586 : 1)
 * - Deep Emerald Obsidian Brushed Titanium Gradient
 * - Specular Light Streak & Frosted Glass Highlights
 * - Metallic Copper/Gold EMV Smart Chip & Contactless NFC Waves
 * - Apple Card Monospace ID & Micro-embossed Typography
 */
export const MembershipCardView: React.FC<MembershipCardViewProps> = ({
  name,
  email,
  theme = 'dark',
  onPress,
  interactive = false,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const memberId = computeMemberId(email);
  // Format member ID into luxury 4-digit blocks: e.g. "ILC · 4820 · 9140"
  const rawNum = memberId.replace(/[^0-9]/g, '') || '84920';
  const padded = (rawNum + '19283746').slice(0, 8);
  const formattedCardNumber = `ILC · ${padded.slice(0, 4)} · ${padded.slice(4, 8)}`;

  const cardContent = (
    <View
      style={[
        styles.cardContainer,
        SHADOWS.luxuryCard,
        Platform.OS === 'web' &&
          ({
            backgroundImage:
              'linear-gradient(145deg, #071F11 0%, #0F3E21 42%, #082413 85%, #051A0D 100%)',
            boxShadow:
              '0 28px 56px -12px rgba(2, 38, 16, 0.55), 0 10px 24px -4px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -1px 1px rgba(0, 0, 0, 0.6)',
          } as any),
      ]}
    >
      {/* Specular Diagonal Light Streak (Apple Card glassmorphism reflection) */}
      {Platform.OS === 'web' ? (
        <>
          {React.createElement('div', {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(125deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 30%, rgba(0,0,0,0) 65%)',
              pointerEvents: 'none',
              borderRadius: RADII.card,
            },
          })}
          {React.createElement('div', {
            style: {
              position: 'absolute',
              right: -50,
              top: -50,
              width: 220,
              height: 220,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(201,220,63,0.15) 0%, rgba(201,220,63,0) 70%)',
              pointerEvents: 'none',
            },
          })}
        </>
      ) : (
        <View style={styles.nativeGlow} />
      )}

      {/* Top Header Row: ILC Emblem, Tier Badge & Contactless Wave */}
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <BrandLogo small theme="dark" />
          <View style={styles.tierPill}>
            <Text style={styles.tierPillText}>OBSIDIAN RESERVE</Text>
          </View>
        </View>

        {/* Contactless NFC Wave Indicator */}
        <View style={styles.nfcWaveGroup}>
          <MaterialCommunityIcons
            name="contactless-payment"
            size={22}
            color="rgba(255, 255, 255, 0.75)"
          />
        </View>
      </View>

      {/* Middle Body: Metallic EMV Chip + Monospace Card Number */}
      <View style={styles.middleRow}>
        <View style={styles.chipAndCodeRow}>
          {/* Simulated Copper/Gold EMV Smart Chip */}
          <View style={styles.emvChip}>
            <View style={styles.emvLineH} />
            <View style={styles.emvLineV} />
            <View style={styles.emvCenterCore} />
          </View>

          {/* Formatted Card Number (Apple Card style) */}
          <View style={styles.numberGroup}>
            <Text style={styles.cardNumberText}>{formattedCardNumber}</Text>
            <Text style={styles.cardTypeLabel}>DIGITAL PASS · VISA/PARTNER COMPATIBLE</Text>
          </View>
        </View>
      </View>

      {/* Bottom Footer: Member Name, Valid Thru, & Micro QR Pass */}
      <View style={styles.bottomRow}>
        <View style={styles.memberMetaCol}>
          <Text style={styles.microLabel}>CARDHOLDER</Text>
          <Text style={styles.memberNameText} numberOfLines={1}>
            {(name || 'JUAN DELA CRUZ').toUpperCase()}
          </Text>

          <View style={styles.validThruRow}>
            <Text style={styles.microLabel}>VALID THRU</Text>
            <Text style={styles.expiryValue}>12 / 28</Text>
            <View style={styles.statusActiveDot} />
            <Text style={styles.statusText}>VERIFIED</Text>
          </View>
        </View>

        {/* Embedded Mini QR with Frosted Glass Frame */}
        <View style={styles.qrGlassWrapper}>
          <PrototypeQrCode seed={email || 'member@islandlivingchannel.tv'} />
          <Text style={styles.qrSubHint}>SCAN 5% OFF</Text>
        </View>
      </View>
    </View>
  );

  if (interactive && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.94}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    aspectRatio: ASPECT_RATIOS.CREDIT_CARD, // Standard 1.586 : 1 card ratio
    borderRadius: RADII.card,
    backgroundColor: '#071F11',
    borderWidth: 1,
    borderColor: 'rgba(201, 220, 63, 0.4)',
    paddingVertical: 18,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 10,
  },
  nativeGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(201, 220, 63, 0.1)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tierPill: {
    backgroundColor: 'rgba(201, 220, 63, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201, 220, 63, 0.45)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADII.pill,
  },
  tierPillText: {
    ...TYPO.micro,
    color: '#D4E84B',
    fontSize: 9.5,
    letterSpacing: 1,
  },
  nfcWaveGroup: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleRow: {
    zIndex: 2,
    marginVertical: 4,
  },
  chipAndCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  emvChip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#C59A3F',
    borderWidth: 1,
    borderColor: '#E6C66E',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emvLineH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#8C6718',
  },
  emvLineV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: '#8C6718',
  },
  emvCenterCore: {
    width: 14,
    height: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#8C6718',
    backgroundColor: 'rgba(230, 198, 110, 0.6)',
  },
  numberGroup: {
    flex: 1,
  },
  cardNumberText: {
    ...TYPO.cardMono,
    color: '#FFFFFF',
    fontSize: 14.5,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardTypeLabel: {
    ...TYPO.micro,
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 8.5,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  memberMetaCol: {
    flex: 1,
  },
  microLabel: {
    ...TYPO.micro,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 8.5,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  memberNameText: {
    ...TYPO.bodyBold,
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  validThruRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  expiryValue: {
    ...TYPO.caption,
    color: '#D4E84B',
    fontWeight: '700',
    fontSize: 11.5,
    marginRight: 6,
  },
  statusActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  statusText: {
    ...TYPO.micro,
    color: '#34D399',
    fontSize: 9,
    letterSpacing: 0.6,
  },
  qrGlassWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  qrSubHint: {
    ...TYPO.micro,
    color: '#0A2414',
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.4,
    marginTop: 2,
  },
});
