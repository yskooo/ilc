import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  H1,
  H2,
  H3,
  MuteText,
  PromoBox,
  ProtoChip,
} from '../components/PrototypePrimitives';
import { ILCButton } from '../components/ILCButton';
import { VideoCard } from '../components/VideoCard';
import { ShortsCard } from '../components/ShortsCard';
import { CinematicHero } from '../components/CinematicHero';
import { PromoBannerCarousel } from '../components/PromoBannerCarousel';
import { SponsoredPublicationBanner } from '../components/SponsoredPublicationBanner';
import {
  OriginalsPosterCard,
  ILC_ORIGINALS_CATALOG,
  OriginalsPosterItem,
} from '../components/OriginalsPosterCard';
import {
  PROTOTYPE_THEMES,
  PrototypeTab,
  PrototypeVideo,
  ThemeMode,
  VIDEO_CATEGORIES,
  VideoCategoryFilter,
  WatchHistoryItem,
} from '../constants/prototypeTheme';
import { RADII, TYPO } from '../constants/uiTokens';
import { YouTubeVideoItem } from '@ilc/shared';
import { youtubeService } from '../services/youtube';

interface HomeScreenProps {
  theme: ThemeMode;
  videos: PrototypeVideo[];
  continueWatching: WatchHistoryItem[];
  selectedCategory: VideoCategoryFilter;
  onSelectCategory: (cat: VideoCategoryFilter) => void;
  isRegistered: boolean;
  memberName: string;
  gift: { text: string; days: number };
  onPlayVideo: (video: PrototypeVideo) => void;
  onOpenRegister: () => void;
  onSelectYouTubeVideo?: (video: YouTubeVideoItem) => void;
  onPushToast?: (title: string, msg: string) => void;
  onSelectTab?: (tab: PrototypeTab) => void;
  searchOpen?: boolean;
  onCloseSearch?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  theme,
  videos,
  continueWatching,
  selectedCategory,
  onSelectCategory,
  isRegistered,
  memberName,
  gift,
  onPlayVideo,
  onOpenRegister,
  onSelectYouTubeVideo,
  onPushToast,
  onSelectTab,
  searchOpen = false,
  onCloseSearch,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = (memberName || 'Juan').split(' ')[0];
  const featured = videos[0];

  const filteredVideos = videos.filter((v) => {
    const matchesCat =
      selectedCategory === 'All' ||
      v.category === selectedCategory ||
      v.region === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      v.t.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesCat && matchesSearch;
  });

  const continueItems = continueWatching
    .map((cw) => {
      const vid = videos.find((v) => v.id === cw.videoId);
      return vid ? { video: vid, ...cw } : null;
    })
    .filter(Boolean) as (WatchHistoryItem & { video: PrototypeVideo })[];

