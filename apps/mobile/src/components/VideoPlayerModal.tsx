import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Linking,
  Image,
  TextInput,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { YouTubeEmbed } from './YouTubeEmbed';
import {
  BrandLogo,
  BrandStripe,
  PrototypeQrCode,
  SceneBackground,
} from './PrototypeArtwork';
import {
  FieldLabel,
  H1,
  H2,
  H3,
  MuteText,
  PromoBox,
  ProtoButton,
  ProtoChip,
  ProtoInput,
} from './PrototypePrimitives';
import {
  MERCHANTS,
  NotificationItem,
  PROTOTYPE_THEMES,
  PrototypeMerchant,
  PrototypeTab,
  PrototypeVideo,
  SERIF_FONT,
  ThemeMode,
  VideoCategoryFilter,
  computeMemberId,
} from '../constants/prototypeTheme';
import { ILC_ORIGINALS_CATALOG, OriginalsPosterItem } from './OriginalsPosterCard';
import { FONT_STACK, RADII, TYPO } from '../constants/uiTokens';

/* ============================================================================
 * 1. VIDEO PLAYER SHEET
 * ========================================================================== */
interface PlayerSheetProps {
  theme: ThemeMode;
  video: PrototypeVideo;
  index: number;
  initialProgress?: number;
  onUpdateProgress: (videoId: string, progress: number) => void;
  onClose: () => void;
  onSelectVideo?: (video: PrototypeVideo) => void;
  onOpenFullscreenQr?: (merchantName?: string) => void;
  onPushToast?: (title: string, msg: string) => void;
}

