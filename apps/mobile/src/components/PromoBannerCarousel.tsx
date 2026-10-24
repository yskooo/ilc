import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Linking,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PROTOTYPE_THEMES, ThemeMode } from '../constants/prototypeTheme';
import { RADII, SHADOWS, TYPO } from '../constants/uiTokens';

export interface PromoBannerItem {
  id: string;
  badge: string;
  badgeBg?: string;
  badgeColor?: string;
  partnerTag?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  ctaAction: 'membership' | 'travel' | 'livetv' | 'external';
  externalUrl?: string;
  tintColor?: string;
}

export interface PromoBannerCarouselProps {
  theme?: ThemeMode;
  onOpenMembership?: () => void;
  onOpenTravel?: () => void;
  onOpenLiveTv?: () => void;
  onPushToast?: (title: string, message: string) => void;
}

export const BASE_PROMO_ITEMS: PromoBannerItem[] = [
  {
    id: 'join-membership',
    badge: 'ILC OBSIDIAN PASS',
    badgeBg: '#C9DC3F',
    badgeColor: '#06240F',
    partnerTag: 'JOIN MEMBERSHIP',
    title: 'Unlock Island Perks & Digital Pass',
    subtitle: 'Register free to claim welcome gift & 5% VIP discounts at verified cafes and partner resorts.',
    ctaText: 'Claim Digital Pass',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
    ctaAction: 'membership',
  },
  {
    id: 'otamigo-offer',
    badge: 'OTAMIGO TRANSIT · 5% OFF',
    badgeBg: '#C9DC3F',
    badgeColor: '#06240F',
    partnerTag: 'VERIFIED TRANSIT AD',
    title: 'Fastcraft Ferries & Island Flights',
    subtitle: 'Direct booking for 2GO, OceanJet & Cebu flights with instant mobile QR boarding passes.',
    ctaText: 'Book Transit',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=80',
    ctaAction: 'travel',
  },
  {
    id: 'resort-sponsor',
    badge: 'FEATURED RESORT',
    badgeBg: 'rgba(255,255,255,0.92)',
    badgeColor: '#0B6A2E',
    partnerTag: 'DISCOVERY SHORES BORACAY',
    title: 'Luxury Beachfront Suites in Station 1',
    subtitle: 'Catamaran sunset passes & exclusive welcome cocktails for verified ILC members.',
    ctaText: 'View Resort Offer',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80',
    ctaAction: 'external',
    externalUrl: 'https://otamigo.com',
  },
  {
    id: 'festival-livetv',
    badge: 'LIVE BROADCAST',
    badgeBg: '#E1251B',
    badgeColor: '#FFFFFF',
    partnerTag: 'CULTURAL SPECIAL',
    title: 'MassKara & Dinagyang in 4K',
    subtitle: 'High-definition multi-camera live coverage streaming direct from the islands to your pocket.',
    ctaText: 'Stream Live TV',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&q=80',
    ctaAction: 'livetv',
  },
];

// Replicate 5 cycles for a smooth infinite carousel loop
const REPEAT_COUNT = 5;
const INFINITE_ITEMS = Array.from({ length: REPEAT_COUNT }, (_, cycleIndex) =>
  BASE_PROMO_ITEMS.map((item) => ({
    ...item,
    virtualKey: `${item.id}-cycle-${cycleIndex}`,
  }))
).flat();

