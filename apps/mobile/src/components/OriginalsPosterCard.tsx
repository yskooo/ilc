import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { PROTOTYPE_THEMES, ThemeMode } from '../constants/prototypeTheme';
import { RADII, SHADOWS, TYPO } from '../constants/uiTokens';

export interface OriginalsPosterItem {
  id: string;
  title: string;
  type: string; // 'Series' | 'Film' | 'Special'
  duration: string;
  imageUrl: string;
  badge?: string;
  videoUrl?: string;
  embedUrl?: string;
}

export const ILC_ORIGINALS_CATALOG: OriginalsPosterItem[] = [
  {
    id: 'orig-1',
    title: 'Lagoon Diaries: El Nido',
    type: 'Series',
    duration: '28m',
    badge: 'ORIGINAL',
    imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=80',
    embedUrl: 'https://www.youtube.com/embed/ZfxZC_toy1U',
  },
  {
    id: 'orig-2',
    title: 'Ihaw-Ihaw After Dark',
    type: 'Series',
    duration: '22m',
    badge: 'ORIGINAL',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    embedUrl: 'https://www.youtube.com/embed/YYjXRYsN_vI',
  },
  {
    id: 'orig-3',
    title: 'Discover Bohol',
    type: 'Series',
    duration: '25m',
    badge: 'ORIGINAL',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    embedUrl: 'https://www.youtube.com/embed/c3wIGuHU9_g',
  },
  {
    id: 'orig-4',
    title: 'MassKara: Festival of Smiles',
    type: 'Film',
    duration: '42m',
    badge: 'ORIGINAL',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80',
    embedUrl: 'https://www.youtube.com/embed/P-iu1vverWQ',
  },
  {
    id: 'orig-5',
    title: 'Siquijor: Slow Island Life',
    type: 'Series',
    duration: '31m',
    badge: 'ORIGINAL',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
    embedUrl: 'https://www.youtube.com/embed/ZfxZC_toy1U',
  },
];

interface OriginalsPosterCardProps {
  item: OriginalsPosterItem;
  theme?: ThemeMode;
  onPress: (item: OriginalsPosterItem) => void;
  width?: number;
}

export const OriginalsPosterCard: React.FC<OriginalsPosterCardProps> = ({
  item,
  theme = 'dark',
  onPress,
  width = 135,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const height = Math.round(width * 1.5); // Standard 2:3 vertical poster ratio

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(item)}
      style={[styles.container, { width }]}
    >
      {/* Poster Image Box */}
      <View
        style={[
          styles.posterBox,
          SHADOWS.card,
          {
            height,
            backgroundColor: '#04150B',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(11,106,46,0.15)',
          },
        ]}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Top-left ORIGINAL Badge (Golden Pill) */}
        {item.badge && (
          <View style={styles.badgeWrap}>
            <View style={styles.originalBadge}>
              <Text style={styles.originalBadgeText}>{item.badge}</Text>
            </View>
          </View>
        )}

        {/* Subtle Gradient Shadow at bottom */}
        <View style={styles.bottomScrim} />
      </View>

      {/* Title & Metadata Below Card */}
      <Text style={[styles.title, { color: t.ink }]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.meta, { color: t.mute }]}>
        {item.type} · {item.duration}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  posterBox: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    marginBottom: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeWrap: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
  },
  originalBadge: {
    backgroundColor: '#0B6A2E', // Official ILC Palm Green
    paddingVertical: 2.5,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  originalBadgeText: {
    ...TYPO.micro,
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  bottomScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  title: {
    ...TYPO.bodyBold,
    fontSize: 13.5,
    lineHeight: 18,
  },
  meta: {
    ...TYPO.caption,
    fontSize: 12,
    marginTop: 2,
  },
});
