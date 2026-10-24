import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  FieldLabel,
  H1,
  H2,
  H3,
  MuteText,
  PromoBox,
  ProtoInput,
  ProtoSelect,
} from '../components/PrototypePrimitives';
import { ILCButton } from '../components/ILCButton';
import {
  HUBS,
  MERCHANTS,
  PROTOTYPE_THEMES,
  PrototypeFeedback,
  ThemeMode,
  computeMemberId,
} from '../constants/prototypeTheme';
import { RADII, TYPO } from '../constants/uiTokens';

interface MoreScreenProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  isRegistered: boolean;
  memberName: string;
  memberEmail: string;
  geoAlertsEnabled: boolean;
  onToggleGeoAlerts: () => void;
  announcementsEnabled: boolean;
  onToggleAnnouncements: () => void;
  onOpenRegister: () => void;
  onOpenInbox: () => void;
  onOpenOnboarding: () => void;
  onOpenFullscreenQr: () => void;
  onSignOut: () => void;
  rating: number;
  onChangeRating: (rating: number) => void;
  hub: string;
  onChangeHub: (hub: string) => void;
  feedbackList: PrototypeFeedback[];
  onSubmitFeedback: (target: string, rating: number, comment: string) => void;
  onSimulateGeo: () => void;
  onPushToast: (title: string, msg: string) => void;
}

const RATING_OPTIONS = [
  { label: 'The ILC app', value: 'The ILC app' },
  ...MERCHANTS.map((m) => ({ label: m.n, value: m.n })),
];

const HUB_OPTIONS = Object.keys(HUBS).map((h) => ({ label: h, value: h }));

