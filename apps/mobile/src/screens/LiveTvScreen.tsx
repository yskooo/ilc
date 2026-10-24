import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  Image,
} from 'react-native';
import {
  H1,
  H2,
  MuteText,
} from '../components/PrototypePrimitives';
import { ILCButton } from '../components/ILCButton';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import {
  LIVE_SCHEDULE,
  PROTOTYPE_THEMES,
  ThemeMode,
} from '../constants/prototypeTheme';
import { RADII, TYPO } from '../constants/uiTokens';
import {
  youtubeService,
  ILC_CHANNEL_HANDLE,
  ILC_CHANNEL_URL,
} from '../services/youtube';

interface LiveTvScreenProps {
  theme: ThemeMode;
  onPushToast: (title: string, msg: string) => void;
}

export const LiveTvScreen: React.FC<LiveTvScreenProps> = ({
  theme,
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const stream = youtubeService.getRealLiveStream();
  const categories = youtubeService.getRealCategories();
  const [reminders, setReminders] = useState<Record<number, boolean>>({});

  const streamVideoId = stream?.videoId || 'P-iu1vverWQ';
  const streamUrl = `https://www.youtube.com/watch?v=P-iu1vverWQ`;
  const embedUrl = `https://www.youtube.com/embed/${streamVideoId}?playsinline=1`;
  const streamTitle =
    stream?.title ||
    'Join Island Living Channel on a cruise adventure as we Cruise around Asia!';

  const handleToggleReminder = (idx: number, title: string) => {
    const isSet = !!reminders[idx];
    setReminders((prev) => ({ ...prev, [idx]: !isSet }));
    if (!isSet) {
      onPushToast(
        'Reminder Set',
        `We’ll notify you before "${title}" starts.`
      );
    } else {
      onPushToast('Reminder Removed', `Cancelled alert for "${title}".`);
    }
  };

  const handleOpenStreamOnYouTube = () => {
    Linking.openURL(streamUrl).catch(() => {
      onPushToast('Error', 'Unable to open YouTube link.');
    });
  };

  const handleSubscribe = () => {
    Linking.openURL(ILC_CHANNEL_URL).catch(() => {
      onPushToast('Error', 'Unable to open YouTube channel.');
    });
  };

  const handleShareStream = () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && (navigator as any).clipboard) {
      (navigator as any).clipboard.writeText(streamUrl);
      onPushToast('Stream Link Copied', 'YouTube Live stream link copied to clipboard.');
    } else {
      onPushToast('Stream Link', streamUrl);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title & Subtitle */}
      <H1 theme={theme}>Live TV</H1>
      <MuteText theme={theme} style={styles.subtitle}>
        Official live broadcasts, festival events, and cultural specials streaming directly from the Visayas.
      </MuteText>

      {/* Stream Status Header */}
      <View style={styles.statusRow}>
        <View style={styles.liveBadgeRow}>
          <View style={styles.livePill}>
            <View style={styles.livePillDot} />
            <Text style={styles.livePillText}>OFFICIAL LIVE STREAM</Text>
          </View>
          <View style={[styles.hdBadge, { borderColor: t.line }]}>
            <Text style={[styles.hdBadgeText, { color: t.mute }]}>1080p HD</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.subBtn, { borderColor: t.line }]}
          onPress={handleSubscribe}
          activeOpacity={0.8}
        >
          <Text style={[styles.subBtnText, { color: t.tabOnColor }]}>Subscribe</Text>
        </TouchableOpacity>
      </View>

      {/* Embedded YouTube Player */}
      <View
        style={[
          styles.playerContainer,
          Platform.OS === 'web' &&
            ({
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.45)',
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

      {/* Stream Info Card */}
      <View
        style={[
          styles.infoCard,
          { backgroundColor: t.surf, borderColor: t.line },
        ]}
      >
        <Text
          style={[
            styles.streamTitle,
            TYPO.h2,
            { color: t.ink },
          ]}
        >
          {streamTitle}
        </Text>

        {/* Channel Details & Actions */}
        <View style={styles.channelRow}>
          <View style={styles.channelMeta}>
            <View style={styles.channelAvatar}>
              <Text style={styles.channelAvatarText}>ILC</Text>
            </View>
            <View>
              <Text style={[styles.channelTitle, { color: t.ink }]}>
                Island Living Channel
              </Text>
              <MuteText theme={theme} style={styles.channelHandle}>
                {ILC_CHANNEL_HANDLE} · Official Broadcast
              </MuteText>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <ILCButton
              theme={theme}
              variant="outline"
              size="sm"
              icon="external-link"
              iconPosition="right"
              label="YouTube"
              onPress={handleOpenStreamOnYouTube}
            />
            <ILCButton
              theme={theme}
              variant="secondary"
              size="sm"
              icon="share-2"
              iconPosition="left"
              label="Share"
              onPress={handleShareStream}
            />
          </View>
        </View>

        {/* Live Broadcast Details */}
        <View style={[styles.detailsBox, { backgroundColor: t.promoBg, borderColor: t.promoBorder }]}>
          <Text style={[styles.detailsHeadline, { color: t.ink }]}>
            🌴 Asia Cruise Expedition Special
          </Text>
          <MuteText theme={theme} style={styles.detailsBody}>
            Experience real-time adventures, festival coverages, and island lifestyle broadcasts.
            Live chat and real-time community engagement take place directly on YouTube Live.
          </MuteText>
        </View>
      </View>

      {/* Program Schedule / Up Next */}
      <H2 theme={theme} style={styles.scheduleHeader}>
        Coming Up on Live TV
      </H2>

      {LIVE_SCHEDULE.map(([time, title], idx) => {
        const isSet = !!reminders[idx];
        return (
          <View
            key={idx}
            style={[styles.scheduleRow, { borderBottomColor: t.line }]}
          >
            <View style={styles.scheduleInfo}>
              <Text style={[styles.scheduleTitle, { color: t.ink }]}>
                {title}
              </Text>
              <View style={styles.timeTag}>
                <Text style={styles.timeTagIcon}>⏰</Text>
                <MuteText theme={theme} style={styles.scheduleTime}>
                  {time}
                </MuteText>
              </View>
            </View>
            <ILCButton
              theme={theme}
              variant={isSet ? 'primary' : 'outline'}
              size="sm"
              icon={isSet ? 'check' : 'bell'}
              iconPosition="left"
              label={isSet ? 'Reminded' : 'Remind me'}
              onPress={() => handleToggleReminder(idx, title)}
            />
          </View>
        );
      })}

      {/* Related Playlists & Festival Series */}
      {categories && categories.length > 0 && (
        <View style={styles.categoriesSection}>
          <H2 theme={theme} style={styles.categoriesHeader}>
            Featured Playlists & Festivals
          </H2>
          <MuteText theme={theme} style={styles.categoriesSub}>
            Explore island journeys curated by Island Living Channel.
          </MuteText>

          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  { backgroundColor: t.surf, borderColor: t.line },
                ]}
                onPress={() => Linking.openURL(cat.playlistUrl).catch(() => {})}
                activeOpacity={0.85}
              >
                <Image
                  source={{ uri: cat.thumbnail }}
                  style={styles.categoryThumb}
                  resizeMode="cover"
                />
                <View style={styles.categoryOverlay}>
                  <Text style={styles.categoryName} numberOfLines={2}>
                    {cat.name}
                  </Text>
                  <Text style={styles.categoryAction}>View Playlist ↗</Text>
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
    paddingBottom: 40,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E1251B',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  livePillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  livePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  hdBadge: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  hdBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  subBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 26,
  },
  streamTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 14,
  },
  channelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  channelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  channelAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  channelTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  channelHandle: {
    fontSize: 11.5,
    marginTop: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  detailsHeadline: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailsBody: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  scheduleHeader: {
    marginBottom: 8,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeTagIcon: {
    fontSize: 11,
  },
  scheduleTime: {
    fontSize: 12,
  },
  categoriesSection: {
    marginTop: 26,
  },
  categoriesHeader: {
    marginBottom: 2,
  },
  categoriesSub: {
    fontSize: 12.5,
    marginBottom: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 16 / 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  categoryThumb: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
    padding: 10,
    justifyContent: 'space-between',
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    lineHeight: 16,
  },
  categoryAction: {
    color: '#34d399',
    fontSize: 10.5,
    fontWeight: '700',
  },
});