export const PromoBannerCarousel: React.FC<PromoBannerCarouselProps> = ({
  theme = 'dark',
  onOpenMembership,
  onOpenTravel,
  onOpenLiveTv,
  onPushToast,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';

  // Bound to mobile container width (maxWidth: 430 on web, or screen width on mobile)
  const appWidth = Math.min(windowWidth, 430);

  // Card size proportioned to GCash "IPO is here" banner (~1.9 : 1 ratio)
  // Takes up ~76% of viewport width with narrower 8px gap for closer, cohesive card spacing
  const CARD_WIDTH = Math.round(appWidth * 0.76);
  const CARD_HEIGHT = Math.round(CARD_WIDTH * 0.52);
  const GAP = 8;
  const TOTAL_ITEM_WIDTH = CARD_WIDTH + GAP;
  const SIDE_INSET = Math.round((appWidth - CARD_WIDTH) / 2);

  const middleCycleStart = Math.floor(REPEAT_COUNT / 2) * BASE_PROMO_ITEMS.length;
  const initialOffset = middleCycleStart * TOTAL_ITEM_WIDTH;

  const [activeVirtualIndex, setActiveVirtualIndex] = useState(middleCycleStart);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isInteracting = useRef(false);
  const currentOffsetRef = useRef(initialOffset);

  // Initialize scroll position in the middle cycle on mount so cards exist on both left and right
  useEffect(() => {
    const applyInitialScroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: initialOffset,
          animated: false,
        });
        const node = scrollRef.current as any;
        if (node?.getScrollableNode) {
          const dom = node.getScrollableNode();
          if (dom) dom.scrollLeft = initialOffset;
        } else if (node?.scrollLeft !== undefined) {
          node.scrollLeft = initialOffset;
        }
      }
      currentOffsetRef.current = initialOffset;
      setActiveVirtualIndex(middleCycleStart);
      setActiveIndex(0);
    };

    applyInitialScroll();
    const t1 = setTimeout(applyInitialScroll, 60);
    const t2 = setTimeout(applyInitialScroll, 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [initialOffset, middleCycleStart]);

  // Infinite cyclic auto-scroll
  useEffect(() => {
    const autoScrollTimer = setInterval(() => {
      if (isInteracting.current) return;

      const nextVirtualIndex = Math.round(currentOffsetRef.current / TOTAL_ITEM_WIDTH) + 1;
      const targetOffset = nextVirtualIndex * TOTAL_ITEM_WIDTH;

      scrollRef.current?.scrollTo({
        x: targetOffset,
        animated: true,
      });
      currentOffsetRef.current = targetOffset;
      setActiveVirtualIndex(nextVirtualIndex);

      const normalized = nextVirtualIndex % BASE_PROMO_ITEMS.length;
      setActiveIndex(normalized);

      // Silently re-center when drifting near the ends of our repeated array
      if (nextVirtualIndex >= (REPEAT_COUNT - 1) * BASE_PROMO_ITEMS.length) {
        setTimeout(() => {
          const resetIndex = middleCycleStart + normalized;
          const resetOffset = resetIndex * TOTAL_ITEM_WIDTH;
          scrollRef.current?.scrollTo({ x: resetOffset, animated: false });
          currentOffsetRef.current = resetOffset;
          setActiveVirtualIndex(resetIndex);
        }, 600);
      }
    }, 5000);

    return () => clearInterval(autoScrollTimer);
  }, [TOTAL_ITEM_WIDTH, middleCycleStart]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    currentOffsetRef.current = offsetX;

    const virtualIndex = Math.round(offsetX / TOTAL_ITEM_WIDTH);
    if (virtualIndex !== activeVirtualIndex) {
      setActiveVirtualIndex(virtualIndex);
    }
    const normalized = ((virtualIndex % BASE_PROMO_ITEMS.length) + BASE_PROMO_ITEMS.length) % BASE_PROMO_ITEMS.length;
    if (normalized !== activeIndex) {
      setActiveIndex(normalized);
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const virtualIndex = Math.round(offsetX / TOTAL_ITEM_WIDTH);
    const normalized = ((virtualIndex % BASE_PROMO_ITEMS.length) + BASE_PROMO_ITEMS.length) % BASE_PROMO_ITEMS.length;

    // Boundary wrap-around for infinite scroll
    if (virtualIndex <= BASE_PROMO_ITEMS.length || virtualIndex >= (REPEAT_COUNT - 1) * BASE_PROMO_ITEMS.length) {
      const resetIndex = middleCycleStart + normalized;
      const resetOffset = resetIndex * TOTAL_ITEM_WIDTH;
      scrollRef.current?.scrollTo({ x: resetOffset, animated: false });
      currentOffsetRef.current = resetOffset;
      setActiveVirtualIndex(resetIndex);
    } else {
      setActiveVirtualIndex(virtualIndex);
    }

    setTimeout(() => {
      isInteracting.current = false;
    }, 1500);
  };

  const handleBannerPress = (item: PromoBannerItem) => {
    switch (item.ctaAction) {
      case 'membership':
        if (onOpenMembership) {
          onOpenMembership();
        } else if (onPushToast) {
          onPushToast('ILC Obsidian Pass', 'Opening member pass & rewards.');
        }
        break;
      case 'travel':
        if (onOpenTravel) {
          onOpenTravel();
        } else if (onPushToast) {
          onPushToast('Otamigo Transit', 'Opening island transit & ferry booking.');
        }
        break;
      case 'livetv':
        if (onOpenLiveTv) {
          onOpenLiveTv();
        } else if (onPushToast) {
          onPushToast('Live Cultural TV', 'Tuning into 24/7 Island Living Channel.');
        }
        break;
      case 'external':
        if (onPushToast) {
          onPushToast('Partner Privilege', `${item.partnerTag}: 5% member discount applied.`);
        }
        if (item.externalUrl) {
          Linking.openURL(item.externalUrl).catch(() => { });
        }
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.headerLeft}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>
            Offers & Privileges
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: isDark ? 'rgba(255,255,255,0.6)' : '#6C7E72' },
            ]}
          >
            Member perks, transit savings & verified sponsors
          </Text>
        </View>
      </View>

      {/* Infinite Swipable Carousel (Centered Active Card with Peeking Sides) */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={TOTAL_ITEM_WIDTH}
        snapToAlignment="start"
        contentOffset={{ x: initialOffset, y: 0 }}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: SIDE_INSET,
            paddingRight: Math.max(SIDE_INSET - GAP, 10),
          },
        ]}
        onScrollBeginDrag={() => {
          isInteracting.current = true;
        }}
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {INFINITE_ITEMS.map((item, idx) => {
          const isPresent = idx === activeVirtualIndex;
          return (
            <TouchableOpacity
              key={item.virtualKey}
              activeOpacity={0.92}
              onPress={() => handleBannerPress(item)}
              style={[
                styles.bannerCard,
                SHADOWS.card,
                {
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  marginRight: GAP,
                  borderColor: isPresent
                    ? (isDark ? 'rgba(201,220,63,0.60)' : 'rgba(11,106,46,0.45)')
                    : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
                  transform: [{ scale: isPresent ? 1.0 : 0.94 }],
                  opacity: isPresent ? 1 : 0.70,
                },
                Platform.OS === 'web' && ({
                  transition: 'transform 0.35s cubic-bezier(0.2, 0.8, 0.25, 1), opacity 0.35s ease, border-color 0.35s ease',
                  transformOrigin: 'center center',
                } as any),
              ]}
            >
            {/* Background Image */}
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.bannerImage}
              resizeMode="cover"
            />

            {/* Full Dark Overlay covering entire card including top */}
            <View style={styles.fullDarkOverlay} />

            {/* Card Content */}
            <View style={styles.cardContent}>
              {/* Badge + Partner Tag */}
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badgePill,
                    { backgroundColor: item.badgeBg || '#C9DC3F' },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: item.badgeColor || '#06240F' },
                    ]}
                  >
                    {item.badge}
                  </Text>
                </View>

                {item.partnerTag && (
                  <Text style={styles.partnerTagText} numberOfLines={1}>
                    {item.partnerTag}
                  </Text>
                )}
              </View>

              {/* Title & Subtitle */}
              <View style={styles.textCluster}>
                <Text style={styles.bannerTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.bannerSubtitle} numberOfLines={2}>
                  {item.subtitle}
                </Text>
              </View>

              {/* Bottom CTA Row */}
              <View style={styles.bottomRow}>
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaText}>{item.ctaText}</Text>
                  <Feather
                    name="arrow-right"
                    size={12}
                    color="#FFFFFF"
                    style={{ marginLeft: 4 }}
                  />
                </View>

                <View style={styles.watermark}>
                  <Text style={styles.watermarkText}>ILC DIGITAL</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
      </ScrollView>

      {/* Pagination Dot Indicators */}
      <View style={styles.dotsRow}>
        {BASE_PROMO_ITEMS.map((_, idx) => {
          const isActive = idx === activeIndex;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                const targetVirtual = middleCycleStart + idx;
                scrollRef.current?.scrollTo({
                  x: targetVirtual * TOTAL_ITEM_WIDTH,
                  animated: true,
                });
                setActiveVirtualIndex(targetVirtual);
                setActiveIndex(idx);
              }}
              style={[
                styles.dot,
                isActive
                  ? [styles.activeDot, { backgroundColor: isDark ? '#C9DC3F' : '#0B6A2E' }]
                  : [
                    styles.inactiveDot,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.15)',
                    },
                  ],
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    marginBottom: 20,
    marginHorizontal: -20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  headerLeft: {
    flex: 1,
  },
  sectionTitle: {
    ...TYPO.bodyBold,
    fontSize: 16,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    ...TYPO.footnote,
    fontSize: 12,
    marginTop: 1,
  },
  counterPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(201, 220, 63, 0.12)',
  },
  counterText: {
    ...TYPO.micro,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  bannerCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  fullDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 18, 10, 0.76)',
    ...(Platform.OS === 'web'
      ? {
        backgroundImage:
          'linear-gradient(180deg, rgba(4, 18, 10, 0.82) 0%, rgba(4, 18, 10, 0.72) 40%, rgba(4, 18, 10, 0.88) 100%)',
      }
      : {}),
  },
  cardContent: {
    flex: 1,
    padding: 13,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgePill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADII.pill,
  },
  badgeText: {
    ...TYPO.micro,
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  partnerTagText: {
    ...TYPO.micro,
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textCluster: {
    marginVertical: 3,
  },
  bannerTitle: {
    ...TYPO.bodyBold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: -0.4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bannerSubtitle: {
    ...TYPO.footnote,
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 15,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 106, 46, 0.92)',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: RADII.pill,
    borderWidth: 0.8,
    borderColor: 'rgba(201, 220, 63, 0.4)',
  },
  ctaText: {
    ...TYPO.caption,
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  watermark: {
    opacity: 0.5,
  },
  watermarkText: {
    ...TYPO.micro,
    fontSize: 8,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  dot: {
    height: 4.5,
    borderRadius: 2.25,
  },
  activeDot: {
    width: 18,
  },
  inactiveDot: {
    width: 5,
  },
});