export const VodScreen: React.FC<MoreScreenProps> = ({
  theme,
  onToggleTheme,
  isRegistered,
  memberName,
  memberEmail,
  geoAlertsEnabled,
  onToggleGeoAlerts,
  announcementsEnabled,
  onToggleAnnouncements,
  onOpenRegister,
  onOpenInbox,
  onOpenOnboarding,
  onOpenFullscreenQr,
  onSignOut,
  rating,
  onChangeRating,
  hub,
  onChangeHub,
  feedbackList,
  onSubmitFeedback,
  onSimulateGeo,
  onPushToast,
}) => {
  const t = PROTOTYPE_THEMES[theme];
  const [target, setTarget] = useState('The ILC app');
  const [comment, setComment] = useState('');

  const handleSendFeedback = () => {
    if (!rating) {
      onPushToast('Pick a rating', 'Tap a star before sending.');
      return;
    }
    onSubmitFeedback(target, rating, comment.trim() || '(no comment)');
    setComment('');
  };

  return (
    <View>
      <H1 theme={theme}>Profile & Settings</H1>
      <MuteText theme={theme} style={{ marginTop: 4, marginBottom: 8 }}>
        Manage digital pass credentials, airport geofence alerts, and viewing preferences.
      </MuteText>

      {/* Account Details Card */}
      <PromoBox theme={theme} style={{ marginTop: 10, marginBottom: 4 }}>
        {isRegistered ? (
          <View>
            <View style={styles.accountHeader}>
              <View
                style={[
                  styles.avatarCircle,
                  { backgroundColor: t.brand },
                ]}
              >
                <Text style={[styles.avatarInitials, { color: t.on }]}>
                  {(memberName || 'J')
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <H3 theme={theme}>{memberName}</H3>
                <MuteText theme={theme}>{memberEmail}</MuteText>
                <Text style={[styles.memberBadgeText, { color: t.brand }]}>
                  Active Member · {computeMemberId(memberEmail)}
                </Text>
              </View>
            </View>

            <View style={styles.accountActions}>
              <ILCButton
                theme={theme}
                variant="primary"
                size="sm"
                icon="maximize-2"
                label="Show QR Card"
                onPress={onOpenFullscreenQr}
                style={{ flex: 1 }}
              />
              <ILCButton
                theme={theme}
                variant="outline"
                size="sm"
                icon="log-out"
                label="Log out"
                onPress={onSignOut}
              />
            </View>
          </View>
        ) : (
          <View>
            <H3 theme={theme}>Guest Traveler</H3>
            <MuteText theme={theme} style={{ marginTop: 4, marginBottom: 12 }}>
              Create your free account to unlock your digital membership card,
              welcome gift, and 5% partner discount.
            </MuteText>
            <ILCButton
              theme={theme}
              variant="primary"
              size="md"
              fullWidth
              label="Create free account"
              onPress={onOpenRegister}
            />
          </View>
        )}
      </PromoBox>

      {/* Notification Toggles & Inbox */}
      <H2 theme={theme}>Notifications</H2>

      <TouchableOpacity
        style={[styles.settingRow, { borderBottomColor: t.line }]}
        onPress={onToggleGeoAlerts}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.settingTitle, { color: t.ink }]}>
            Geo arrival alerts
          </Text>
          <MuteText theme={theme}>
            Airport & ferry terminal partner discount pushes
          </MuteText>
        </View>
        <View
          style={[
            styles.toggleTrack,
            {
              backgroundColor: geoAlertsEnabled ? t.brand : t.inputBg,
              borderColor: geoAlertsEnabled ? t.brand : t.line,
            },
          ]}
        >
          <View
            style={[
              styles.toggleThumb,
              {
                backgroundColor: geoAlertsEnabled ? t.on : t.mute,
                transform: [{ translateX: geoAlertsEnabled ? 18 : 0 }],
              },
            ]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.settingRow, { borderBottomColor: t.line }]}
        onPress={onToggleAnnouncements}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.settingTitle, { color: t.ink }]}>
            Announcements & premieres
          </Text>
          <MuteText theme={theme}>
            New Island Living episodes and live stream reminders
          </MuteText>
        </View>
        <View
          style={[
            styles.toggleTrack,
            {
              backgroundColor: announcementsEnabled ? t.brand : t.inputBg,
              borderColor: announcementsEnabled ? t.brand : t.line,
            },
          ]}
        >
          <View
            style={[
              styles.toggleThumb,
              {
                backgroundColor: announcementsEnabled ? t.on : t.mute,
                transform: [{ translateX: announcementsEnabled ? 18 : 0 }],
              },
            ]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.settingRow, { borderBottomColor: t.line }]}
        onPress={onOpenInbox}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.settingTitle, { color: t.ink }]}>
            Notification inbox
          </Text>
          <MuteText theme={theme}>
            View past geo arrival alerts and channel announcements
          </MuteText>
        </View>
        <Feather name="chevron-right" size={18} color={t.mute} />
      </TouchableOpacity>

      {/* Rate Your Experience Section */}
      <H2 theme={theme}>Rate your experience</H2>
      <FieldLabel theme={theme}>What are you rating?</FieldLabel>
      <ProtoSelect
        theme={theme}
        options={RATING_OPTIONS}
        value={target}
        onChange={setTarget}
      />

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((n) => {
          const isOn = rating >= n;
          return (
            <TouchableOpacity
              key={n}
              style={styles.starBtn}
              onPress={() => onChangeRating(n)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.starText,
                  { color: isOn ? '#F2A65A' : t.line },
                ]}
              >
                ★
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ProtoInput
        theme={theme}
        value={comment}
        onChangeText={setComment}
        placeholder="Tell us what worked and what didn’t"
        multiline
        numberOfLines={3}
      />

      <ILCButton
        theme={theme}
        variant="primary"
        size="md"
        fullWidth
        label="Send feedback"
        onPress={handleSendFeedback}
      />

      {feedbackList.length > 0 && (
        <View style={{ marginTop: 14 }}>
          {feedbackList.slice(0, 3).map((f, idx) => (
            <View
              key={idx}
              style={[styles.fbRow, { borderBottomColor: t.line }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingTitle, { color: t.ink }]}>{f.w}</Text>
                <MuteText theme={theme}>{f.t}</MuteText>
              </View>
              <Text style={[styles.fbStars, { color: t.hib }]}>
                {'★'.repeat(f.r)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Arrival Hub Test & App Preferences */}
      <H2 theme={theme}>Travel gateway & app</H2>
      <FieldLabel theme={theme}>Current arrival hub</FieldLabel>
      <ProtoSelect
        theme={theme}
        options={HUB_OPTIONS}
        value={hub}
        onChange={onChangeHub}
      />

      <ILCButton
        theme={theme}
        variant="outline"
        size="md"
        fullWidth
        icon="navigation"
        label="Test arrival geo alert"
        onPress={onSimulateGeo}
      />

      <View style={[styles.settingRow, { borderBottomColor: t.line, marginTop: 10 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.settingTitle, { color: t.ink }]}>Appearance</Text>
          <MuteText theme={theme}>
            {theme === 'dark' ? 'Dark forest theme' : 'Light island theme'}
          </MuteText>
        </View>
        <ILCButton
          theme={theme}
          variant="outline"
          size="sm"
          label={theme === 'dark' ? '☀ Light' : '☾ Dark'}
          onPress={onToggleTheme}
        />
      </View>

      <TouchableOpacity
        style={[styles.settingRow, { borderBottomWidth: 0 }]}
        onPress={onOpenOnboarding}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.settingTitle, { color: t.ink }]}>
            Welcome tour & airport journey
          </Text>
          <MuteText theme={theme}>
            Replay the 3-step Island Living onboarding guide
          </MuteText>
        </View>
        <Feather name="compass" size={18} color={t.brand} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 17,
    fontWeight: '700',
  },
  memberBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  toggleTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  starBtn: {
    paddingHorizontal: 2,
  },
  starText: {
    fontSize: 28,
  },
  fbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  fbStars: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
