import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { YouTubeEmbed } from './YouTubeEmbed';
import {
  H2,
  MuteText,
  ProtoButton,
} from './PrototypePrimitives';
import {
  MERCHANTS,
  PROTOTYPE_THEMES,
  ThemeMode,
} from '../constants/prototypeTheme';
import { ILC_ORIGINALS_CATALOG } from './OriginalsPosterCard';
import { FONT_STACK } from '../constants/uiTokens';
import { YouTubeVideoItem } from '@ilc/shared';

interface YouTubePlayerModalProps {
  theme: ThemeMode;
  video: YouTubeVideoItem | null;
  onClose: () => void;
  onSelectVideo?: (video: YouTubeVideoItem) => void;
  onOpenFullscreenQr?: (merchantName?: string) => void;
  onPushToast?: (title: string, msg: string) => void;
}

export const YouTubePlayerModal: React.FC<YouTubePlayerModalProps> = ({
  theme,
  video,
  onClose,
  onSelectVideo,
  onOpenFullscreenQr,
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';

  // Dynamic Merchant partner for this video
  const matchedMerchant =
    MERCHANTS.find((m) =>
      video?.title.toLowerCase().includes(m.n.toLowerCase().split(' ')[0]) ||
      video?.title.toLowerCase().includes(m.c.toLowerCase())
    ) || MERCHANTS[1]; // Defaults to Punta Taza Grill

  // Merchant Feedback State
  const [partnerRating, setPartnerRating] = useState(5);
  const [partnerFeedback, setPartnerFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Vibrant Festival Feed',
    'Great Partner Discount',
  ]);
  const [partnerReviews, setPartnerReviews] = useState([
    {
      name: 'Carlo S. (Verified Member)',
      stars: 5,
      date: 'Yesterday',
      text: 'Flawless festival coverage! Partner pass gave us 10% off at the festival hotel.',
    },
    {
      name: 'Grace D.',
      stars: 5,
      date: '3 days ago',
      text: 'Super convenient to view live festival moments with verified local dining perks.',
    },
  ]);

  if (!video) return null;

  const isShort = !!video.isShort;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = () => {
    if (!partnerFeedback.trim()) {
      onPushToast?.('Review Required', 'Please share a quick review.');
      return;
    }
    const newRev = {
      name: 'You (Verified Viewer)',
      stars: partnerRating,
      date: 'Just now',
      text: partnerFeedback.trim(),
    };
    setPartnerReviews((prev) => [newRev, ...prev]);
    setPartnerFeedback('');
    onPushToast?.('Review Submitted', `Thank you for reviewing ${matchedMerchant.n}!`);
  };

  const handleOpenExternal = () => {
    if (video.videoUrl) {
      Linking.openURL(video.videoUrl).catch((err) =>
        console.warn('Failed to open YouTube URL:', err)
      );
    }
  };

  // Grab-style recommendations
  const recommendedOriginals = ILC_ORIGINALS_CATALOG.slice(0, 4);

  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor: t.sheetBg,
        },
      ]}
    >
      {/* Top Header Bar */}
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.pillBadge,
              { backgroundColor: isShort ? '#FF0050' : '#C9DC3F' },
            ]}
          >
            <Text
              style={[
                styles.pillBadgeText,
                { color: isShort ? '#FFFFFF' : '#04150B' },
              ]}
            >
              {isShort ? 'YouTube Short' : 'Island Living Channel'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={[
            styles.closeCircle,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={18} color={t.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Embedded Official YouTube Player */}
        <View
          style={[
            styles.playerContainer,
            isShort ? styles.shortsPlayerAspect : styles.videoPlayerAspect,
            Platform.OS === 'web' &&
              ({
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              } as any),
          ]}
        >
          <YouTubeEmbed
            embedUrl={video.embedUrl}
            title={video.title}
            aspectRatio={isShort ? 9 / 16 : 16 / 9}
            autoPlay
          />
        </View>

        {/* Video Title & Meta */}
        <H2 theme={theme} style={styles.title}>
          {video.title}
        </H2>

        <MuteText theme={theme} style={styles.metaText}>
          {video.durationFormatted ? `${video.durationFormatted} · ` : ''}
          Published {new Date(video.publishedAt).toLocaleDateString()} · Island Living Channel
        </MuteText>

        {video.description ? (
          <Text style={[styles.description, { color: isDark ? 'rgba(255,255,255,0.72)' : 'rgba(20,31,24,0.75)' }]}>
            {video.description}
          </Text>
        ) : null}

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.ytExternalBtn,
              {
                backgroundColor: 'rgba(239, 68, 68, 0.14)',
                borderColor: 'rgba(239, 68, 68, 0.35)',
              },
            ]}
            onPress={handleOpenExternal}
            activeOpacity={0.75}
          >
            <Ionicons name="logo-youtube" size={15} color="#EF4444" />
            <Text style={styles.ytExternalBtnText}>Open in YouTube</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modalCloseBtn,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
            onPress={onClose}
            activeOpacity={0.75}
          >
            <Text style={[styles.modalCloseBtnText, { color: t.ink }]}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* =================================================================
         * 1. FEATURED PARTNER MERCHANT & HOST LGU PRIVILEGE CARD
         * =============================================================== */}
        <View
          style={[
            styles.partnerCard,
            {
              backgroundColor: isDark ? 'rgba(12, 32, 21, 0.88)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: isDark ? 'rgba(201, 220, 63, 0.35)' : 'rgba(11, 106, 46, 0.2)',
            },
            Platform.OS === 'web' &&
              ({
                boxShadow: isDark
                  ? '0 12px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.12)'
                  : '0 6px 20px rgba(0, 0, 0, 0.06)',
              } as any),
          ]}
        >
          {/* Top Row: Partner Badge & Rating */}
          <View style={styles.partnerTopRow}>
            <View style={styles.partnerBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#C9DC3F" />
              <Text style={styles.partnerBadgeText}>FEATURED ISLAND PARTNER</Text>
            </View>
            <View style={styles.ratingCluster}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={[styles.ratingNumber, { color: t.ink }]}>4.9 (210 reviews)</Text>
            </View>
          </View>

          {/* Merchant Info */}
          <View style={{ gap: 3 }}>
            <Text style={[styles.merchantName, { color: t.ink }]}>
              {matchedMerchant.n}
            </Text>
            <Text style={[styles.merchantSub, { color: isDark ? '#6EE7B7' : '#0B6A2E' }]}>
              {matchedMerchant.t.toUpperCase()} · {matchedMerchant.c.toUpperCase()}
            </Text>
            <Text style={[styles.merchantDesc, { color: isDark ? '#A1A1AA' : '#52525B' }]}>
              {matchedMerchant.description}
            </Text>
          </View>

          {/* Offer Pill */}
          <View
            style={[
              styles.offerPillBanner,
              {
                backgroundColor: isDark ? 'rgba(201, 220, 63, 0.14)' : 'rgba(11, 106, 46, 0.1)',
                borderColor: isDark ? 'rgba(201, 220, 63, 0.3)' : 'rgba(11, 106, 46, 0.2)',
              },
            ]}
          >
            <Ionicons name="pricetag" size={13} color={isDark ? '#C9DC3F' : '#0B6A2E'} />
            <Text style={[styles.offerPillText, { color: isDark ? '#C9DC3F' : '#0B6A2E' }]}>
              {matchedMerchant.offer}
            </Text>
          </View>

          {/* QR Pass Trigger Button */}
          <TouchableOpacity
            style={[
              styles.showCashierQrBtn,
              { backgroundColor: isDark ? '#C9DC3F' : '#0B6A2E' },
            ]}
            onPress={() => onOpenFullscreenQr?.(matchedMerchant.n)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="qr-code-outline"
              size={15}
              color={isDark ? '#04150B' : '#FFFFFF'}
            />
            <Text style={[styles.showCashierQrBtnText, { color: isDark ? '#04150B' : '#FFFFFF' }]}>
              Show Cashier QR Pass
            </Text>
            <Feather
              name="arrow-up-right"
              size={13}
              color={isDark ? '#04150B' : '#FFFFFF'}
            />
          </TouchableOpacity>

          {/* Partner Feedback & Review Box */}
          <View
            style={[
              styles.feedbackBox,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <Text style={[styles.feedbackTitle, { color: t.ink }]}>
              Rate your experience at {matchedMerchant.n}
            </Text>
            <Text style={[styles.feedbackSub, { color: t.mute }]}>
              Visited this merchant? Leave feedback for the ILC community:
            </Text>

            {/* Stars */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setPartnerRating(s)}
                  activeOpacity={0.7}
                  style={styles.starTouch}
                >
                  <Text
                    style={[
                      styles.starChar,
                      { color: s <= partnerRating ? '#F2A65A' : (isDark ? 'rgba(255,255,255,0.2)' : '#D1D5DB') },
                    ]}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
              <Text style={[styles.ratingScore, { color: t.ink }]}>
                {partnerRating}.0 / 5.0
              </Text>
            </View>

            {/* Quick Tag Chips */}
            <View style={styles.tagsContainer}>
              {[
                'Vibrant Festival Feed',
                'Friendly Service',
                'Fast QR Scan',
                'Scenic Location',
                '10% Off Applied',
              ].map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagChip,
                      {
                        backgroundColor: isSelected
                          ? (isDark ? 'rgba(201, 220, 63, 0.2)' : 'rgba(11, 106, 46, 0.12)')
                          : (isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'),
                        borderColor: isSelected
                          ? (isDark ? '#C9DC3F' : '#0B6A2E')
                          : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'),
                      },
                    ]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        {
                          color: isSelected
                            ? (isDark ? '#C9DC3F' : '#0B6A2E')
                            : (isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(20, 31, 24, 0.65)'),
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Input & Submit */}
            <TextInput
              style={[
                styles.feedbackInput,
                {
                  color: t.ink,
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
                },
              ]}
              value={partnerFeedback}
              onChangeText={setPartnerFeedback}
              placeholder={`Share your review for ${matchedMerchant.n}...`}
              placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.35)' : '#9CA3AF'}
              multiline
              numberOfLines={2}
            />

            <TouchableOpacity
              style={[
                styles.submitReviewButton,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)' },
              ]}
              onPress={handleSubmitReview}
              activeOpacity={0.75}
            >
              <Text style={[styles.submitReviewButtonText, { color: t.ink }]}>
                Submit Partner Review
              </Text>
            </TouchableOpacity>

            {/* Reviews Mini-List */}
            <View style={styles.miniReviewsList}>
              <Text style={[styles.miniReviewsHeader, { color: t.mute }]}>
                VERIFIED MEMBER REVIEWS
              </Text>
              {partnerReviews.slice(0, 2).map((rev, revIdx) => (
                <View
                  key={revIdx}
                  style={[
                    styles.miniReviewCard,
                    { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' },
                  ]}
                >
                  <View style={styles.miniReviewTop}>
                    <Text style={[styles.miniReviewAuthor, { color: t.ink }]}>
                      {rev.name}
                    </Text>
                    <Text style={styles.miniReviewStars}>
                      {'★'.repeat(rev.stars)}
                    </Text>
                  </View>
                  <Text style={[styles.miniReviewText, { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(20, 31, 24, 0.7)' }]}>
                    "{rev.text}"
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* =================================================================
         * 2. "YOU MIGHT ALSO LIKE" (Grab-Style Recommendations & Cards)
         * =============================================================== */}
        <View style={styles.recommendSection}>
          <View style={{ gap: 2 }}>
            <Text style={[styles.recommendTitle, { color: t.ink }]}>
              You Might Also Like
            </Text>
            <Text style={[styles.recommendSub, { color: t.mute }]}>
              Popular festival broadcasts & verified island perks
            </Text>
          </View>

          {/* Horizontal Grab-Style Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendCardsRow}
          >
            {recommendedOriginals.map((recItem, rIdx) => {
              const perks = [
                '10% OFF Dining at Punta Taza',
                'Free Piaya with Coffee at Harbor Roast',
                '5% OFF Suite at Sugarlands Inn',
                'Complimentary Drink at Calea',
              ];
              const perk = perks[rIdx % perks.length];

              return (
                <TouchableOpacity
                  key={recItem.id}
                  style={[
                    styles.recommendCard,
                    {
                      backgroundColor: isDark ? 'rgba(12, 28, 20, 0.90)' : 'rgba(255, 255, 255, 0.95)',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                    },
                  ]}
                  onPress={() => {
                    if (onSelectVideo) {
                      onSelectVideo({
                        id: recItem.id,
                        title: recItem.title,
                        description: 'Official Island Living Channel broadcast.',
                        thumbnailUrl: recItem.imageUrl,
                        videoUrl: recItem.embedUrl || '',
                        embedUrl: recItem.embedUrl || '',
                        durationFormatted: recItem.duration,
                        publishedAt: new Date().toISOString(),
                        isShort: false,
                      });
                    }
                  }}
                  activeOpacity={0.82}
                >
                  <View style={styles.recommendThumbWrap}>
                    <Image
                      source={{ uri: recItem.imageUrl }}
                      style={styles.recommendThumb}
                      resizeMode="cover"
                    />
                    <View style={styles.recommendBadge}>
                      <Text style={styles.recommendBadgeText}>{recItem.duration}</Text>
                    </View>
                    <View style={styles.recommendPlayIcon}>
                      <Ionicons name="play" size={13} color="#FFFFFF" />
                    </View>
                  </View>

                  <View style={styles.recommendBody}>
                    <Text
                      style={[styles.recommendCardTitle, { color: t.ink }]}
                      numberOfLines={1}
                    >
                      {recItem.title}
                    </Text>

                    {/* Perk Pill */}
                    <View
                      style={[
                        styles.recommendPerkPill,
                        {
                          backgroundColor: isDark
                            ? 'rgba(201, 220, 63, 0.12)'
                            : 'rgba(11, 106, 46, 0.08)',
                        },
                      ]}
                    >
                      <Ionicons
                        name="gift-outline"
                        size={10.5}
                        color={isDark ? '#C9DC3F' : '#0B6A2E'}
                      />
                      <Text
                        style={[
                          styles.recommendPerkText,
                          { color: isDark ? '#C9DC3F' : '#0B6A2E' },
                        ]}
                        numberOfLines={1}
                      >
                        {perk}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    paddingTop: Platform.OS === 'ios' ? 44 : 14,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillBadge: {
    paddingVertical: 3.5,
    paddingHorizontal: 8,
    borderRadius: 99,
  },
  pillBadgeText: {
    fontFamily: FONT_STACK,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  closeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
    gap: 12,
  },
  playerContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  videoPlayerAspect: {
    aspectRatio: 16 / 9,
  },
  shortsPlayerAspect: {
    height: 440,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT_STACK,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  metaText: {
    fontFamily: FONT_STACK,
    fontSize: 12,
    marginTop: -4,
  },
  description: {
    fontFamily: FONT_STACK,
    fontSize: 13,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  ytExternalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  ytExternalBtnText: {
    fontFamily: FONT_STACK,
    color: '#EF4444',
    fontSize: 12.5,
    fontWeight: '700',
  },
  modalCloseBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalCloseBtnText: {
    fontFamily: FONT_STACK,
    fontSize: 12.5,
    fontWeight: '700',
  },
  /* Featured Partner & LGU Privilege Card */
  partnerCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    marginTop: 6,
  },
  partnerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(201, 220, 63, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  partnerBadgeText: {
    fontFamily: FONT_STACK,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#C9DC3F',
  },
  ratingCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingStar: {
    color: '#F2A65A',
    fontSize: 12,
  },
  ratingNumber: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    fontWeight: '600',
  },
  merchantName: {
    fontFamily: FONT_STACK,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  merchantSub: {
    fontFamily: FONT_STACK,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  merchantDesc: {
    fontFamily: FONT_STACK,
    fontSize: 12.5,
    lineHeight: 17,
  },
  offerPillBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  offerPillText: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
    fontWeight: '700',
    flex: 1,
  },
  showCashierQrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  showCashierQrBtnText: {
    fontFamily: FONT_STACK,
    fontSize: 12.5,
    fontWeight: '700',
  },
  /* Feedback Box */
  feedbackBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 8,
    marginTop: 4,
  },
  feedbackTitle: {
    fontFamily: FONT_STACK,
    fontSize: 13.5,
    fontWeight: '700',
  },
  feedbackSub: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    marginTop: -4,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  starTouch: {
    padding: 2,
  },
  starChar: {
    fontSize: 22,
  },
  ratingScore: {
    fontFamily: FONT_STACK,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 2,
  },
  tagChip: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 99,
    borderWidth: 1,
  },
  tagChipText: {
    fontFamily: FONT_STACK,
    fontSize: 10.5,
  },
  feedbackInput: {
    fontFamily: FONT_STACK,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    fontSize: 12,
    minHeight: 46,
    textAlignVertical: 'top',
  },
  submitReviewButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  submitReviewButtonText: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
    fontWeight: '700',
  },
  miniReviewsList: {
    gap: 6,
    marginTop: 4,
  },
  miniReviewsHeader: {
    fontFamily: FONT_STACK,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  miniReviewCard: {
    borderTopWidth: 1,
    paddingTop: 6,
    gap: 2,
  },
  miniReviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniReviewAuthor: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
    fontWeight: '700',
  },
  miniReviewStars: {
    color: '#F2A65A',
    fontSize: 10,
  },
  miniReviewText: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    lineHeight: 15,
  },
  /* Grab Recommendations */
  recommendSection: {
    gap: 10,
    marginTop: 8,
  },
  recommendTitle: {
    fontFamily: FONT_STACK,
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  recommendSub: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
  },
  recommendCardsRow: {
    gap: 12,
    paddingRight: 16,
  },
  recommendCard: {
    width: 175,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recommendThumbWrap: {
    width: '100%',
    height: 105,
    position: 'relative',
    backgroundColor: '#000000',
  },
  recommendThumb: {
    width: '100%',
    height: '100%',
  },
  recommendBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  recommendBadgeText: {
    fontFamily: FONT_STACK,
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recommendPlayIcon: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendBody: {
    padding: 8,
    gap: 6,
  },
  recommendCardTitle: {
    fontFamily: FONT_STACK,
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  recommendPerkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  recommendPerkText: {
    fontFamily: FONT_STACK,
    fontSize: 9.5,
    fontWeight: '700',
  },
});