export const PlayerSheet: React.FC<PlayerSheetProps> = ({
  theme,
  video,
  index,
  initialProgress = 0,
  onUpdateProgress,
  onClose,
  onSelectVideo,
  onOpenFullscreenQr,
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(initialProgress || 12);

  // Dynamic Merchant associated with this exclusive video
  const matchedMerchant =
    MERCHANTS.find(
      (m) =>
        video.t.toLowerCase().includes(m.n.toLowerCase().split(' ')[0]) ||
        (video.category && m.t.toLowerCase().includes(video.category.toLowerCase())) ||
        (video.region && m.c.toLowerCase().includes(video.region.toLowerCase()))
    ) || MERCHANTS[1]; // Defaults to Punta Taza Grill (the inasal/dining favorite)

  // Interactive Merchant Feedback state
  const [merchantRating, setMerchantRating] = useState(5);
  const [merchantFeedbackText, setMerchantFeedbackText] = useState('');
  const [selectedMerchantTags, setSelectedMerchantTags] = useState<string[]>(['Authentic Food', '5% Off Applied']);
  const [partnerReviews, setPartnerReviews] = useState([
    {
      name: 'Maria L. (VIP Member)',
      stars: 5,
      date: 'Yesterday',
      text: 'Scanned my ILC digital card at the counter and got 5% off our sunset inasal dinner instantly!',
    },
    {
      name: 'Ramon K.',
      stars: 5,
      date: '3 days ago',
      text: 'The authentic inasal and Guimaras mango salad were incredible. Great travel feature by ILC.',
    },
  ]);

  const toggleMerchantTag = (tag: string) => {
    setSelectedMerchantTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitMerchantReview = () => {
    if (!merchantFeedbackText.trim()) {
      onPushToast?.('Review Required', 'Please share a few words about your experience.');
      return;
    }
    const newRev = {
      name: 'You (Verified Viewer)',
      stars: merchantRating,
      date: 'Just now',
      text: merchantFeedbackText.trim(),
    };
    setPartnerReviews((prev) => [newRev, ...prev]);
    setMerchantFeedbackText('');
    onPushToast?.('Review Submitted', `Thank you for reviewing ${matchedMerchant.n}!`);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaying((currPlaying) => {
        if (currPlaying) {
          setProgress((prev) => Math.min(100, prev + 2));
        }
        return currPlaying;
      });
    }, 350);
    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    onUpdateProgress(video.id, progress);
    onClose();
  };

  const hasEmbed = !!video.embedUrl;
  const isShort = !!video.isShort;

  // Grab-style recommendations excluding currently played video
  const recommendedOriginals = ILC_ORIGINALS_CATALOG.filter(
    (item) => item.title !== video.t
  ).slice(0, 4);

  return (
    <View style={[styles.sheet, { backgroundColor: t.sheetBg, paddingHorizontal: 0, paddingBottom: 0, paddingTop: 0 }]}>
      {/* Top Floating Glass Navigation Header */}
      <View
        style={[
          styles.playerTopBar,
          {
            backgroundColor: isDark ? 'rgba(6, 20, 13, 0.90)' : 'rgba(255, 255, 255, 0.92)',
            borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          },
          Platform.OS === 'web' &&
            ({
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            } as any),
        ]}
      >
        <View style={styles.playerHeaderBadgeRow}>
          <View style={[styles.exclusiveBadgePill, { backgroundColor: '#C9DC3F' }]}>
            <Text style={styles.exclusiveBadgeText}>ILC EXCLUSIVE</Text>
          </View>
          <Text style={[styles.playerHeaderTitle, { color: t.ink }]} numberOfLines={1}>
            {video.t}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleClose}
          style={[
            styles.playerCloseCircle,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
          activeOpacity={0.75}
        >
          <Ionicons name="close" size={18} color={t.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.playerScrollArea}
        contentContainerStyle={styles.playerScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Player */}
        {hasEmbed ? (
          <View
            style={[
              styles.liveBox,
              isShort ? { height: 420, alignItems: 'center', backgroundColor: '#000000' } : { aspectRatio: 16 / 9, height: undefined },
              Platform.OS === 'web' &&
                ({ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' } as any),
            ]}
          >
            <YouTubeEmbed
              embedUrl={video.embedUrl!}
              title={video.t}
              aspectRatio={isShort ? 9 / 16 : 16 / 9}
              autoPlay
            />
          </View>
        ) : (
          <View
            style={[
              styles.liveBox,
              Platform.OS === 'web' &&
                ({ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' } as any),
            ]}
          >
            <SceneBackground index={video.sceneIndex ?? index} style={{ flex: 1 }}>
              <View style={styles.liveCenter}>
                <TouchableOpacity
                  style={[
                    styles.playCircle,
                    Platform.OS === 'web' &&
                      ({ backdropFilter: 'blur(8px)' } as any),
                  ]}
                  onPress={() => setPlaying(!playing)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.playText}>{playing ? '❚❚' : '▶'}</Text>
                </TouchableOpacity>
              </View>
            </SceneBackground>
          </View>
        )}

        {!hasEmbed && (
          <View style={[styles.bar, { backgroundColor: t.line }]}>
            <View
              style={[
                styles.barFill,
                { backgroundColor: t.hib, width: `${progress}%` },
              ]}
            />
          </View>
        )}

        {/* Video Tags & External YouTube Link */}
        <View style={styles.metaChipRow}>
          <View style={[styles.smallTagPill, { backgroundColor: t.tabOnBg }]}>
            <Text style={[styles.smallTagText, { color: t.brand }]}>
              {video.category}
            </Text>
          </View>
          {video.region ? (
            <View style={[styles.smallTagPill, { backgroundColor: t.inputBg }]}>
              <Text style={[styles.smallTagText, { color: t.mute }]}>
                {video.region}
              </Text>
            </View>
          ) : null}
          {video.videoUrl ? (
            <TouchableOpacity
              style={[
                styles.smallTagPill,
                { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: '#ef4444' },
              ]}
              onPress={() => Linking.openURL(video.videoUrl!).catch(() => {})}
            >
              <Text style={[styles.smallTagText, { color: '#ef4444', fontWeight: '700' }]}>
                Watch on YouTube ↗
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Video Title & Synopsis */}
        <View style={{ gap: 4 }}>
          <H2 theme={theme} style={{ marginTop: 2, marginBottom: 0 }}>
            {video.t}
          </H2>
          <MuteText theme={theme}>
            {video.m} · Island Living Channel Network
          </MuteText>
          <Text
            style={[
              styles.playerSynopsisText,
              { color: isDark ? 'rgba(255, 255, 255, 0.72)' : 'rgba(20, 31, 24, 0.75)' },
            ]}
          >
            Hop between hidden lagoons, limestone sanctuaries, and local coastal food spots mapped by Visayan islanders for generations.
          </Text>
        </View>

        {/* =================================================================
         * 1. FEATURED PARTNER MERCHANT & PRIVILEGES CARD
         * =============================================================== */}
        <View
          style={[
            styles.partnerMerchantCard,
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
          {/* Top row: Badge & Verified Tag */}
          <View style={styles.partnerCardTopRow}>
            <View style={styles.partnerBadgeTag}>
              <Ionicons name="sparkles" size={11} color="#C9DC3F" />
              <Text style={styles.partnerBadgeTagText}>FEATURED ISLAND PARTNER</Text>
            </View>
            <View style={styles.partnerRatingTag}>
              <Text style={styles.partnerRatingStar}>★</Text>
              <Text style={[styles.partnerRatingValue, { color: t.ink }]}>4.9 (184 reviews)</Text>
            </View>
          </View>

          {/* Merchant Name & Description */}
          <View style={{ gap: 3 }}>
            <Text style={[styles.partnerMerchantTitle, { color: t.ink }]}>
              {matchedMerchant.n}
            </Text>
            <Text style={[styles.partnerMerchantCity, { color: isDark ? '#6EE7B7' : '#0B6A2E' }]}>
              {matchedMerchant.t.toUpperCase()} · {matchedMerchant.c.toUpperCase()}
            </Text>
            <Text style={[styles.partnerMerchantDesc, { color: isDark ? '#A1A1AA' : '#52525B' }]}>
              {matchedMerchant.description}
            </Text>
          </View>

          {/* Member Offer Pill */}
          <View
            style={[
              styles.partnerOfferBanner,
              {
                backgroundColor: isDark ? 'rgba(201, 220, 63, 0.14)' : 'rgba(11, 106, 46, 0.1)',
                borderColor: isDark ? 'rgba(201, 220, 63, 0.3)' : 'rgba(11, 106, 46, 0.2)',
              },
            ]}
          >
            <Ionicons name="pricetag" size={13} color={isDark ? '#C9DC3F' : '#0B6A2E'} />
            <Text style={[styles.partnerOfferText, { color: isDark ? '#C9DC3F' : '#0B6A2E' }]}>
              {matchedMerchant.offer}
            </Text>
          </View>

          {/* View Cashier QR Pass Button */}
          <TouchableOpacity
            style={[
              styles.showQrPassBtn,
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
            <Text style={[styles.showQrPassBtnText, { color: isDark ? '#04150B' : '#FFFFFF' }]}>
              Show Cashier QR Pass
            </Text>
            <Feather
              name="arrow-up-right"
              size={13}
              color={isDark ? '#04150B' : '#FFFFFF'}
            />
          </TouchableOpacity>

          {/* -----------------------------------------------------------------
           * INTERACTIVE PARTNER FEEDBACK & RATING (Inside Exclusive)
           * --------------------------------------------------------------- */}
          <View
            style={[
              styles.partnerFeedbackBox,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            ]}
          >
            <Text style={[styles.feedbackSectionTitle, { color: t.ink }]}>
              Rate your experience at {matchedMerchant.n}
            </Text>
            <Text style={[styles.feedbackSectionSub, { color: t.mute }]}>
              Visited this partner? Help other ILC members with your review:
            </Text>

            {/* Interactive Stars */}
            <View style={styles.interactiveStarsRow}>
              {[1, 2, 3, 4, 5].map((starNum) => (
                <TouchableOpacity
                  key={starNum}
                  onPress={() => setMerchantRating(starNum)}
                  activeOpacity={0.7}
                  style={styles.starTouchItem}
                >
                  <Text
                    style={[
                      styles.starSymbol,
                      { color: starNum <= merchantRating ? '#F2A65A' : (isDark ? 'rgba(255,255,255,0.2)' : '#D1D5DB') },
                    ]}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
              <Text style={[styles.starRatingScoreLabel, { color: t.ink }]}>
                {merchantRating}.0 / 5.0
              </Text>
            </View>

            {/* Quick Feedback Chips */}
            <View style={styles.quickTagsWrap}>
              {[
                'Authentic Food',
                'Friendly Crew',
                'Fast QR Scan',
                'Scenic Sunset',
                '5% Off Applied',
              ].map((tag) => {
                const isSelected = selectedMerchantTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.quickTagPill,
                      {
                        backgroundColor: isSelected
                          ? (isDark ? 'rgba(201, 220, 63, 0.2)' : 'rgba(11, 106, 46, 0.12)')
                          : (isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'),
                        borderColor: isSelected
                          ? (isDark ? '#C9DC3F' : '#0B6A2E')
                          : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'),
                      },
                    ]}
                    onPress={() => toggleMerchantTag(tag)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.quickTagText,
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

            {/* Review Input */}
            <TextInput
              style={[
                styles.merchantTextInput,
                {
                  color: t.ink,
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
                },
              ]}
              value={merchantFeedbackText}
              onChangeText={setMerchantFeedbackText}
              placeholder={`Write a review for ${matchedMerchant.n}...`}
              placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.35)' : '#9CA3AF'}
              multiline
              numberOfLines={2}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitReviewBtn,
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)' },
              ]}
              onPress={handleSubmitMerchantReview}
              activeOpacity={0.75}
            >
              <Text style={[styles.submitReviewBtnText, { color: t.ink }]}>
                Submit Partner Review
              </Text>
            </TouchableOpacity>

            {/* Community Reviews Mini-Feed */}
            <View style={styles.communityReviewsWrap}>
              <Text style={[styles.communityReviewsHeader, { color: t.mute }]}>
                RECENT MEMBER REVIEWS
              </Text>
              {partnerReviews.slice(0, 2).map((rev, revIdx) => (
                <View
                  key={revIdx}
                  style={[
                    styles.communityReviewCard,
                    { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' },
                  ]}
                >
                  <View style={styles.communityReviewAuthorRow}>
                    <Text style={[styles.communityReviewAuthor, { color: t.ink }]}>
                      {rev.name}
                    </Text>
                    <Text style={styles.communityReviewStars}>
                      {'★'.repeat(rev.stars)}
                    </Text>
                  </View>
                  <Text style={[styles.communityReviewComment, { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(20, 31, 24, 0.7)' }]}>
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
        <View style={styles.grabRecommendContainer}>
          <View style={styles.grabRecommendHeaderRow}>
            <View>
              <Text style={[styles.grabRecommendMainTitle, { color: t.ink }]}>
                You Might Also Like
              </Text>
              <Text style={[styles.grabRecommendSubtitle, { color: t.mute }]}>
                Curated island series & affiliated partner perks for you
              </Text>
            </View>
          </View>

          {/* Horizontal Grab-Style Cards Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.grabHorizontalList}
          >
            {recommendedOriginals.map((item, itemIdx) => {
              // Corresponding merchant perk for each recommendation
              const perkLabels = [
                '10% OFF Dining at Punta Taza',
                'Free Piaya with Coffee at Harbor Roast',
                '5% OFF Suite at Sugarlands Inn',
                'Complimentary Welcome Drink at Calea',
              ];
              const perk = perkLabels[itemIdx % perkLabels.length];

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.grabRecommendCard,
                    {
                      backgroundColor: isDark ? 'rgba(12, 28, 20, 0.90)' : 'rgba(255, 255, 255, 0.95)',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                    },
                  ]}
                  onPress={() => {
                    if (onSelectVideo) {
                      onSelectVideo({
                        id: item.id,
                        t: item.title,
                        m: item.duration,
                        embedUrl: item.embedUrl,
                        category: 'Originals',
                      });
                    }
                  }}
                  activeOpacity={0.82}
                >
                  <View style={styles.grabCardImageWrap}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.grabCardImage}
                      resizeMode="cover"
                    />
                    <View style={styles.grabDurationBadge}>
                      <Text style={styles.grabDurationText}>{item.duration}</Text>
                    </View>
                    <View style={styles.grabPlayFloatingIcon}>
                      <Ionicons name="play" size={14} color="#FFFFFF" />
                    </View>
                  </View>

                  <View style={styles.grabCardBody}>
                    <Text
                      style={[styles.grabCardTitle, { color: t.ink }]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>

                    {/* Associated Merchant Perk Pill */}
                    <View
                      style={[
                        styles.grabPerkPill,
                        {
                          backgroundColor: isDark
                            ? 'rgba(201, 220, 63, 0.12)'
                            : 'rgba(11, 106, 46, 0.08)',
                        },
                      ]}
                    >
                      <Ionicons
                        name="gift-outline"
                        size={11}
                        color={isDark ? '#C9DC3F' : '#0B6A2E'}
                      />
                      <Text
                        style={[
                          styles.grabPerkPillText,
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

        {/* Bottom Action: Close & Return */}
        <TouchableOpacity
          style={[
            styles.bottomCloseReturnBtn,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
          onPress={handleClose}
          activeOpacity={0.75}
        >
          <Text style={[styles.bottomCloseReturnText, { color: t.ink }]}>
            Close & Return to Browse
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

/* ============================================================================
 * 2. REGISTRATION SHEET
 * ========================================================================== */
interface RegisterSheetProps {
  theme: ThemeMode;
  onRegister: (name: string, email: string, isGoogle: boolean) => void;
  onCancel: () => void;
}

export const RegisterSheet: React.FC<RegisterSheetProps> = ({
  theme,
  onRegister,
  onCancel,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View style={[styles.sheet, { backgroundColor: t.sheetBg }]}>
      <H1 theme={theme}>Create your free account</H1>
      <MuteText theme={theme} style={{ marginBottom: 6 }}>
        You’ll get a digital membership card and a welcome gift right away.
      </MuteText>

      <FieldLabel theme={theme}>Full name</FieldLabel>
      <ProtoInput
        theme={theme}
        value={name}
        onChangeText={setName}
        placeholder="Juan dela Cruz"
      />

      <FieldLabel theme={theme}>Email</FieldLabel>
      <ProtoInput
        theme={theme}
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
      />

      <ProtoButton
        theme={theme}
        label="Create account"
        full
        onPress={() => onRegister(name, email, false)}
        style={{ marginBottom: 6 }}
      />

      <ProtoButton
        theme={theme}
        alt
        full
        label="Continue with Google"
        onPress={() => onRegister(name, email, true)}
      />

      <ProtoChip
        theme={theme}
        label="Not now"
        onPress={onCancel}
        style={{ alignSelf: 'center', marginTop: 8 }}
      />
    </View>
  );
};

/* ============================================================================
 * 3. ONBOARDING SCREEN (Editorial Welcome & Free Sign-Up)
 * ========================================================================== */
interface OnboardingSheetProps {
  theme: ThemeMode;
  giftText: string;
  onRegister: (name: string, email: string, isGoogle: boolean) => void;
  onSkip: () => void;
}

const ONBOARDING_STEPS = [
  {
    number: '01',
    label: 'Watch',
    scene: 0,
    caption: 'Bacolod · Iloilo · Cebu · Boracay',
    title: 'Stories from the islands, wherever you land.',
    subtitle:
      'From airport arrival gates to your hotel room—stream original Philippine travel films, food trails, and our 24/7 live channel.',
  },
  {
    number: '02',
    label: 'Rewards',
    scene: 4,
    caption: 'Digital Member Card',
    title: 'One card for island cafés, dining & stays.',
    subtitle:
      'Members receive a complimentary welcome coffee and 5% off at partner restaurants, cafés, and resorts—just show your QR code.',
  },
  {
    number: '03',
    label: 'Book',
    scene: 2,
    caption: 'In partnership with Otamigo',
    title: 'Plan flights, ferries, and coastal stays.',
    subtitle:
      'Search inter-island flights, fastcraft schedules, and curated hotels in one place, with member perks applied.',
  },
];

export const OnboardingSheet: React.FC<OnboardingSheetProps> = ({
  theme,
  giftText,
  onRegister,
  onSkip,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const isSignUpStep = step >= ONBOARDING_STEPS.length;
  const currentSlide =
    ONBOARDING_STEPS[Math.min(step, ONBOARDING_STEPS.length - 1)];

  return (
    <View style={[styles.onboardScreen, { backgroundColor: t.phoneBg }]}>
      {/* Minimal Header: Logo + Plain Text Skip */}
      <View style={styles.onboardTopBar}>
        <BrandLogo small theme={theme} />
        <TouchableOpacity
          onPress={onSkip}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.skipText, { color: t.mute }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.onboardBodyScroll}
        contentContainerStyle={styles.onboardBodyContent}
        showsVerticalScrollIndicator={false}
      >
        {!isSignUpStep ? (
          <View style={styles.onboardSlideContainer}>
            {/* Uncluttered Editorial Artwork */}
            <SceneBackground
              index={currentSlide.scene}
              overlayGradient="hero"
              style={styles.onboardHero}
            >
              <Text style={styles.onboardHeroCaption}>
                {currentSlide.number} — {currentSlide.label} ·{' '}
                {currentSlide.caption}
              </Text>
            </SceneBackground>

            {/* Editorial Headline & Calm Body Copy */}
            <View style={styles.onboardTextSection}>
              <Text
                style={[
                  styles.onboardMainTitle,
                  { color: t.ink, fontFamily: SERIF_FONT },
                ]}
              >
                {currentSlide.title}
              </Text>
              <MuteText theme={theme} style={styles.onboardDesc}>
                {currentSlide.subtitle}
              </MuteText>
            </View>
          </View>
        ) : (
          /* Step 4: Clean Editorial Sign-Up */
          <View style={styles.onboardSlideContainer}>
            <Text style={[styles.onboardEyebrow, { color: t.brand }]}>
              Free Membership
            </Text>
            <Text
              style={[
                styles.onboardMainTitle,
                { color: t.ink, fontFamily: SERIF_FONT },
              ]}
            >
              Join Island Living
            </Text>
            <MuteText theme={theme} style={styles.onboardDesc}>
              Create a free account to unlock your digital member QR card, 5%
              partner discount, and welcome gift ({giftText.toLowerCase()}).
            </MuteText>

            <View style={{ marginTop: 22 }}>
              <FieldLabel theme={theme}>Full name</FieldLabel>
              <ProtoInput
                theme={theme}
                value={name}
                onChangeText={setName}
                placeholder="Juan dela Cruz"
              />

              <FieldLabel theme={theme}>Email</FieldLabel>
              <ProtoInput
                theme={theme}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
              />

              <ProtoButton
                theme={theme}
                label="Create free account"
                full
                onPress={() => onRegister(name, email, false)}
                style={{ marginTop: 6, marginBottom: 8 }}
              />

              <ProtoButton
                theme={theme}
                alt
                full
                label="Continue with Google"
                onPress={() => onRegister(name, email, true)}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Minimal Bottom Bar: Subtle Dots + Clean Action */}
      <View style={styles.onboardBottomFooter}>
        <View style={styles.onboardDotsRow}>
          {[0, 1, 2, 3].map((idx) => {
            const active = step === idx;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setStep(idx)}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                style={[
                  styles.onboardDot,
                  {
                    width: active ? 20 : 6,
                    backgroundColor: active ? t.brand : t.line,
                  },
                ]}
              />
            );
          })}
        </View>

        {!isSignUpStep ? (
          <ProtoButton
            theme={theme}
            label={step < ONBOARDING_STEPS.length - 1 ? 'Next' : 'Get started'}
            full
            onPress={() => setStep(step + 1)}
          />
        ) : (
          <TouchableOpacity
            style={styles.onboardGuestLink}
            onPress={() => setStep(0)}
            activeOpacity={0.7}
          >
            <Text style={[styles.onboardGuestLinkText, { color: t.mute }]}>
              Back to overview
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/* ============================================================================
 * 4. MERCHANT DETAIL PAGE SHEET
 * ========================================================================== */
interface MerchantDetailSheetProps {
  theme: ThemeMode;
  merchant: PrototypeMerchant;
  isRegistered: boolean;
  onClose: () => void;
  onShowCashierQr: (merchantName: string) => void;
  onOpenRegister: () => void;
}

export const MerchantDetailSheet: React.FC<MerchantDetailSheetProps> = ({
  theme,
  merchant,
  isRegistered,
  onClose,
  onShowCashierQr,
  onOpenRegister,
}) => {
  const t = PROTOTYPE_THEMES[theme];

  return (
    <ScrollView
      style={[styles.sheetScroll, { backgroundColor: t.sheetBg }]}
      contentContainerStyle={styles.sheetScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={[styles.backBtn, { borderColor: t.line, backgroundColor: t.inputBg }]}
        onPress={onClose}
        activeOpacity={0.8}
      >
        <Feather name="arrow-left" size={16} color={t.ink} />
        <Text style={[styles.backBtnText, { color: t.ink }]}>
          Back to Rewards
        </Text>
      </TouchableOpacity>

      <SceneBackground
        index={merchant.sceneIndex}
        overlayGradient="hero"
        style={styles.merchantHero}
      >
        <View style={styles.merchantHeroInner}>
          <View style={styles.onboardBadge}>
            <Text style={styles.onboardBadgeText}>
              {merchant.t.toUpperCase()} · {merchant.c.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.onboardHeroTitle, { fontFamily: SERIF_FONT }]}>
            {merchant.n}
          </Text>
        </View>
      </SceneBackground>

      <MuteText theme={theme} style={{ marginTop: 14, fontSize: 14 }}>
        {merchant.description}
      </MuteText>

      {/* 5% Member Card Offer Box */}
      <PromoBox theme={theme} style={{ marginTop: 16 }}>
        <View style={styles.offerHeaderRow}>
          <Feather name="percent" size={16} color={t.brand} />
          <Text style={[styles.offerBadgeTitle, { color: t.brand }]}>
            ILC MEMBER CARD OFFER · 5% OFF
          </Text>
        </View>
        <H3 theme={theme} style={{ marginTop: 4, marginBottom: 6 }}>
          {merchant.offer}
        </H3>
        <MuteText theme={theme} style={{ marginBottom: 12 }}>
          Present your fullscreen QR code to the cashier before payment.
        </MuteText>
        <ProtoButton
          theme={theme}
          label={
            isRegistered
              ? 'Show card (Fullscreen QR)'
              : 'Create free account to unlock 5% off'
          }
          full
          onPress={() => {
            if (isRegistered) {
              onShowCashierQr(merchant.n);
            } else {
              onOpenRegister();
            }
          }}
        />
      </PromoBox>

      {/* Address & Hours Details */}
      <View
        style={[
          styles.infoCard,
          { backgroundColor: t.inputBg, borderColor: t.line },
        ]}
      >
        <View style={[styles.infoRow, { borderBottomColor: t.line }]}>
          <Feather name="map-pin" size={16} color={t.brand} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoLabel, { color: t.mute }]}>Address</Text>
            <Text style={[styles.infoValue, { color: t.ink }]}>
              {merchant.address}
            </Text>
          </View>
        </View>

        <View style={styles.infoRowLast}>
          <Feather name="clock" size={16} color={t.brand} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoLabel, { color: t.mute }]}>
              Operating Hours
            </Text>
            <Text style={[styles.infoValue, { color: t.ink }]}>
              {merchant.hours}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

/* ============================================================================
 * 5. FULLSCREEN CASHIER QR MODAL
 * ========================================================================== */
interface FullscreenQrModalProps {
  theme: ThemeMode;
  memberName: string;
  memberEmail: string;
  merchantName?: string;
  onClose: () => void;
}

export const FullscreenQrModal: React.FC<FullscreenQrModalProps> = ({
  theme,
  memberName,
  memberEmail,
  merchantName,
  onClose,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const memberId = computeMemberId(memberEmail);

  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor: '#061A0E',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 24,
        },
      ]}
    >
      <View style={styles.qrModalTop}>
        <BrandLogo small theme="dark" />
        <TouchableOpacity
          style={styles.qrCloseCircle}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Feather name="x" size={18} color="#F2F7EC" />
        </TouchableOpacity>
      </View>

      <View style={styles.qrCenterCard}>
        <View style={styles.qrDiscountPill}>
          <Text style={styles.qrDiscountPillText}>
            5% PARTNER DISCOUNT PASS
          </Text>
        </View>

        {merchantName ? (
          <Text style={styles.qrMerchantSub}>
            Redeeming at <Text style={{ fontWeight: '700' }}>{merchantName}</Text>
          </Text>
        ) : (
          <Text style={styles.qrMerchantSub}>
            Present to cashier to scan member code
          </Text>
        )}

        <View style={styles.qrBigWrapper}>
          <PrototypeQrCode seed={memberEmail || 'guest'} size={210} />
        </View>

        <Text style={[styles.qrMemberName, { fontFamily: SERIF_FONT }]}>
          {memberName || 'Juan dela Cruz'}
        </Text>
        <Text style={styles.qrMemberId}>{memberId}</Text>

        <View style={styles.qrVerifiedRow}>
          <View style={styles.qrVerifiedDot} />
          <Text style={styles.qrVerifiedText}>
            Verified Active Digital Member
          </Text>
        </View>
      </View>

      <ProtoButton
        theme="dark"
        label="Done scanning"
        full
        onPress={onClose}
      />
    </View>
  );
};

/* ============================================================================
 * 6. NOTIFICATION INBOX SHEET
 * ========================================================================== */
interface NotificationInboxSheetProps {
  theme: ThemeMode;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification: (n: NotificationItem) => void;
  onClose: () => void;
}

export const NotificationInboxSheet: React.FC<NotificationInboxSheetProps> = ({
  theme,
  notifications,
  onMarkAllRead,
  onSelectNotification,
  onClose,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [filter, setFilter] = useState<'all' | 'geo' | 'announcement'>('all');

  const filtered = notifications.filter(
    (n) => filter === 'all' || n.type === filter
  );

  return (
    <ScrollView
      style={[styles.sheetScroll, { backgroundColor: t.sheetBg }]}
      contentContainerStyle={styles.sheetScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inboxTopRow}>
        <TouchableOpacity
          style={[
            styles.backBtn,
            { borderColor: t.line, backgroundColor: t.inputBg, marginBottom: 0 },
          ]}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={16} color={t.ink} />
          <Text style={[styles.backBtnText, { color: t.ink }]}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onMarkAllRead} activeOpacity={0.7}>
          <Text style={[styles.markReadText, { color: t.brand }]}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      <H1 theme={theme} style={{ marginTop: 14 }}>
        Notification Inbox
      </H1>
      <MuteText theme={theme} style={{ marginTop: 4, marginBottom: 12 }}>
        Past airport geo arrival alerts and channel announcements.
      </MuteText>

      <View style={styles.inboxChipsRow}>
        <ProtoChip
          theme={theme}
          label="All"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <ProtoChip
          theme={theme}
          label="Geo Alerts"
          active={filter === 'geo'}
          onPress={() => setFilter('geo')}
        />
        <ProtoChip
          theme={theme}
          label="Announcements"
          active={filter === 'announcement'}
          onPress={() => setFilter('announcement')}
        />
      </View>

      {filtered.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.notifCard,
            {
              backgroundColor: item.read ? t.inputBg : t.tabOnBg,
              borderColor: item.read ? t.line : t.promoBorder,
            },
          ]}
          onPress={() => onSelectNotification(item)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.notifIconCircle,
              {
                backgroundColor:
                  item.type === 'geo' ? 'rgba(201,220,63,0.2)' : 'rgba(121,170,52,0.2)',
              },
            ]}
          >
            <Feather
              name={item.type === 'geo' ? 'map-pin' : 'radio'}
              size={16}
              color={t.brand}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.notifHeaderRow}>
              <Text style={[styles.notifTypeTag, { color: t.brand }]}>
                {item.type === 'geo' ? 'GEO ARRIVAL' : 'ANNOUNCEMENT'}
              </Text>
              <Text style={[styles.notifTime, { color: t.mute }]}>
                {item.time}
              </Text>
            </View>
            <Text style={[styles.notifTitle, { color: t.ink }]}>
              {item.title}
            </Text>
            <MuteText theme={theme}>{item.msg}</MuteText>
          </View>
          {!item.read && (
            <View style={[styles.unreadDot, { backgroundColor: t.brand }]} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

/* ============================================================================
 * 7. SLIDE-OUT MENU DRAWER (with ILC Website Sections + Privacy & Terms)
 * ========================================================================== */
interface SlideOutDrawerProps {
  theme: ThemeMode;
  onClose: () => void;
  onNavigateCategory: (cat: VideoCategoryFilter) => void;
  onNavigateTab: (tab: PrototypeTab) => void;
  onOpenInbox: () => void;
  onOpenOnboarding: () => void;
}

export const SlideOutDrawer: React.FC<SlideOutDrawerProps> = ({
  theme,
  onClose,
  onNavigateCategory,
  onNavigateTab,
  onOpenInbox,
  onOpenOnboarding,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | null>(null);

  const MENU_SECTIONS: {
    label: string;
    sub: string;
    icon: React.ComponentProps<typeof Feather>['name'];
    action: () => void;
  }[] = [
    {
      label: 'Philippines',
      sub: 'Archipelago documentaries & island guides',
      icon: 'compass',
      action: () => {
        onNavigateCategory('Philippines');
        onClose();
      },
    },
    {
      label: 'International',
      sub: 'Global coastal & lifestyle stories',
      icon: 'globe',
      action: () => {
        onNavigateCategory('International');
        onClose();
      },
    },
    {
      label: 'Hotels & Resorts',
      sub: 'Boutique stays & beach sanctuaries',
      icon: 'home',
      action: () => {
        onNavigateCategory('Hotels & Resorts');
        onClose();
      },
    },
    {
      label: 'Videos',
      sub: 'Full on-demand film catalog',
      icon: 'play-circle',
      action: () => {
        onNavigateCategory('All');
        onClose();
      },
    },
    {
      label: 'Food & Culinary',
      sub: 'Regional flavors & street food crawls',
      icon: 'coffee',
      action: () => {
        onNavigateCategory('Food');
        onClose();
      },
    },
    {
      label: 'Festivals & Live TV',
      sub: '24/7 stream & cultural celebrations',
      icon: 'radio',
      action: () => {
        onNavigateTab('live');
        onClose();
      },
    },
    {
      label: 'Partner Rewards (5% Off)',
      sub: 'Digital member card & merchant directory',
      icon: 'gift',
      action: () => {
        onNavigateTab('rewards');
        onClose();
      },
    },
    {
      label: 'Otamigo Travel',
      sub: 'Book flights, ferries & island stays',
      icon: 'send',
      action: () => {
        onNavigateTab('travel');
        onClose();
      },
    },
  ];

  return (
    <View style={styles.drawerOverlay}>
      <TouchableOpacity
        style={styles.drawerBackdrop}
        onPress={onClose}
        activeOpacity={1}
      />

      <View
        style={[
          styles.drawerPanel,
          {
            backgroundColor: t.sheetBg,
            borderRightColor: t.line,
          },
        ]}
      >
        <View style={styles.drawerHeader}>
          <BrandLogo small theme={theme} />
          <TouchableOpacity
            style={[
              styles.drawerCloseBtn,
              { borderColor: t.line, backgroundColor: t.inputBg },
            ]}
            onPress={onClose}
          >
            <Feather name="x" size={16} color={t.ink} />
          </TouchableOpacity>
        </View>

        <BrandStripe />

        {legalDoc ? (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.backBtn,
                { borderColor: t.line, backgroundColor: t.inputBg },
              ]}
              onPress={() => setLegalDoc(null)}
            >
              <Feather name="arrow-left" size={15} color={t.ink} />
              <Text style={[styles.backBtnText, { color: t.ink }]}>
                Back to menu
              </Text>
            </TouchableOpacity>

            <H2 theme={theme} style={{ marginTop: 6 }}>
              {legalDoc === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </H2>
            <MuteText theme={theme} style={{ lineHeight: 20 }}>
              {legalDoc === 'privacy'
                ? 'Island Living Channel (ILC) respects your privacy. We collect only your name and email address to issue your digital membership card, deliver welcome gifts, and provide optional airport/seaport arrival notifications. Your QR code encodes only your non-PII member ID (ILC-XXXXX). You may disable geo alerts or delete your account at any time in Profile & Settings.'
                : 'By using the Island Living Channel mobile app, you agree to our Phase 1 Member Terms. Digital membership is free and entitles registered members to a welcome gift (valid within the stated expiry window) and 5% off at participating partner merchants in Bacolod, Iloilo, and Cebu upon presenting your QR card. Travel bookings are fulfilled through our partner Otamigo under their carrier and accommodation terms.'}
            </MuteText>
          </ScrollView>
        ) : (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <Text style={[styles.drawerSectionHeader, { color: t.mute }]}>
              EXPLORE ISLAND LIVING
            </Text>

            {MENU_SECTIONS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.drawerItem, { borderBottomColor: t.line }]}
                onPress={item.action}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.drawerIconWrap,
                    { backgroundColor: t.inputBg },
                  ]}
                >
                  <Feather name={item.icon} size={16} color={t.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.drawerItemTitle, { color: t.ink }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.drawerItemSub, { color: t.mute }]}>
                    {item.sub}
                  </Text>
                </View>
                <Feather name="chevron-right" size={15} color={t.mute} />
              </TouchableOpacity>
            ))}

            <Text
              style={[
                styles.drawerSectionHeader,
                { color: t.mute, marginTop: 18 },
              ]}
            >
              LEGAL & INFO
            </Text>

            <TouchableOpacity
              style={[styles.drawerLegalRow, { borderBottomColor: t.line }]}
              onPress={() => {
                onOpenOnboarding();
                onClose();
              }}
            >
              <Feather name="compass" size={14} color={t.mute} />
              <Text style={[styles.drawerLegalText, { color: t.ink }]}>
                Welcome Tour (Airport Journey)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.drawerLegalRow, { borderBottomColor: t.line }]}
              onPress={() => {
                onOpenInbox();
                onClose();
              }}
            >
              <Feather name="bell" size={14} color={t.mute} />
              <Text style={[styles.drawerLegalText, { color: t.ink }]}>
                Notification Inbox
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.drawerLegalRow, { borderBottomColor: t.line }]}
              onPress={() => setLegalDoc('privacy')}
            >
              <Feather name="shield" size={14} color={t.mute} />
              <Text style={[styles.drawerLegalText, { color: t.ink }]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.drawerLegalRow, { borderBottomWidth: 0 }]}
              onPress={() => setLegalDoc('terms')}
            >
              <Feather name="file-text" size={14} color={t.mute} />
              <Text style={[styles.drawerLegalText, { color: t.ink }]}>
                Terms & Conditions
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
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
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 6,
  },
  sheetScroll: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  sheetScrollContent: {
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  liveBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 24,
    overflow: 'hidden',
  },
  liveCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  bar: {
    height: 6,
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 12,
  },
  barFill: {
    height: '100%',
  },
  metaChipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallTagPill: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 99,
  },
  smallTagText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  onboardScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  onboardTopContainer: {
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  onboardTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingHorizontal: 22,
    paddingBottom: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  onboardBodyScroll: {
    flex: 1,
  },
  onboardBodyContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 24,
  },
  onboardSlideContainer: {
    flexDirection: 'column',
  },
  onboardHero: {
    minHeight: 290,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'flex-end',
  },
  onboardHeroCaption: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 12.5,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  onboardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 99,
  },
  onboardBadgeText: {
    color: '#F3E600',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  onboardHeroTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 28,
    fontWeight: '500',
  },
  onboardTextSection: {
    marginTop: 26,
  },
  onboardEyebrow: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  onboardMainTitle: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '500',
    letterSpacing: -0.4,
  },
  onboardDesc: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
  },
  onboardGuestLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  onboardGuestLinkText: {
    fontSize: 13.5,
    fontWeight: '500',
  },
  onboardBottomFooter: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
  onboardDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  onboardDot: {
    height: 6,
    borderRadius: 3,
  },
  backBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 99,
    borderWidth: 1,
    marginBottom: 14,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  merchantHero: {
    minHeight: 200,
    borderRadius: 24,
    padding: 20,
  },
  merchantHeroInner: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 6,
  },
  offerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  offerBadgeTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  infoRowLast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  qrModalTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qrCloseCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCenterCard: {
    width: '100%',
    borderRadius: 28,
    padding: 24,
    backgroundColor: '#0A2414',
    borderWidth: 1,
    borderColor: 'rgba(201,220,63,0.55)',
    alignItems: 'center',
  },
  qrDiscountPill: {
    backgroundColor: 'rgba(201,220,63,0.18)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 99,
    marginBottom: 8,
  },
  qrDiscountPillText: {
    color: '#C9DC3F',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  qrMerchantSub: {
    color: '#98B39E',
    fontSize: 13,
    marginBottom: 18,
    textAlign: 'center',
  },
  qrBigWrapper: {
    padding: 10,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
  },
  qrMemberName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '500',
  },
  qrMemberId: {
    color: '#C9DC3F',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },
  qrVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  qrVerifiedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C9DC3F',
  },
  qrVerifiedText: {
    color: '#98B39E',
    fontSize: 12,
  },
  inboxTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  markReadText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inboxChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
  notifIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  notifTypeTag: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  notifTime: {
    fontSize: 11,
  },
  notifTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 12,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  drawerPanel: {
    width: '82%',
    maxWidth: 320,
    height: '100%',
    borderRightWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerSectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  drawerIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerItemTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  drawerItemSub: {
    fontSize: 11.5,
  },
  drawerLegalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  drawerLegalText: {
    fontSize: 13.5,
    fontWeight: '500',
  },
  /* Player Sheet - Rich Experience Styles */
  playerTopBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 2,
  },
  playerHeaderBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 10,
  },
  exclusiveBadgePill: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 4,
  },
  exclusiveBadgeText: {
    fontFamily: FONT_STACK,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#04150B',
  },
  playerHeaderTitle: {
    fontFamily: FONT_STACK,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  playerCloseCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerScrollArea: {
    flex: 1,
  },
  playerScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
    gap: 14,
  },
  playerSynopsisText: {
    fontFamily: FONT_STACK,
    fontSize: 13,
    lineHeight: 18,
  },
  /* Featured Island Partner Card */
  partnerMerchantCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  partnerCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partnerBadgeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(201, 220, 63, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  partnerBadgeTagText: {
    fontFamily: FONT_STACK,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#C9DC3F',
  },
  partnerRatingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  partnerRatingStar: {
    color: '#F2A65A',
    fontSize: 12,
  },
  partnerRatingValue: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    fontWeight: '600',
  },
  partnerMerchantTitle: {
    fontFamily: FONT_STACK,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  partnerMerchantCity: {
    fontFamily: FONT_STACK,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  partnerMerchantDesc: {
    fontFamily: FONT_STACK,
    fontSize: 12.5,
    lineHeight: 17,
  },
  partnerOfferBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  partnerOfferText: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
    fontWeight: '700',
    flex: 1,
  },
  showQrPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  showQrPassBtnText: {
    fontFamily: FONT_STACK,
    fontSize: 12.5,
    fontWeight: '700',
  },
  /* Partner Feedback Box */
  partnerFeedbackBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 8,
    marginTop: 4,
  },
  feedbackSectionTitle: {
    fontFamily: FONT_STACK,
    fontSize: 13.5,
    fontWeight: '700',
  },
  feedbackSectionSub: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    marginTop: -4,
  },
  interactiveStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  starTouchItem: {
    padding: 2,
  },
  starSymbol: {
    fontSize: 22,
  },
  starRatingScoreLabel: {
    fontFamily: FONT_STACK,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  quickTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 2,
  },
  quickTagPill: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 99,
    borderWidth: 1,
  },
  quickTagText: {
    fontFamily: FONT_STACK,
    fontSize: 10.5,
  },
  merchantTextInput: {
    fontFamily: FONT_STACK,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    fontSize: 12,
    minHeight: 46,
    textAlignVertical: 'top',
  },
  submitReviewBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  submitReviewBtnText: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
    fontWeight: '700',
  },
  communityReviewsWrap: {
    gap: 6,
    marginTop: 4,
  },
  communityReviewsHeader: {
    fontFamily: FONT_STACK,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  communityReviewCard: {
    borderTopWidth: 1,
    paddingTop: 6,
    gap: 2,
  },
  communityReviewAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  communityReviewAuthor: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
    fontWeight: '700',
  },
  communityReviewStars: {
    color: '#F2A65A',
    fontSize: 10,
  },
  communityReviewComment: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    lineHeight: 15,
  },
  /* Grab-Style "You Might Also Like" */
  grabRecommendContainer: {
    gap: 10,
    marginTop: 6,
  },
  grabRecommendHeaderRow: {
    gap: 2,
  },
  grabRecommendMainTitle: {
    fontFamily: FONT_STACK,
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  grabRecommendSubtitle: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
  },
  grabHorizontalList: {
    gap: 12,
    paddingRight: 16,
  },
  grabRecommendCard: {
    width: 175,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  grabCardImageWrap: {
    width: '100%',
    height: 105,
    position: 'relative',
    backgroundColor: '#000000',
  },
  grabCardImage: {
    width: '100%',
    height: '100%',
  },
  grabDurationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  grabDurationText: {
    fontFamily: FONT_STACK,
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  grabPlayFloatingIcon: {
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
  grabCardBody: {
    padding: 8,
    gap: 6,
  },
  grabCardTitle: {
    fontFamily: FONT_STACK,
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  grabPerkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  grabPerkPillText: {
    fontFamily: FONT_STACK,
    fontSize: 9.5,
    fontWeight: '700',
  },
  bottomCloseReturnBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 6,
  },
  bottomCloseReturnText: {
    fontFamily: FONT_STACK,
    fontSize: 13,
    fontWeight: '600',
  },
});
