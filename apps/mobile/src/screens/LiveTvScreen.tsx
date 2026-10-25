import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import {
  PROTOTYPE_THEMES,
  ThemeMode,
} from '../constants/prototypeTheme';
import { RADII, TYPO, FONT_STACK } from '../constants/uiTokens';
import {
  youtubeService,
} from '../services/youtube';
import {
  broadcastService,
  LiveBroadcastConfig,
  DEFAULT_BROADCAST_CONFIG,
} from '../services/broadcast';

interface LiveTvScreenProps {
  theme: ThemeMode;
  onPushToast: (title: string, msg: string) => void;
  onNavigateToRewards?: () => void;
  onOpenFullscreenQr?: (merchantName?: string) => void;
}

export const LiveTvScreen: React.FC<LiveTvScreenProps> = ({
  theme,
  onPushToast,
  onOpenFullscreenQr,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';

  // Live Broadcast Configuration loaded from CMS /api/settings
  const [broadcastConfig, setBroadcastConfig] = useState<LiveBroadcastConfig>(
    broadcastService.getConfig()
  );

  // iOS Segmented Control State: 'live' | 'upcoming'
  const [selectedSegment, setSelectedSegment] = useState<'live' | 'upcoming'>(
    broadcastConfig.isLive ? 'live' : 'upcoming'
  );

  useEffect(() => {
    broadcastService.fetchBroadcastConfig().then((cfg) => {
      setBroadcastConfig(cfg);
      // Auto-adapt segment mode based on CMS active status
      setSelectedSegment(cfg.isLive ? 'live' : 'upcoming');
    });
  }, []);

  // Interactive Tapback Reactions (Apple Music Live / iMessage style)
  const [cheers, setCheers] = useState({
    heart: 2420,
    spark: 1890,
    flame: 3150,
    music: 940,
  });
  const [activeReactions, setActiveReactions] = useState<Record<string, boolean>>({});

  // Countdown timer to next festival broadcast
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 14,
    minutes: 28,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = youtubeService.getRealCategories();
  const [alerts, setAlerts] = useState<Record<string, boolean>>({
    masskara: true,
  });

  const streamVideoId = broadcastConfig.videoId || 'P-iu1vverWQ';
  const streamUrl = broadcastConfig.streamUrl || `https://www.youtube.com/watch?v=P-iu1vverWQ`;
  const embedUrl = `https://www.youtube.com/embed/${streamVideoId}?playsinline=1&autoplay=1`;
  const streamTitle = broadcastConfig.broadcastTitle;
  const hostLgu = broadcastConfig.hostLgu;
  const viewerCount = broadcastConfig.viewerCount;

  const handleToggleAlert = (id: string, eventName: string) => {
    const isSet = !!alerts[id];
    setAlerts((prev) => ({ ...prev, [id]: !isSet }));
    if (!isSet) {
      onPushToast(
        'Broadcast Alert Scheduled',
        `You will receive a notification 15 minutes before ${eventName} begins.`
      );
    } else {
      onPushToast('Alert Removed', `Notification cancelled for ${eventName}.`);
    }
  };

  const handleReaction = (key: 'heart' | 'spark' | 'flame' | 'music', label: string) => {
    setCheers((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    setActiveReactions((prev) => ({ ...prev, [key]: true }));
    onPushToast(label, 'Your reaction was sent to the live broadcast feed.');
  };

  const handleAirPlay = () => {
    onPushToast(
      'AirPlay & Smart TV',
      'Searching for AirPlay and Google Cast displays on your local network...'
    );
  };

  const handleShare = () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && (navigator as any).clipboard) {
      (navigator as any).clipboard.writeText(streamUrl);
      onPushToast('Link Copied', 'Direct broadcast link copied to clipboard.');
    } else {
      onPushToast('Share Stream', streamUrl);
    }
  };

  // Apple-grade dynamic styling helpers
  const glassSurface = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
  const glassBorder = isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.08)';
  const secondaryText = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(20, 31, 24, 0.65)';
  const tertiaryText = isDark ? 'rgba(255, 255, 255, 0.42)' : 'rgba(20, 31, 24, 0.45)';

  return (
    <View style={styles.container}>
      {/* ============================================================== */}
      {/* 1. iOS NATIVE SEGMENTED CONTROL */}
      {/* ============================================================== */}
      <View style={[styles.segmentedTrack, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }]}>
        <TouchableOpacity
          style={[
            styles.segmentItem,
            selectedSegment === 'live' && [
              styles.segmentItemActive,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.16)' : '#FFFFFF',
                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 6px rgba(0,0,0,0.08)',
              } as any,
            ],
          ]}
          onPress={() => setSelectedSegment('live')}
          activeOpacity={0.85}
        >
          <View style={styles.liveBeaconDot} />
          <Text
            style={[
              styles.segmentText,
              {
                color: selectedSegment === 'live' ? t.ink : secondaryText,
                fontWeight: selectedSegment === 'live' ? '600' : '400',
              },
            ]}
          >
            Live Broadcast
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentItem,
            selectedSegment === 'upcoming' && [
              styles.segmentItemActive,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.16)' : '#FFFFFF',
                boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 6px rgba(0,0,0,0.08)',
              } as any,
            ],
          ]}
          onPress={() => setSelectedSegment('upcoming')}
          activeOpacity={0.85}
        >
          <Ionicons
            name="calendar-outline"
            size={13}
            color={selectedSegment === 'upcoming' ? t.ink : secondaryText}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.segmentText,
              {
                color: selectedSegment === 'upcoming' ? t.ink : secondaryText,
                fontWeight: selectedSegment === 'upcoming' ? '600' : '400',
              },
            ]}
          >
            Festival Calendar
          </Text>
        </TouchableOpacity>
      </View>

      {/* ============================================================== */}
      {/* 2. MODE: LIVE BROADCAST (APPLE TV+ STREAM EXPERIENCE) */}
      {/* ============================================================== */}
      {selectedSegment === 'live' && (
        <View>
          {/* Metadata & Host City Header */}
          <View style={styles.broadcastMetaRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.eyebrow, { color: isDark ? '#A7F3D0' : '#0B6A2E' }]}>
                {hostLgu.toUpperCase()}
              </Text>
              <Text style={[styles.broadcastHeadline, { color: t.ink }]} numberOfLines={2}>
                {streamTitle}
              </Text>
            </View>

            {/* Quick Actions (AirPlay & Share) */}
            <View style={styles.headerActionPills}>
              <TouchableOpacity
                style={[styles.glassIconPill, { backgroundColor: glassSurface, borderColor: glassBorder }]}
                onPress={handleAirPlay}
                activeOpacity={0.7}
              >
                <Feather name="tv" size={15} color={t.ink} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.glassIconPill, { backgroundColor: glassSurface, borderColor: glassBorder }]}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Ionicons name="share-outline" size={16} color={t.ink} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Sub-bar: Minimalist Live Badge + Viewer Count */}
          <View style={styles.statusBarRow}>
            <View style={styles.livePill}>
              <View style={styles.liveInnerPulse} />
              <Text style={styles.livePillText}>LIVE</Text>
            </View>
            <View style={styles.viewerMonoWrap}>
              <Text style={[styles.viewerCountMono, { color: secondaryText }]}>
                {viewerCount} VIEWERS
              </Text>
            </View>
            <View style={styles.streamSpecPill}>
              <Text style={[styles.streamSpecText, { color: tertiaryText }]}>
                1080p · 60 FPS · STEREO
              </Text>
            </View>
          </View>

          {/* Cinematic Edge-to-Edge Player Container */}
          <View
            style={[
              styles.playerFrame,
              Platform.OS === 'web' &&
              ({
                boxShadow: isDark
                  ? '0 24px 60px -12px rgba(0, 0, 0, 0.75)'
                  : '0 16px 40px -10px rgba(0, 0, 0, 0.15)',
              } as any),
            ]}
          >
            <YouTubeEmbed
              embedUrl={embedUrl}
              title={streamTitle}
              aspectRatio={16 / 9}
              autoPlay={false}
            />
          </View>

          {/* Sovereign Stream Architecture Card (Solving the Chairman's Constraint) */}
          <View style={[styles.sovereignCard, { backgroundColor: glassSurface, borderColor: glassBorder }]}>
            <View style={styles.sovereignIconWrap}>
              <Ionicons name="shield-checkmark" size={18} color="#22C55E" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sovereignTitle, { color: t.ink }]}>
                Direct Sovereign Stream
              </Text>
              <Text style={[styles.sovereignBody, { color: secondaryText }]}>
                Official regional broadcast feed with uninterrupted live audio and video.
              </Text>
            </View>
          </View>

          {/* Live Tapback Reactions (Apple Music Live / iMessage Style) */}
          <View style={[styles.tapbackDock, { backgroundColor: glassSurface, borderColor: glassBorder }]}>
            <Text style={[styles.tapbackHeading, { color: tertiaryText }]}>
              COMMUNITY REACTIONS
            </Text>

            <View style={styles.tapbackGrid}>
              <TouchableOpacity
                style={[
                  styles.tapbackItem,
                  activeReactions.heart && styles.tapbackActive,
                ]}
                onPress={() => handleReaction('heart', 'Heart sent')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={activeReactions.heart ? 'heart' : 'heart-outline'}
                  size={20}
                  color={activeReactions.heart ? '#EF4444' : t.ink}
                />
                <Text style={[styles.tapbackCount, { color: secondaryText }]}>
                  {cheers.heart.toLocaleString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tapbackItem,
                  activeReactions.spark && styles.tapbackActive,
                ]}
                onPress={() => handleReaction('spark', 'Spark sent')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={activeReactions.spark ? 'sparkles' : 'sparkles-outline'}
                  size={19}
                  color={activeReactions.spark ? '#EAB308' : t.ink}
                />
                <Text style={[styles.tapbackCount, { color: secondaryText }]}>
                  {cheers.spark.toLocaleString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tapbackItem,
                  activeReactions.flame && styles.tapbackActive,
                ]}
                onPress={() => handleReaction('flame', 'Flame sent')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={activeReactions.flame ? 'flame' : 'flame-outline'}
                  size={20}
                  color={activeReactions.flame ? '#F97316' : t.ink}
                />
                <Text style={[styles.tapbackCount, { color: secondaryText }]}>
                  {cheers.flame.toLocaleString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tapbackItem,
                  activeReactions.music && styles.tapbackActive,
                ]}
                onPress={() => handleReaction('music', 'Rhythm cheered')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={activeReactions.music ? 'musical-notes' : 'musical-notes-outline'}
                  size={19}
                  color={activeReactions.music ? '#10B981' : t.ink}
                />
                <Text style={[styles.tapbackCount, { color: secondaryText }]}>
                  {cheers.music.toLocaleString()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Host City Privileges (Apple Wallet-Style Digital Passes) */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.eyebrow, { color: tertiaryText }]}>
                  HOST CITY PRIVILEGES
                </Text>
                <Text style={[styles.sectionTitle, { color: t.ink }]}>
                  Bacolod Festival Passes
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  onOpenFullscreenQr?.('Punta Taza Sunset Grill');
                  onPushToast('Digital Pass', 'Present your ILC Pass QR at partner cashiers.');
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.textActionLink, { color: isDark ? '#A7F3D0' : '#0B6A2E' }]}>
                  View Pass ↗
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.passesScroll}>
              {/* Pass 1: Punta Taza Grill */}
              <TouchableOpacity
                style={[styles.passCard, { backgroundColor: isDark ? '#082517' : '#FFFFFF', borderColor: glassBorder }]}
                onPress={() => {
                  onOpenFullscreenQr?.('Punta Taza Sunset Grill');
                  onPushToast('Pass Activated', 'Present your ILC Pass QR at Punta Taza for 10% off.');
                }}
                activeOpacity={0.82}
              >
                <View style={styles.passImageWrap}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80' }}
                    style={styles.passImage}
                    resizeMode="cover"
                  />
                  <View style={styles.passValueFloatingPill}>
                    <Text style={styles.passValueFloatingText}>10% OFF</Text>
                  </View>
                </View>
                <View style={styles.passBody}>
                  <View style={[styles.passCategoryPill, { backgroundColor: isDark ? 'rgba(110, 231, 183, 0.15)' : 'rgba(11, 106, 46, 0.1)' }]}>
                    <Text style={[styles.passCategory, { color: isDark ? '#6EE7B7' : '#0B6A2E' }]}>
                      DINING PRIVILEGE
                    </Text>
                  </View>
                  <Text style={[styles.passMerchant, { color: t.ink }]}>
                    Punta Taza Sunset Grill
                  </Text>
                  <Text style={[styles.passDetails, { color: secondaryText }]} numberOfLines={2}>
                    Authentic chicken inasal & coastal sunset dining.
                  </Text>
                  <View style={[styles.passFooter, { borderTopColor: glassBorder }]}>
                    <View style={styles.passLocationRow}>
                      <Ionicons name="location-outline" size={11} color={tertiaryText} />
                      <Text style={[styles.passLocation, { color: tertiaryText }]}>
                        Pala-Pala Walk
                      </Text>
                    </View>
                    <Text style={[styles.passRedeem, { color: isDark ? '#6EE7B7' : '#0B6A2E' }]}>
                      Show Pass →
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Pass 2: Calea Pastries */}
              <TouchableOpacity
                style={[styles.passCard, { backgroundColor: isDark ? '#082517' : '#FFFFFF', borderColor: glassBorder }]}
                onPress={() => {
                  onOpenFullscreenQr?.('Calea Pastries & Lounge');
                  onPushToast('Pass Activated', 'Present your ILC Pass QR at Calea for free Robusta coffee.');
                }}
                activeOpacity={0.82}
              >
                <View style={styles.passImageWrap}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80' }}
                    style={styles.passImage}
                    resizeMode="cover"
                  />
                  <View style={styles.passValueFloatingPill}>
                    <Text style={[styles.passValueFloatingText, { color: '#6EE7B7' }]}>FREE COFFEE</Text>
                  </View>
                </View>
                <View style={styles.passBody}>
                  <View style={[styles.passCategoryPill, { backgroundColor: isDark ? 'rgba(147, 197, 253, 0.15)' : 'rgba(29, 78, 216, 0.1)' }]}>
                    <Text style={[styles.passCategory, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
                      HOSPITALITY
                    </Text>
                  </View>
                  <Text style={[styles.passMerchant, { color: t.ink }]}>
                    Calea Pastries & Lounge
                  </Text>
                  <Text style={[styles.passDetails, { color: secondaryText }]} numberOfLines={2}>
                    Complimentary Negros Robusta with any cake order.
                  </Text>
                  <View style={[styles.passFooter, { borderTopColor: glassBorder }]}>
                    <View style={styles.passLocationRow}>
                      <Ionicons name="location-outline" size={11} color={tertiaryText} />
                      <Text style={[styles.passLocation, { color: tertiaryText }]}>
                        Lacson Strip
                      </Text>
                    </View>
                    <Text style={[styles.passRedeem, { color: isDark ? '#93C5FD' : '#1D4ED8' }]}>
                      Show Pass →
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Pass 3: MassKara Artisan Guild */}
              <TouchableOpacity
                style={[styles.passCard, { backgroundColor: isDark ? '#082517' : '#FFFFFF', borderColor: glassBorder }]}
                onPress={() => {
                  onOpenFullscreenQr?.('MassKara Artisan Guild');
                  onPushToast('Pass Activated', 'Present your ILC Pass QR for ₱200 off festival masks.');
                }}
                activeOpacity={0.82}
              >
                <View style={styles.passImageWrap}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80' }}
                    style={styles.passImage}
                    resizeMode="cover"
                  />
                  <View style={styles.passValueFloatingPill}>
                    <Text style={[styles.passValueFloatingText, { color: '#C084FC' }]}>₱200 VOUCHER</Text>
                  </View>
                </View>
                <View style={styles.passBody}>
                  <View style={[styles.passCategoryPill, { backgroundColor: isDark ? 'rgba(192, 132, 252, 0.15)' : 'rgba(124, 58, 237, 0.1)' }]}>
                    <Text style={[styles.passCategory, { color: isDark ? '#C084FC' : '#7C3AED' }]}>
                      ARTISAN CRAFT
                    </Text>
                  </View>
                  <Text style={[styles.passMerchant, { color: t.ink }]}>
                    MassKara Artisan Guild
                  </Text>
                  <Text style={[styles.passDetails, { color: secondaryText }]} numberOfLines={2}>
                    ₱200 voucher on certified festival masks & weaves.
                  </Text>
                  <View style={[styles.passFooter, { borderTopColor: glassBorder }]}>
                    <View style={styles.passLocationRow}>
                      <Ionicons name="location-outline" size={11} color={tertiaryText} />
                      <Text style={[styles.passLocation, { color: tertiaryText }]}>
                        Public Plaza
                      </Text>
                    </View>
                    <Text style={[styles.passRedeem, { color: isDark ? '#C084FC' : '#7C3AED' }]}>
                      Show Pass →
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Broadcast Itinerary (iOS Inset Grouped List) */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.eyebrow, { color: tertiaryText }]}>
              TODAY'S BROADCAST ITINERARY
            </Text>
            <View style={[styles.iosInsetGroup, { backgroundColor: glassSurface, borderColor: glassBorder }]}>
              <View style={[styles.iosInsetRow, { borderBottomColor: glassBorder }]}>
                <View style={styles.itineraryLeft}>
                  <View style={styles.liveBeaconDotSmall} />
                  <View>
                    <Text style={[styles.itineraryTitle, { color: t.ink }]}>
                      Street Dance Arena Grand Finals
                    </Text>
                    <Text style={[styles.itinerarySub, { color: secondaryText }]}>
                      14 Barangay Contingents · Paglaum Stadium
                    </Text>
                  </View>
                </View>
                <View style={styles.nowBadgePill}>
                  <Text style={styles.nowBadgeText}>ON AIR</Text>
                </View>
              </View>

              <View style={[styles.iosInsetRow, { borderBottomColor: glassBorder }]}>
                <View style={styles.itineraryLeft}>
                  <View style={[styles.liveBeaconDotSmall, { backgroundColor: tertiaryText }]} />
                  <View>
                    <Text style={[styles.itineraryTitle, { color: t.ink }]}>
                      Festival Queen Coronation & Awards
                    </Text>
                    <Text style={[styles.itinerarySub, { color: secondaryText }]}>
                      Ceremonial Stage · Bacolod City
                    </Text>
                  </View>
                </View>
                <Text style={[styles.itineraryTimeMono, { color: tertiaryText }]}>
                  5:45 PM
                </Text>
              </View>

              <View style={[styles.iosInsetRow, { borderBottomWidth: 0 }]}>
                <View style={styles.itineraryLeft}>
                  <View style={[styles.liveBeaconDotSmall, { backgroundColor: tertiaryText }]} />
                  <View>
                    <Text style={[styles.itineraryTitle, { color: t.ink }]}>
                      Electric MassKara Neon Parade & Fireworks
                    </Text>
                    <Text style={[styles.itinerarySub, { color: secondaryText }]}>
                      Lacson Tourism Strip
                    </Text>
                  </View>
                </View>
                <Text style={[styles.itineraryTimeMono, { color: tertiaryText }]}>
                  7:30 PM
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* ============================================================== */}
      {/* 3. MODE: UPCOMING FESTIVAL CALENDAR & KEYNOTE COUNTDOWN */}
      {/* ============================================================== */}
      {selectedSegment === 'upcoming' && (
        <View>
          {/* Apple Special Event-Inspired Keynote Countdown Card */}
          <View
            style={[
              styles.keynoteCard,
              {
                backgroundColor: isDark ? '#05180F' : '#0B2E1E',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
              },
            ]}
          >
            <View style={styles.keynoteHeader}>
              <Text style={styles.keynoteEyebrow}>
                NEXT LIVE BROADCAST · {broadcastConfig.nextFestivalLocation.toUpperCase()}
              </Text>
              <Text style={styles.keynoteTitle}>
                {broadcastConfig.nextFestivalTitle}
              </Text>
              <Text style={styles.keynoteSub}>
                Scheduled for {broadcastConfig.nextFestivalDate} · 14 competing contingents live from Paglaum Stadium.
              </Text>
            </View>

            {/* Precision Monospaced Countdown Digits */}
            <View style={styles.countdownRow}>
              <View style={styles.countdownBlock}>
                <Text style={styles.countdownNumber}>
                  {String(countdown.days).padStart(2, '0')}
                </Text>
                <Text style={styles.countdownLabel}>DAYS</Text>
              </View>
              <Text style={styles.countdownSeparator}>:</Text>
              <View style={styles.countdownBlock}>
                <Text style={styles.countdownNumber}>
                  {String(countdown.hours).padStart(2, '0')}
                </Text>
                <Text style={styles.countdownLabel}>HOURS</Text>
              </View>
              <Text style={styles.countdownSeparator}>:</Text>
              <View style={styles.countdownBlock}>
                <Text style={styles.countdownNumber}>
                  {String(countdown.minutes).padStart(2, '0')}
                </Text>
                <Text style={styles.countdownLabel}>MINUTES</Text>
              </View>
              <Text style={styles.countdownSeparator}>:</Text>
              <View style={styles.countdownBlock}>
                <Text style={styles.countdownNumber}>
                  {String(countdown.seconds).padStart(2, '0')}
                </Text>
                <Text style={styles.countdownLabel}>SECONDS</Text>
              </View>
            </View>

            {/* Apple-style Primary Pill Action */}
            <TouchableOpacity
              style={[
                styles.keynoteCtaBtn,
                alerts.masskara
                  ? { backgroundColor: '#10B981' }
                  : { backgroundColor: '#FFFFFF' },
              ]}
              onPress={() => handleToggleAlert('masskara', 'MassKara Festival Grand Finals')}
              activeOpacity={0.85}
            >
              <Ionicons
                name={alerts.masskara ? 'checkmark-circle' : 'notifications-outline'}
                size={16}
                color={alerts.masskara ? '#FFFFFF' : '#0B2E1E'}
              />
              <Text
                style={[
                  styles.keynoteCtaText,
                  { color: alerts.masskara ? '#FFFFFF' : '#0B2E1E' },
                ]}
              >
                {alerts.masskara ? 'Notification Scheduled' : 'Notify Me When Live'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* The Sovereign Difference: Apple Feature Specification Callout */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.eyebrow, { color: tertiaryText }]}>
              BROADCAST SPECIFICATIONS
            </Text>
            <View style={[styles.iosInsetGroup, { backgroundColor: glassSurface, borderColor: glassBorder }]}>
              <View style={[styles.specRow, { borderBottomColor: glassBorder }]}>
                <View style={styles.specIcon}>
                  <Ionicons name="volume-high-outline" size={18} color={isDark ? '#6EE7B7' : '#0B6A2E'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.specTitle, { color: t.ink }]}>
                    Unrestricted Live Audio
                  </Text>
                  <Text style={[styles.specDesc, { color: secondaryText }]}>
                    Full acoustic range with zero algorithmic muting.
                  </Text>
                </View>
              </View>

              <View style={[styles.specRow, { borderBottomColor: glassBorder }]}>
                <View style={styles.specIcon}>
                  <Ionicons name="tv-outline" size={18} color={isDark ? '#93C5FD' : '#1D4ED8'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.specTitle, { color: t.ink }]}>
                    1080p 60fps Broadcast
                  </Text>
                  <Text style={[styles.specDesc, { color: secondaryText }]}>
                    High-bitrate feed optimized for AirPlay and smart TVs.
                  </Text>
                </View>
              </View>

              <View style={[styles.specRow, { borderBottomWidth: 0 }]}>
                <View style={styles.specIcon}>
                  <Ionicons name="ticket-outline" size={18} color={isDark ? '#FDE047' : '#B45309'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.specTitle, { color: t.ink }]}>
                    Integrated Member Privileges
                  </Text>
                  <Text style={[styles.specDesc, { color: secondaryText }]}>
                    Exclusive local discounts redeemable with your digital pass.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 2026 Island Broadcast Calendar (iOS Inset List) */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.eyebrow, { color: tertiaryText }]}>
              UPCOMING 2026 CALENDAR
            </Text>

            <View style={[styles.iosInsetGroup, { backgroundColor: glassSurface, borderColor: glassBorder }]}>
              {[
                {
                  id: 'dinagyang',
                  title: 'Dinagyang Festival: Dagyang Tribes',
                  location: 'Iloilo City, Panay',
                  date: 'JAN 2026',
                },
                {
                  id: 'sinulog',
                  title: 'Sinulog Grand Parade & Ritual Dance',
                  location: 'Cebu City, Central Visayas',
                  date: 'JAN 2026',
                },
                {
                  id: 'buglasan',
                  title: 'Buglasan Festival of Festivals',
                  location: 'Dumaguete, Negros Oriental',
                  date: 'OCT 2026',
                },
              ].map((fest, idx, arr) => {
                const isSet = !!alerts[fest.id];
                const isLast = idx === arr.length - 1;
                return (
                  <View
                    key={fest.id}
                    style={[
                      styles.calendarRow,
                      !isLast && { borderBottomColor: glassBorder, borderBottomWidth: StyleSheet.hairlineWidth },
                    ]}
                  >
                    <View style={styles.calendarDatePill}>
                      <Text style={[styles.calendarDateText, { color: isDark ? '#6EE7B7' : '#0B6A2E' }]}>
                        {fest.date}
                      </Text>
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 12 }}>
                      <Text style={[styles.calendarTitle, { color: t.ink }]} numberOfLines={1}>
                        {fest.title}
                      </Text>
                      <Text style={[styles.calendarLocation, { color: tertiaryText }]}>
                        {fest.location}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.calendarNotifyBtn,
                        isSet && { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7' },
                      ]}
                      onPress={() => handleToggleAlert(fest.id, fest.title)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isSet ? 'notifications' : 'notifications-outline'}
                        size={15}
                        color={isSet ? '#10B981' : secondaryText}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Institutional / LGU Partnership Inquiries (Apple for Enterprise Style) */}
          <View style={[styles.institutionalCard, { backgroundColor: glassSurface, borderColor: glassBorder }]}>
            <Text style={[styles.eyebrow, { color: tertiaryText }]}>
              INSTITUTIONAL BROADCASTING
            </Text>
            <Text style={[styles.institutionalTitle, { color: t.ink }]}>
              Partner Your Province with Island Living
            </Text>
            <Text style={[styles.institutionalBody, { color: secondaryText }]}>
              Multi-camera broadcast production and tourism distribution for LGUs and festival organizers.
            </Text>
            <TouchableOpacity
              style={styles.institutionalLink}
              onPress={() => onPushToast('LGU Operations', 'Contact: partnerships@islandlivingchannel.tv')}
              activeOpacity={0.7}
            >
              <Text style={[styles.institutionalLinkText, { color: isDark ? '#6EE7B7' : '#0B6A2E' }]}>
                Inquire with Broadcast Operations →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Featured Video Archives Vault (Apple TV Shelf Style) */}
      {categories && categories.length > 0 && (
        <View style={styles.archiveShelfWrap}>
          <Text style={[styles.eyebrow, { color: tertiaryText }]}>
            CURATED ARCHIVES
          </Text>
          <Text style={[styles.sectionTitle, { color: t.ink, marginBottom: 12 }]}>
            Festival Specials & Champion Replays
          </Text>

          <View style={styles.archiveGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.archiveCard, { borderColor: glassBorder }]}
                onPress={() => Linking.openURL(cat.playlistUrl).catch(() => { })}
                activeOpacity={0.88}
              >
                <Image
                  source={{ uri: cat.thumbnail }}
                  style={styles.archiveThumb}
                  resizeMode="cover"
                />
                <View style={styles.archiveOverlay}>
                  <Text style={styles.archiveName} numberOfLines={2}>
                    {cat.name}
                  </Text>
                  <Text style={styles.archiveMeta}>View Vault ↗</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    paddingBottom: 48,
  },
  // iOS Segmented Control
  segmentedTrack: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    marginTop: 4,
    marginBottom: 20,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  segmentItemActive: {
    borderRadius: 8,
  },
  segmentText: {
    fontFamily: FONT_STACK,
    fontSize: 13,
    letterSpacing: -0.1,
  },
  liveBeaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  liveBeaconDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 10,
    marginTop: 6,
  },

  // Broadcast Header & Metadata
  broadcastMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 12,
  },
  eyebrow: {
    fontFamily: FONT_STACK,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  broadcastHeadline: {
    fontFamily: FONT_STACK,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: -0.4,
  },
  headerActionPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  glassIconPill: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Status Bar
  statusBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E11D24',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 4,
    gap: 5,
  },
  liveInnerPulse: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
  livePillText: {
    fontFamily: FONT_STACK,
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  viewerMonoWrap: {
    paddingHorizontal: 4,
  },
  viewerCountMono: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  streamSpecPill: {
    marginLeft: 'auto',
  },
  streamSpecText: {
    fontFamily: FONT_STACK,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  // Player Container
  playerFrame: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginBottom: 14,
  },

  // Sovereign Card
  sovereignCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 13,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 18,
  },
  sovereignIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  sovereignTitle: {
    fontFamily: FONT_STACK,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
    marginBottom: 2,
  },
  sovereignBody: {
    fontFamily: FONT_STACK,
    fontSize: 12,
    lineHeight: 16.5,
  },

  // Tapback Reaction Dock
  tapbackDock: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginBottom: 24,
  },
  tapbackHeading: {
    fontFamily: FONT_STACK,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  tapbackGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  tapbackItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  tapbackActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  tapbackCount: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },

  // Section & Carousel Elements
  sectionWrap: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONT_STACK,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  textActionLink: {
    fontFamily: FONT_STACK,
    fontSize: 12.5,
    fontWeight: '600',
  },
  passesScroll: {
    gap: 12,
    paddingRight: 16,
  },
  passCard: {
    width: 250,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  passImageWrap: {
    width: '100%',
    height: 115,
    position: 'relative',
    backgroundColor: '#000000',
  },
  passImage: {
    width: '100%',
    height: '100%',
  },
  passValueFloatingPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  passValueFloatingText: {
    fontFamily: FONT_STACK,
    fontSize: 10,
    fontWeight: '800',
    color: '#FBBF24',
    letterSpacing: 0.3,
  },
  passBody: {
    padding: 12,
    gap: 4,
  },
  passCategoryPill: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 2,
  },
  passCategory: {
    fontFamily: FONT_STACK,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  passMerchant: {
    fontFamily: FONT_STACK,
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  passDetails: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
    lineHeight: 15,
  },
  passFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
  passLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  passLocation: {
    fontFamily: FONT_STACK,
    fontSize: 10.5,
  },
  passRedeem: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
    fontWeight: '700',
  },

  // iOS Inset Group
  iosInsetGroup: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  iosInsetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itineraryLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  itineraryTitle: {
    fontFamily: FONT_STACK,
    fontSize: 13.5,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  itinerarySub: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
    marginTop: 2,
  },
  nowBadgePill: {
    backgroundColor: '#E11D24',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  nowBadgeText: {
    fontFamily: FONT_STACK,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  itineraryTimeMono: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Apple Special Event Keynote Card
  keynoteCard: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    marginBottom: 24,
  },
  keynoteHeader: {
    marginBottom: 18,
  },
  keynoteEyebrow: {
    fontFamily: FONT_STACK,
    color: '#6EE7B7',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  keynoteTitle: {
    fontFamily: FONT_STACK,
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 27,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  keynoteSub: {
    fontFamily: FONT_STACK,
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12.5,
    lineHeight: 18,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  countdownBlock: {
    width: 62,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  countdownNumber: {
    fontFamily: FONT_STACK,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  countdownLabel: {
    fontFamily: FONT_STACK,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  countdownSeparator: {
    fontFamily: FONT_STACK,
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 20,
    fontWeight: '600',
  },
  keynoteCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  keynoteCtaText: {
    fontFamily: FONT_STACK,
    fontSize: 13.5,
    fontWeight: '600',
    letterSpacing: -0.1,
  },

  // Specifications Callout
  specRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  specIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  specTitle: {
    fontFamily: FONT_STACK,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  specDesc: {
    fontFamily: FONT_STACK,
    fontSize: 11.5,
    lineHeight: 16,
  },

  // Calendar Inset
  calendarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  calendarDatePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  calendarDateText: {
    fontFamily: FONT_STACK,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  calendarTitle: {
    fontFamily: FONT_STACK,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  calendarLocation: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    marginTop: 2,
  },
  calendarNotifyBtn: {
    padding: 8,
    borderRadius: 8,
  },

  // Institutional Card
  institutionalCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 24,
  },
  institutionalTitle: {
    fontFamily: FONT_STACK,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  institutionalBody: {
    fontFamily: FONT_STACK,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  institutionalLink: {
    alignSelf: 'flex-start',
  },
  institutionalLinkText: {
    fontFamily: FONT_STACK,
    fontSize: 12.5,
    fontWeight: '600',
  },

  // Archive Shelf
  archiveShelfWrap: {
    marginTop: 6,
  },
  archiveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  archiveCard: {
    width: '48%',
    aspectRatio: 16 / 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    position: 'relative',
    backgroundColor: '#000000',
  },
  archiveThumb: {
    width: '100%',
    height: '100%',
    opacity: 0.88,
  },
  archiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    padding: 10,
    justifyContent: 'space-between',
  },
  archiveName: {
    fontFamily: FONT_STACK,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
  },
  archiveMeta: {
    fontFamily: FONT_STACK,
    color: '#6EE7B7',
    fontSize: 10.5,
    fontWeight: '600',
  },
});