  const [ytVideos, setYtVideos] = useState<YouTubeVideoItem[]>(
    youtubeService.getRealVideos()
  );
  const [ytShorts, setYtShorts] = useState<YouTubeVideoItem[]>(
    youtubeService.getRealShorts()
  );
  const [loadingYt, setLoadingYt] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await youtubeService.fetchWatchData();
        if (isMounted && data.videos && data.videos.length > 0) {
          setYtVideos(data.videos);
          setYtShorts(data.shorts);
        }
      } catch (err) {
        console.warn('[HomeScreen] Could not load live YouTube content:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerGreetingWrap}>
        <Text style={[styles.headerGreetingTitle, { color: t.ink }]}>
          {isRegistered ? `Welcome back, ${firstName}` : `Welcome, ${firstName}`}
        </Text>
        {/* <Text
          style={[
            styles.headerGreetingSub,
            { color: isDark ? 'rgba(255,255,255,0.65)' : '#6C7E72' },
          ]}
        >
          Curated coastal cinema, live cultural broadcasts, and exclusive member privileges.
        </Text> */}
      </View>

      {/* Expandable Search Bar (Activated via Top Right Search Icon) */}
      {(searchOpen || searchQuery.length > 0) && (
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: t.inputBg,
              borderColor: t.inputBorder,
              marginTop: 12,
              marginBottom: 4,
            },
          ]}
        >
          <Feather name="search" size={16} color={t.mute} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search films, island culinary, resorts & festivals..."
            placeholderTextColor={t.mute}
            autoFocus={searchOpen}
            style={[styles.searchInput, { color: t.ink }]}
          />
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              if (onCloseSearch) onCloseSearch();
            }}
          >
            <Feather name="x-circle" size={16} color={t.mute} />
          </TouchableOpacity>
        </View>
      )}

      {/* Cinematic Hero Showcase (Matching Netflix Reference Layout) */}
      {featured && selectedCategory === 'All' && !searchQuery.trim() && (
        <CinematicHero
          theme={theme}
          title={featured.t || 'Lagoon Diaries: El Nido'}
          tagline="TRAVEL · ILC ORIGINAL"
          synopsis="Hop between hidden lagoons and limestone cathedrals with local boatmen who've mapped these waters for generations."
          imageUrl={featured.thumbnailUrl || 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1080&q=85'}
          duration={featured.m || '28m'}
          onWatchNow={() => onPlayVideo(featured)}
          onToggleMyList={(added) => {
            if (onPushToast) {
              onPushToast(
                added ? 'Added to My List' : 'Removed from List',
                `"${featured.t}" saved to your private playlist.`
              );
            }
          }}
          onOpenDetails={() => onPlayVideo(featured)}
        />
      )}

      {/* Infinite Swipable Promo Banner Carousel (GCash Banner Style: Membership, Otamigo Ads, Resorts) */}
      {!searchQuery.trim() && (
        <PromoBannerCarousel
          theme={theme}
          onOpenMembership={onOpenRegister}
          onOpenTravel={() => {
            if (onSelectTab) onSelectTab('travel');
          }}
          onOpenLiveTv={() => {
            if (onSelectTab) onSelectTab('live');
          }}
          onPushToast={onPushToast}
        />
      )}

      {/* ORIGINALS & EXCLUSIVES (Matching Netflix Reference Layout) */}
      {selectedCategory === 'All' && !searchQuery.trim() && (
        <View style={{ marginBottom: 20 }}>
          <View style={styles.sectionHeader}>
            <View>
              <View style={styles.sectionBadgeRow}>
                <View style={[styles.shortsTag, { backgroundColor: '#C9DC3F' }]}>
                  <Text style={[styles.shortsTagIcon, { color: '#06240F' }]}>★</Text>
                  <Text style={[styles.shortsTagText, { color: '#06240F' }]}>ILC EXCLUSIVES</Text>
                </View>
              </View>
              <H2 theme={theme} style={{ marginTop: 2, marginBottom: 0 }}>
                Originals & Exclusives
              </H2>
            </View>
            <MuteText theme={theme} style={styles.shortsSubHint}>
              Cinematic series
            </MuteText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 8, paddingTop: 4 }}
          >
            {ILC_ORIGINALS_CATALOG.map((orig) => (
              <OriginalsPosterCard
                key={orig.id}
                item={orig}
                theme={theme}
                onPress={(item) => {
                  onPlayVideo({
                    id: item.id,
                    t: item.title,
                    m: item.duration,
                    category: 'Originals',
                    sceneIndex: 0,
                    thumbnailUrl: item.imageUrl,
                    embedUrl: item.embedUrl,
                    isShort: false,
                  });
                }}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Welcome Gift Promo Banner */}
      {!isRegistered && (
        <PromoBox theme={theme} style={{ marginTop: 16 }}>
          <H3 theme={theme}>Join free, get a welcome gift</H3>
          <MuteText theme={theme} style={styles.promoSub}>
            {gift.text}. Valid {gift.days} days after you register.
          </MuteText>
          <ILCButton
            theme={theme}
            variant="primary"
            size="md"
            fullWidth
            label="Create free account"
            onPress={onOpenRegister}
          />
        </PromoBox>
      )}

      {/* Video Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {VIDEO_CATEGORIES.map((cat) => (
          <ProtoChip
            key={cat}
            theme={theme}
            label={cat}
            active={selectedCategory === cat}
            onPress={() => onSelectCategory(cat)}
          />
        ))}
        {(selectedCategory === 'Philippines' ||
          selectedCategory === 'International') && (
            <ProtoChip
              theme={theme}
              label={`${selectedCategory} ✕`}
              active
              onPress={() => onSelectCategory('All')}
            />
          )}
      </ScrollView>

      {/* Continue Watching Row */}
      {continueItems.length > 0 && !searchQuery.trim() && (
        <View>
          <H2 theme={theme}>Continue watching</H2>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 8 }}
          >
            {continueItems.map((item, idx) => (
              <VideoCard
                key={item.video.id}
                video={item.video}
                index={idx}
                onPress={() => onPlayVideo(item.video)}
                theme={theme}
                layout="continue"
                progress={item.progress}
                resumeLabel={item.lastWatched}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* DEDICATED YOUTUBE SHORTS SECTION (Portrait Rectangle Cards) */}
      <View style={styles.sectionHeader}>
        <View>
          <View style={styles.sectionBadgeRow}>
            <View style={styles.shortsTag}>
              <Text style={styles.shortsTagIcon}>⚡</Text>
              <Text style={styles.shortsTagText}>ILC SHORTS</Text>
            </View>
          </View>
          <H2 theme={theme} style={{ marginTop: 2, marginBottom: 0 }}>
            Island Shorts & Reels
          </H2>
        </View>
        <MuteText theme={theme} style={styles.shortsSubHint}>
          Vertical stories
        </MuteText>
      </View>

      {loadingYt ? (
        <View style={styles.sectionLoading}>
          <ActivityIndicator size="small" color={t.tabOnColor} />
          <Text style={[styles.loadingHint, { color: t.mute }]}>Loading Shorts...</Text>
        </View>
      ) : ytShorts.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shortsCarousel}
        >
          {ytShorts.map((short) => (
            <ShortsCard
              key={short.id}
              item={short}
              theme={theme}
              onPress={(s) => {
                if (onSelectYouTubeVideo) {
                  onSelectYouTubeVideo(s);
                } else {
                  onPlayVideo({
                    id: s.id,
                    t: s.title,
                    m: 'Short',
                    category: 'Shorts',
                    sceneIndex: 0,
                    videoUrl: s.videoUrl,
                    embedUrl: s.embedUrl,
                    thumbnailUrl: s.thumbnailUrl,
                    isShort: true,
                  });
                }
              }}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.emptyBox, { borderColor: t.line }]}>
          <Text style={[styles.emptyText, { color: t.mute }]}>
            Shorts will appear here when posted on @islandlivingchannel1087
          </Text>
        </View>
      )}

      {/* DEDICATED OFFICIAL YOUTUBE VIDEOS SECTION */}
      {ytVideos.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <View style={styles.sectionHeader}>
            <View>
              <H2 theme={theme} style={{ marginBottom: 0 }}>
                Featured Island Cinema
              </H2>
              <MuteText theme={theme} style={{ marginTop: 2 }}>
                Full-length broadcasts curated from Island Living Channel
              </MuteText>
            </View>
          </View>

          <View style={styles.ytVideosGrid}>
            {ytVideos.slice(0, 4).map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.ytGridItem,
                  {
                    backgroundColor: t.surf,
                    borderColor: t.line,
                  },
                ]}
                onPress={() => onSelectYouTubeVideo && onSelectYouTubeVideo(v)}
                activeOpacity={0.88}
              >
                <View style={styles.ytThumbWrap}>
                  <Image
                    source={{ uri: v.thumbnailUrl }}
                    style={styles.ytThumb}
                    resizeMode="cover"
                  />
                  {v.durationFormatted ? (
                    <View style={styles.ytDurationBadge}>
                      <Text style={styles.ytDurationText}>{v.durationFormatted}</Text>
                    </View>
                  ) : null}
                  <View style={styles.ytPlayCircle}>
                    <Text style={styles.ytPlayTriangle}>▶</Text>
                  </View>
                </View>
                <View style={styles.ytMetaWrap}>
                  <Text style={[styles.ytTitle, { color: t.ink }]} numberOfLines={2}>
                    {v.title}
                  </Text>
                  <Text style={[styles.ytDate, { color: t.mute }]}>
                    {new Date(v.publishedAt).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Catch Up / Filtered Video Grid */}
      <H2 theme={theme}>
        {selectedCategory === 'All' ? 'Catch up' : selectedCategory}
      </H2>

      {filteredVideos.length > 0 ? (
        <View style={styles.grid}>
          {filteredVideos.map((v, i) => (
            <VideoCard
              key={v.id}
              video={v}
              index={i}
              onPress={() => onPlayVideo(v)}
              theme={theme}
              layout="grid"
            />
          ))}
        </View>
      ) : (
        <PromoBox theme={theme}>
          <H3 theme={theme}>No matching episodes</H3>
          <MuteText theme={theme} style={{ marginTop: 4, marginBottom: 10 }}>
            Try clearing your search or selecting another category.
          </MuteText>
          <ILCButton
            theme={theme}
            variant="outline"
            size="sm"
            label="Reset filters"
            onPress={() => {
              setSearchQuery('');
              onSelectCategory('All');
            }}
          />
        </PromoBox>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  headerGreetingWrap: {
    paddingTop: 22,
    paddingBottom: 6,
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  headerGreetingTitle: {
    ...TYPO.bodyBold,
    fontSize: 18.5,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  headerGreetingSub: {
    ...TYPO.footnote,
    fontSize: 12,
    lineHeight: 16.5,
    marginTop: 3,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    paddingVertical: 0,
  },
  chipsScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  promoSub: {
    marginTop: 4,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shortsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF0050',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  shortsTagIcon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  shortsTagText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  shortsSubHint: {
    fontSize: 12,
  },
  sectionLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  loadingHint: {
    fontSize: 12,
  },
  shortsCarousel: {
    paddingRight: 10,
    gap: 12,
  },
  shortCard: {
    width: 140,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
  },
  shortThumbWrapper: {
    width: '100%',
    height: 220, // Portrait rectangle 9:16 aspect ratio
    position: 'relative',
    backgroundColor: '#000',
  },
  shortThumb: {
    width: '100%',
    height: '100%',
  },
  shortOverlayGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  shortPlayBadge: {
    position: 'absolute',
    top: '40%',
    left: '38%',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortPlayTriangle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 2,
  },
  shortDurationPill: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  shortDurationText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  shortMeta: {
    padding: 8,
  },
  shortTitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 4,
  },
  shortDate: {
    fontSize: 10.5,
  },
  emptyBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  ytVideosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  ytGridItem: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 6,
  },
  ytThumbWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    backgroundColor: '#000',
  },
  ytThumb: {
    width: '100%',
    height: '100%',
  },
  ytDurationBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  ytDurationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  ytPlayCircle: {
    position: 'absolute',
    top: '35%',
    left: '40%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ytPlayTriangle: {
    color: '#FFFFFF',
    fontSize: 13,
    marginLeft: 2,
  },
  ytMetaWrap: {
    padding: 9,
  },
  ytTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 4,
  },
  ytDate: {
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
