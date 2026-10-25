import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PROTOTYPE_THEMES, ThemeMode } from '../constants/prototypeTheme';
import { RADII, SHADOWS, TYPO } from '../constants/uiTokens';

export interface CinematicHeroProps {
  theme?: ThemeMode;
  title?: string;
  tagline?: string;
  synopsis?: string;
  imageUrl?: string;
  duration?: string;
  onWatchNow: () => void;
  onToggleMyList?: (added: boolean) => void;
  onOpenDetails?: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  theme = 'dark',
  title = 'Lagoon Diaries: El Nido',
  tagline = 'TRAVEL · ILC ORIGINAL',
  synopsis = "Hop between hidden lagoons and limestone cathedrals with local boatmen who've mapped these waters for generations.",
  imageUrl = 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1080&q=85',
  duration = '28m',
  onWatchNow,
  onToggleMyList,
  onOpenDetails,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [inList, setInList] = useState(false);

  const handleMyList = () => {
    const next = !inList;
    setInList(next);
    if (onToggleMyList) onToggleMyList(next);
  };

  return (
    <View
      style={[
        styles.heroContainer,
        SHADOWS.elevated,
        {
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(11,106,46,0.15)',
        },
      ]}
    >
      {/* Background Cinematic Poster Image */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.heroImage}
        resizeMode="cover"
      />

      {/* Cinematic Vignette & Bottom Gradient Scrim */}
      <View style={styles.gradientScrim} />

      {/* Hero Content Overlay */}
      <View style={styles.contentOverlay}>
        {/* Category Pill Tagline */}
        <View style={styles.taglineRow}>
          <Text style={styles.taglineText}>{tagline}</Text>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        </View>

        {/* Big Bold Cinematic Title */}
        <Text style={styles.titleText} numberOfLines={2}>
          {title}
        </Text>

        {/* Editorial Synopsis */}
        <Text style={styles.synopsisText} numberOfLines={2}>
          {synopsis}
        </Text>

        {/* 3-Action Controls Row (Matching Netflix/Apple TV Reference) */}
        <View style={styles.actionsRow}>
          {/* + My List Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleMyList}
            style={styles.actionBtn}
          >
            <Feather
              name={inList ? 'check' : 'plus'}
              size={20}
              color={inList ? '#C9DC3F' : '#FFFFFF'}
            />
            <Text
              style={[
                styles.actionBtnText,
                inList && { color: '#C9DC3F' },
              ]}
            >
              {inList ? 'In List' : 'My List'}
            </Text>
          </TouchableOpacity>

          {/* ▶ Watch Now (Hero Warm Gold Pill CTA) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onWatchNow}
            style={[
              styles.watchNowBtn,
              Platform.OS === 'web' &&
                ({
                  boxShadow: '0 8px 24px rgba(11, 106, 46, 0.45)',
                } as any),
            ]}
          >
            <Text style={styles.playIcon}>▶</Text>
            <Text style={styles.watchNowText}>Watch Now</Text>
          </TouchableOpacity>

          {/* ⓘ Details Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onOpenDetails || onWatchNow}
            style={styles.actionBtn}
          >
            <Feather name="info" size={20} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    width: '100%',
    minHeight: 460,
    borderRadius: RADII.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#04150B',
    borderWidth: 1,
    marginBottom: 20,
    justifyContent: 'flex-end',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.15 }], // Zooms past letterbox black bars in YouTube thumbnails
  },
  gradientScrim: {
    ...StyleSheet.absoluteFillObject,
    ...(Platform.OS === 'web'
      ? {
          backgroundImage:
            'linear-gradient(180deg, transparent 0%, transparent 45%, rgba(4,21,11,0.65) 75%, #04150B 100%)',
        }
      : {}),
  },
  contentOverlay: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    zIndex: 2,
    alignItems: 'center',
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  taglineText: {
    ...TYPO.micro,
    color: '#C9DC3F', // ILC Sun Gold
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  durationBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  durationText: {
    ...TYPO.micro,
    color: '#FFFFFF',
    fontSize: 9.5,
  },
  titleText: {
    ...TYPO.h1,
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 33,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  synopsisText: {
    ...TYPO.subhead,
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13.5,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 22,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 54,
  },
  actionBtnText: {
    ...TYPO.caption,
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600',
  },
  watchNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B6A2E', // Official ILC Palm Green
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderRadius: RADII.pill,
    gap: 8,
    minWidth: 155,
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  watchNowText: {
    ...TYPO.bodyBold,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
