import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Header } from './src/components/Header';
import { BottomNav } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { WatchScreen } from './src/screens/WatchScreen';
import { LiveTvScreen } from './src/screens/LiveTvScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { TravelScreen } from './src/screens/TravelScreen';
import { VodScreen } from './src/screens/VodScreen';
import {
  FullscreenQrModal,
  MerchantDetailSheet,
  NotificationInboxSheet,
  OnboardingSheet,
  PlayerSheet,
  RegisterSheet,
  SlideOutDrawer,
} from './src/components/VideoPlayerModal';
import { YouTubePlayerModal } from './src/components/YouTubePlayerModal';
import { YouTubeVideoItem } from '@ilc/shared';
import {
  HUBS,
  INITIAL_CONTINUE_WATCHING,
  INITIAL_NOTIFICATIONS,
  INITIAL_VIDEOS,
  NotificationItem,
  PROTOTYPE_THEMES,
  PrototypeFeedback,
  PrototypeMerchant,
  PrototypeTab,
  PrototypeTravelQuery,
  PrototypeVideo,
  ThemeMode,
  VideoCategoryFilter,
  WatchHistoryItem,
} from './src/constants/prototypeTheme';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [tab, setTab] = useState<PrototypeTab>('home');

  // Member & Auth State
  const [reg, setReg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gift] = useState({
    text: 'Free coffee at a partner café',
    days: 7,
  });

  // First-launch Onboarding & Navigation Drawers/Sheets (accessible via Hamburger drawer)
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Video Catalog, Categories & Continue Watching State
  const [vids] = useState<PrototypeVideo[]>(INITIAL_VIDEOS);
  const [selectedCategory, setSelectedCategory] =
    useState<VideoCategoryFilter>('All');
  const [continueWatching, setContinueWatching] = useState<WatchHistoryItem[]>(
    INITIAL_CONTINUE_WATCHING
  );
  const [activeVideo, setActiveVideo] = useState<PrototypeVideo | null>(null);

  // Rewards, Merchant Detail & Fullscreen Cashier QR State
  const [city, setCity] = useState('All');
  const [selectedMerchant, setSelectedMerchant] =
    useState<PrototypeMerchant | null>(null);
  const [fullscreenQrOpen, setFullscreenQrOpen] = useState(false);
  const [qrMerchantContext, setQrMerchantContext] = useState<
    string | undefined
  >(undefined);

  // Travel State
  const [travelQuery, setTravelQuery] = useState<PrototypeTravelQuery>({
    type: 'Flights',
    from: 'Bacolod (BCD)',
    to: 'Cebu (CEB)',
    date: '',
  });
  const [searched, setSearched] = useState(false);

  // Profile, Notification Toggles, Inbox & Feedback State
  const [geoAlertsEnabled, setGeoAlertsEnabled] = useState(true);
  const [announcementsEnabled, setAnnouncementsEnabled] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [fb, setFb] = useState<PrototypeFeedback[]>([]);
  const [rating, setRating] = useState(0);
  const [hub, setHub] = useState<string>(HUBS[0]);
  const [selectedYouTubeVideo, setSelectedYouTubeVideo] =
    useState<YouTubeVideoItem | null>(null);
  const [toast, setToast] = useState<{ title: string; msg: string } | null>(
    null
  );

  const scrollRef = useRef<ScrollView>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = PROTOTYPE_THEMES[theme];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const pushToast = (
    title: string,
    msg: string,
    notifType: 'geo' | 'announcement' = 'announcement'
  ) => {
    setToast({ title, msg });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 6000);

    // Record in Notification Inbox
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: notifType,
        title,
        msg,
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleSelectTab = (nextTab: PrototypeTab) => {
    setTab(nextTab);
    setSelectedMerchant(null);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleRegister = (
    inputName: string,
    inputEmail: string,
    isGoogle: boolean
  ) => {
    const finalName = inputName.trim() || 'Juan dela Cruz';
    const finalEmail =
      inputEmail.trim() || (isGoogle ? 'juan@gmail.com' : 'juan@example.com');
    setName(finalName);
    setEmail(finalEmail);
    setReg(true);
    setRegisterOpen(false);
    setOnboardingOpen(false);
    setTab('rewards');
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    pushToast(
      `Welcome, ${finalName.split(' ')[0]}!`,
      `Your gift: ${gift.text}.`,
      'announcement'
    );
  };

  const handleUpdateWatchProgress = (videoId: string, progress: number) => {
    setContinueWatching((prev) => {
      const existing = prev.filter((item) => item.videoId !== videoId);
      const remainingPct = Math.max(1, 100 - progress);
      const minsLeft = Math.max(1, Math.round((remainingPct / 100) * 5));
      return [
        {
          videoId,
          progress: Math.min(98, Math.max(15, progress)),
          lastWatched: `${minsLeft}m left`,
        },
        ...existing,
      ];
    });
  };

  const handleSimulateGeo = () => {
    if (!geoAlertsEnabled) {
      setToast({
        title: 'Geo alerts paused',
        msg: 'Enable Geo arrival alerts in Notifications to receive airport partner offers.',
      });
      return;
    }
    const destCity = hub || 'Bacolod';
    pushToast(
      `Welcome to ${destCity}!`,
      reg
        ? 'Show your ILC card for 5% off at partner merchants.'
        : 'Join free and claim your welcome gift.',
      'geo'
    );
  };

  const handleSubmitFeedback = (
    target: string,
    starRating: number,
    comment: string
  ) => {
    setFb((prev) => [{ w: target, r: starRating, t: comment }, ...prev]);
    setRating(0);
    pushToast('Thank you', 'Your feedback went to the ILC team.');
  };

  const activeWatchProgress = activeVideo
    ? continueWatching.find((c) => c.videoId === activeVideo.id)?.progress || 15
    : 0;

  return (
    <SafeAreaView
      style={[
        styles.outerShell,
        { backgroundColor: t.bg },
        Platform.OS === 'web' &&
          ({ backgroundImage: t.stageGradient } as any),
      ]}
    >
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={t.phoneBg}
      />

      <View
        style={[
          styles.mobileAppContainer,
          {
            backgroundColor: t.phoneBg,
            borderColor: t.line,
          },
        ]}
      >
        {/* Persistent Mobile Brand Header */}
        <Header
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          isRegistered={reg}
          memberEmail={email}
          unreadNotificationsCount={unreadCount}
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenInbox={() => setInboxOpen(true)}
          onPressSearch={() => {
            setSearchOpen((prev) => !prev);
            if (tab !== 'home') {
              handleSelectTab('home');
            }
          }}
          onPressMember={() => {
            if (reg) {
              setQrMerchantContext(undefined);
              setFullscreenQrOpen(true);
            } else {
              setRegisterOpen(true);
            }
          }}
        />

        {/* In-App Push Toast Notification Banner */}
        {toast && (
          <TouchableOpacity
            style={[
              styles.banner,
              {
                backgroundColor: t.bannerBg,
                borderColor: t.bannerBorder,
              },
              Platform.OS === 'web' &&
                ({
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                } as any),
            ]}
            onPress={() => {
              setToast(null);
              setInboxOpen(true);
            }}
            activeOpacity={0.9}
          >
            <Text style={[styles.bannerHeader, { color: t.bannerText }]}>
              Island Living Channel · now
            </Text>
            <Text style={[styles.bannerBody, { color: t.bannerText }]}>
              <Text style={{ fontWeight: '700' }}>{toast.title}</Text>{' '}
              {toast.msg}
            </Text>
          </TouchableOpacity>
        )}

        {/* Main Scrollable Screen Content */}
        <ScrollView
          ref={scrollRef}
          style={styles.scr}
          contentContainerStyle={styles.scrContent}
          showsVerticalScrollIndicator={false}
        >
          {tab === 'home' && (
            <HomeScreen
              theme={theme}
              videos={vids}
              continueWatching={continueWatching}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              isRegistered={reg}
              memberName={name}
              gift={gift}
              onPlayVideo={(vid) => setActiveVideo(vid)}
              onOpenRegister={() => setRegisterOpen(true)}
              onSelectYouTubeVideo={(video) => setSelectedYouTubeVideo(video)}
              onPushToast={(title, msg) =>
                pushToast(title, msg, 'announcement')
              }
              onSelectTab={handleSelectTab}
              searchOpen={searchOpen}
              onCloseSearch={() => setSearchOpen(false)}
            />
          )}

          {tab === 'live' && (
            <LiveTvScreen theme={theme} onPushToast={pushToast} />
          )}

          {tab === 'rewards' && (
            <ProfileScreen
              theme={theme}
              isRegistered={reg}
              memberName={name}
              memberEmail={email}
              gift={gift}
              city={city}
              onSelectCity={setCity}
              onOpenRegister={() => setRegisterOpen(true)}
              onSelectMerchant={(m) => setSelectedMerchant(m)}
              onOpenFullscreenQr={(mName) => {
                setQrMerchantContext(mName);
                setFullscreenQrOpen(true);
              }}
              onPushToast={(title, msg) =>
                pushToast(title, msg, 'announcement')
              }
            />
          )}

          {tab === 'travel' && (
            <TravelScreen
              theme={theme}
              query={travelQuery}
              searched={searched}
              onChangeQuery={(next, reset) => {
                setTravelQuery((prev) => ({ ...prev, ...next }));
                if (reset) setSearched(false);
              }}
              onSearch={() => setSearched(true)}
              onPushToast={(title, msg) =>
                pushToast(title, msg, 'announcement')
              }
            />
          )}

          {tab === 'more' && (
            <VodScreen
              theme={theme}
              onToggleTheme={() =>
                setTheme(theme === 'light' ? 'dark' : 'light')
              }
              isRegistered={reg}
              memberName={name}
              memberEmail={email}
              geoAlertsEnabled={geoAlertsEnabled}
              onToggleGeoAlerts={() => setGeoAlertsEnabled((v) => !v)}
              announcementsEnabled={announcementsEnabled}
              onToggleAnnouncements={() => setAnnouncementsEnabled((v) => !v)}
              onOpenRegister={() => setRegisterOpen(true)}
              onOpenInbox={() => setInboxOpen(true)}
              onOpenOnboarding={() => setOnboardingOpen(true)}
              onOpenFullscreenQr={() => {
                setQrMerchantContext(undefined);
                setFullscreenQrOpen(true);
              }}
              onSignOut={() => {
                setReg(false);
                setName('');
                setEmail('');
                pushToast('Logged out', 'You have logged out of your account.');
              }}
              rating={rating}
              onChangeRating={setRating}
              hub={hub}
              onChangeHub={setHub}
              feedbackList={fb}
              onSubmitFeedback={handleSubmitFeedback}
              onSimulateGeo={handleSimulateGeo}
              onPushToast={(title, msg) =>
                pushToast(title, msg, 'announcement')
              }
            />
          )}
        </ScrollView>

        {/* Merchant Detail Sheet */}
        {selectedMerchant && (
          <MerchantDetailSheet
            theme={theme}
            merchant={selectedMerchant}
            isRegistered={reg}
            onClose={() => setSelectedMerchant(null)}
            onShowCashierQr={(mName) => {
              setQrMerchantContext(mName);
              setFullscreenQrOpen(true);
            }}
            onOpenRegister={() => setRegisterOpen(true)}
          />
        )}

        {/* Notification Inbox Sheet */}
        {inboxOpen && (
          <NotificationInboxSheet
            theme={theme}
            notifications={notifications}
            onMarkAllRead={() =>
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true }))
              )
            }
            onSelectNotification={(item) => {
              setNotifications((prev) =>
                prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
              );
              setInboxOpen(false);
              if (item.type === 'geo') {
                handleSelectTab('rewards');
              } else {
                handleSelectTab('home');
              }
            }}
            onClose={() => setInboxOpen(false)}
          />
        )}

        {/* Registration Modal Sheet */}
        {registerOpen && (
          <RegisterSheet
            theme={theme}
            onRegister={handleRegister}
            onCancel={() => setRegisterOpen(false)}
          />
        )}

        {/* Video Player Modal Sheet */}
        {activeVideo && (
          <PlayerSheet
            theme={theme}
            video={activeVideo}
            index={activeVideo.sceneIndex ?? 0}
            initialProgress={activeWatchProgress}
            onUpdateProgress={handleUpdateWatchProgress}
            onClose={() => setActiveVideo(null)}
          />
        )}

        {/* Fullscreen Cashier QR Modal */}
        {fullscreenQrOpen && (
          <FullscreenQrModal
            theme={theme}
            memberName={name}
            memberEmail={email}
            merchantName={qrMerchantContext}
            onClose={() => setFullscreenQrOpen(false)}
          />
        )}

        {/* First-Launch Onboarding Welcome Sheet */}
        {onboardingOpen && (
          <OnboardingSheet
            theme={theme}
            giftText={gift.text}
            onRegister={handleRegister}
            onSkip={() => setOnboardingOpen(false)}
          />
        )}

        {/* Slide-Out Hamburger Navigation Drawer */}
        {drawerOpen && (
          <SlideOutDrawer
            theme={theme}
            onClose={() => setDrawerOpen(false)}
            onNavigateCategory={(cat) => {
              setSelectedCategory(cat);
              handleSelectTab('home');
            }}
            onNavigateTab={(nextTab) => handleSelectTab(nextTab)}
            onOpenInbox={() => setInboxOpen(true)}
            onOpenOnboarding={() => setOnboardingOpen(true)}
          />
        )}

        {/* Official YouTube Video / Shorts Player Modal Sheet */}
        {selectedYouTubeVideo && (
          <YouTubePlayerModal
            theme={theme}
            video={selectedYouTubeVideo}
            onClose={() => setSelectedYouTubeVideo(null)}
          />
        )}

        {/* Floating Glass Bottom Navigation (hidden during full-screen Onboarding / Cashier QR) */}
        {!onboardingOpen && !fullscreenQrOpen && (
          <BottomNav
            currentTab={tab}
            onSelectTab={handleSelectTab}
            theme={theme}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerShell: {
    flex: 1,
    alignItems: 'center',
  },
  mobileAppContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 430 : undefined,
    position: 'relative',
    overflow: 'hidden',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  scr: {
    flex: 1,
  },
  scrContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  banner: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 14,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    zIndex: 15,
  },
  bannerHeader: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  bannerBody: {
    fontSize: 13,
    opacity: 0.92,
  },
});
