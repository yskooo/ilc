'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  UserProfile,
  Video,
  VideoCategory,
  WelcomeGift,
  MemberGift,
  NotificationCampaign,
  CampaignLocation,
  Feedback,
  SanitizedMemberProfile,
  AuditEvent,
} from '@ilc/shared';

export default function CMSDashboard() {
  // --- AUTH STATE ---
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string>('');
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('admin@islandlivingchannel.tv');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // --- NAVIGATION ---
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'vod' | 'gifts' | 'notifications' | 'locations' | 'feedback' | 'members' | 'settings'
  >('dashboard');

  // --- DATA STATES ---
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [vodFilterStatus, setVodFilterStatus] = useState<string>('all');
  const [vodFilterCategory, setVodFilterCategory] = useState<string>('');
  const [vodSearch, setVodSearch] = useState<string>('');

  const [welcomeGifts, setWelcomeGifts] = useState<WelcomeGift[]>([]);
  const [memberGifts, setMemberGifts] = useState<Array<MemberGift & { gift?: WelcomeGift; user_display_name?: string }>>([]);
  const [giftViewMode, setGiftViewMode] = useState<'catalog' | 'issued'>('catalog');

  const [notifications, setNotifications] = useState<NotificationCampaign[]>([]);
  const [locations, setLocations] = useState<CampaignLocation[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [feedbackFilterStatus, setFeedbackFilterStatus] = useState<string>('all');
  const [members, setMembers] = useState<SanitizedMemberProfile[]>([]);
  const [memberSearch, setMemberSearch] = useState<string>('');
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

  // --- MODALS & WORKFLOWS ---
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Islands & Beaches');
  const [uploadTags, setUploadTags] = useState('Palawan, Beaches');
  const [uploadStatus, setUploadStatus] = useState<'published' | 'draft'>('published');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [isAddGiftModalOpen, setIsAddGiftModalOpen] = useState(false);
  const [giftTitle, setGiftTitle] = useState('');
  const [giftDescription, setGiftDescription] = useState('');
  const [giftValidityDays, setGiftValidityDays] = useState(30);
  const [giftInstructions, setGiftInstructions] = useState('');
  const [giftNewMemberOnly, setGiftNewMemberOnly] = useState(true);

  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [campaignDeepLink, setCampaignDeepLink] = useState('');
  const [confirmBroadcastCampaign, setConfirmBroadcastCampaign] = useState<NotificationCampaign | null>(null);

  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [locName, setLocName] = useState('');
  const [locLat, setLocLat] = useState('11.9592');
  const [locLng, setLocLng] = useState('121.9272');
  const [locRadius, setLocRadius] = useState(800);

  const [feedbackModalItem, setFeedbackModalItem] = useState<Feedback | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Check auth session on load
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        loadAllData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Login failed');
        return;
      }
      setUser(data.user);
      setToken(data.token);
      showToast(`Welcome back, ${data.user.display_name}!`);
      loadAllData();
    } catch (err: any) {
      setLoginError(err.message || 'Network error');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'POST' });
    setUser(null);
    setToken('');
    showToast('Signed out successfully.');
  };

  const loadAllData = async () => {
    fetchVideos();
    fetchGifts();
    fetchNotifications();
    fetchLocations();
    fetchFeedback();
    fetchMembers();
    fetchSettings();
    fetchAudit();
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos?status=all');
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos);
        if (data.categories) setCategories(data.categories);
      }
    } catch (e) {
      console.error('Error fetching videos:', e);
    }
  };

  const fetchGifts = async () => {
    try {
      const res = await fetch('/api/gifts');
      const data = await res.json();
      if (data.success) setWelcomeGifts(data.gifts);

      const mRes = await fetch('/api/member-gifts?all=true');
      const mData = await mRes.json();
      if (mData.success) setMemberGifts(mData.member_gifts);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/campaigns/notifications');
      const data = await res.json();
      if (data.success) setNotifications(data.campaigns);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/campaigns/locations');
      const data = await res.json();
      if (data.success) setLocations(data.locations);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.success) setFeedbackList(data.feedback);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.success) setMembers(data.members);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) setSettings(data.settings);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAudit = async () => {
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (data.success) setAuditEvents(data.audit_events);
    } catch (e) {
      console.error(e);
    }
  };

  // --- VOD WORKFLOWS ---
  const handleTogglePublish = async (video: Video) => {
    const nextStatus = video.status === 'published' ? 'unpublished' : 'published';
    try {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Video status changed to ${nextStatus}. Visible in mobile feed!`);
        fetchVideos();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Video removed.');
        fetchVideos();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVideoUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      setUploadError('Title is required');
      return;
    }
    setUploadError('');
    setIsUploading(true);
    setUploadProgress(15);

    try {
      let mediaPath = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      let thumbnailPath = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop';

      // If user provided a video file, upload directly to /api/upload
      if (uploadFile) {
        setUploadProgress(35);
        const videoFormData = new FormData();
        videoFormData.append('file', uploadFile);
        const upRes = await fetch('/api/upload', {
          method: 'POST',
          body: videoFormData,
        });
        const upData = await upRes.json();
        if (!upRes.ok) throw new Error(upData.error || 'Video upload failed');
        mediaPath = upData.url;
        setUploadProgress(70);
      }

      // If user provided thumbnail
      if (thumbnailFile) {
        const thumbFormData = new FormData();
        thumbFormData.append('file', thumbnailFile);
        const thumbRes = await fetch('/api/upload', {
          method: 'POST',
          body: thumbFormData,
        });
        const thumbData = await thumbRes.json();
        if (thumbRes.ok) {
          thumbnailPath = thumbData.url;
        }
      }

      setUploadProgress(90);

      // Create video record
      const tagArray = uploadTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadTitle,
          description: uploadDescription || 'Island Living Channel travel feature.',
          media_path: mediaPath,
          thumbnail_path: thumbnailPath,
          status: uploadStatus,
          is_featured: false,
          categories: [uploadCategory],
          tags: tagArray,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save video metadata');

      setUploadProgress(100);
      showToast(`Success! Video "${uploadTitle}" is ${uploadStatus} and ready on Mobile.`);
      setIsUploadModalOpen(false);
      resetUploadForm();
      fetchVideos();
      fetchAudit();
    } catch (err: any) {
      setUploadError(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setThumbnailFile(null);
    setUploadTitle('');
    setUploadDescription('');
    setUploadProgress(0);
    setUploadError('');
  };

  // --- WELCOME GIFTS WORKFLOW ---
  const handleCreateGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftTitle || !giftDescription) return;
    try {
      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: giftTitle,
          description: giftDescription,
          validity_days: Number(giftValidityDays),
          redemption_instructions: giftInstructions || 'Present QR card to partner desk.',
          new_member_only: giftNewMemberOnly,
          is_active: true,
        }),
      });
      if (res.ok) {
        showToast('Welcome gift campaign created!');
        setIsAddGiftModalOpen(false);
        setGiftTitle('');
        setGiftDescription('');
        fetchGifts();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- NOTIFICATIONS BROADCAST WORKFLOW ---
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle || !campaignMessage) return;
    try {
      const res = await fetch('/api/campaigns/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: campaignTitle,
          message: campaignMessage,
          deep_link: campaignDeepLink || null,
        }),
      });
      if (res.ok) {
        showToast('Campaign draft created. Please review and confirm before broadcasting.');
        setIsNewCampaignModalOpen(false);
        setCampaignTitle('');
        setCampaignMessage('');
        setCampaignDeepLink('');
        fetchNotifications();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBroadcastConfirmation = async (campaign: NotificationCampaign) => {
    try {
      const res = await fetch('/api/campaigns/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'broadcast',
          campaign_id: campaign.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Broadcast submitted to notification provider! ID: ${data.campaign.provider_message_id}`);
        setConfirmBroadcastCampaign(null);
        fetchNotifications();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- LOCATIONS WORKFLOW ---
  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/campaigns/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: locName,
          latitude: parseFloat(locLat),
          longitude: parseFloat(locLng),
          radius_meters: Number(locRadius),
          is_active: true,
        }),
      });
      if (res.ok) {
        showToast('Campaign location saved.');
        setIsAddLocationModalOpen(false);
        setLocName('');
        fetchLocations();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- FEEDBACK REVIEW WORKFLOW ---
  const handleUpdateFeedbackStatus = async (status: 'reviewed' | 'resolved') => {
    if (!feedbackModalItem) return;
    try {
      const res = await fetch(`/api/feedback/${feedbackModalItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: adminNotes }),
      });
      if (res.ok) {
        showToast(`Feedback status updated to ${status}.`);
        setFeedbackModalItem(null);
        setAdminNotes('');
        fetchFeedback();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- SETTINGS UPDATE ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast('Integration settings updated successfully.');
        fetchSettings();
        fetchAudit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- FILTERED VIDEOS ---
  const filteredVideos = videos.filter((v) => {
    if (vodFilterStatus !== 'all' && v.status !== vodFilterStatus) return false;
    if (vodFilterCategory && !v.categories.includes(vodFilterCategory)) return false;
    if (
      vodSearch &&
      !v.title.toLowerCase().includes(vodSearch.toLowerCase()) &&
      !v.description.toLowerCase().includes(vodSearch.toLowerCase())
    )
      return false;
    return true;
  });

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--island-teal)', fontWeight: 600 }}>Loading Island Living CMS...</p>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--surface-alt)',
          padding: '1.5rem',
        }}
      >
        <div
          className="card"
          style={{
            maxWidth: '420px',
            width: '100%',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ height: '4px', backgroundColor: 'var(--palm-green)', width: '100%' }} />
          <div style={{ padding: '2.25rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <Image
                src="/brand/ilc-green.png"
                alt="Island Living Channel Logo"
                width={168}
                height={48}
                style={{ objectFit: 'contain', margin: '0 auto 0.875rem' }}
                priority
              />
              <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.375rem' }}>
                Editorial & Broadcast Console
              </h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted-text)' }}>
                Sign in to manage VOD releases, arrival gifts, and partner operations.
              </p>
            </div>

            {loginError && (
              <div
                style={{
                  backgroundColor: 'var(--channel-red-light)',
                  color: 'var(--channel-red)',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Staff Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="input-field"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
              >
                Sign In to Console
              </button>
            </form>

            <div
              style={{
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border)',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'var(--muted-text)',
              }}
            >
              <p>Demo Staff Credentials:</p>
              <code>admin@islandlivingchannel.tv / admin123</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN AUTHENTICATED CMS DASHBOARD ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface-alt)' }}>
      {/* SIDEBAR NAVIGATION */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 10,
          boxShadow: '1px 0 3px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ height: '3px', backgroundColor: 'var(--palm-green)', width: '100%' }} />

        {/* BRAND HEADER */}
        <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <Image
            src="/brand/ilc-green.png"
            alt="Island Living Channel"
            width={140}
            height={40}
            style={{ objectFit: 'contain' }}
            priority
          />
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              marginTop: '0.625rem',
              fontSize: '0.625rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--palm-green)',
              backgroundColor: 'var(--palm-light)',
              padding: '0.2rem 0.5rem',
              borderRadius: '12px',
              letterSpacing: '0.05em',
            }}
          >
            {/* <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--palm-green)' }} /> */}
            Administrator Console
          </div>
        </div>

        {/* NAVIGATION MENU WITH SECTION GROUPS */}
        <nav
          style={{
            flex: 1,
            padding: '1rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            overflowY: 'auto',
          }}
        >
          {[
            {
              section: 'Main',
              items: [
                {
                  id: 'dashboard',
                  label: 'Overview',
                  svg: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
                },
                {
                  id: 'vod',
                  label: 'VOD Library',
                  svg: 'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z',
                },
              ],
            },
            {
              section: 'Management',
              items: [
                {
                  id: 'gifts',
                  label: 'Welcome Gifts',
                  svg: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z',
                },
                {
                  id: 'notifications',
                  label: 'Announcements',
                  svg: 'M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z',
                },
                {
                  id: 'locations',
                  label: 'Hub Geofences',
                  svg: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                },
                {
                  id: 'feedback',
                  label: 'Partner Feedback',
                  svg: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
                },
                {
                  id: 'members',
                  label: 'Member Directory',
                  svg: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
                },
              ],
            },
            {
              section: 'Settings',
              items: [
                {
                  id: 'settings',
                  label: 'Integration & Audit',
                  svg: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
                },
              ],
            },
          ].map((group, groupIdx) => (
            <div key={groupIdx}>
              {group.section && (
                <p
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--muted-text)',
                    padding: '0 0.75rem 0.375rem',
                    margin: 0,
                  }}
                >
                  {group.section}
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.5625rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--palm-green)' : 'var(--ink)',
                        backgroundColor: isActive ? 'var(--palm-light)' : 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.15s ease-in-out',
                      }}
                    >
                      {/* ACTIVE LEFT PILL */}
                      {isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: '20%',
                            bottom: '20%',
                            width: '3px',
                            borderRadius: '0 2px 2px 0',
                            backgroundColor: 'var(--palm-green)',
                          }}
                        />
                      )}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{
                          opacity: isActive ? 1 : 0.65,
                          color: isActive ? 'var(--palm-green)' : 'currentColor',
                          flexShrink: 0,
                          transition: 'opacity 0.15s ease',
                        }}
                        aria-hidden="true"
                      >
                        <path d={item.svg} />
                      </svg>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* CURRENT USER & SIGNOUT */}
        <div
          style={{
            padding: '0.875rem 1rem',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--surface-alt)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                position: 'relative',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--palm-green)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8125rem',
                flexShrink: 0,
              }}
            >
              {user.display_name.charAt(0)}
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  border: '2px solid #ffffff',
                }}
              />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  margin: 0,
                }}
              >
                {user.display_name}
              </p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--muted-text)', textTransform: 'capitalize', margin: 0 }}>
                {user.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.375rem',
                borderRadius: '6px',
                color: 'var(--muted-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {/* TOAST ALERT */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              backgroundColor: 'var(--deep-ocean)',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 2000,
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✓</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Overview Dashboard</h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Live operational snapshot connected to mobile application.
                </p>
              </div>
              <button
                className="btn btn-coral"
                onClick={() => {
                  setActiveTab('vod');
                  setIsUploadModalOpen(true);
                }}
              >
                + Upload Video to Mobile
              </button>
            </div>

            {/* KPI STATS CARDS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              {[
                { label: 'Published Videos', val: videos.filter((v) => v.status === 'published').length, color: 'var(--island-teal)' },
                { label: 'Drafts in Review', val: videos.filter((v) => v.status === 'draft').length, color: 'var(--coral-accent)' },
                { label: 'Active Welcome Gifts', val: welcomeGifts.filter((g) => g.is_active).length, color: 'var(--deep-ocean)' },
                { label: 'Transit Geofences', val: locations.filter((l) => l.is_active).length, color: '#059669' },
                { label: 'Pending Feedback', val: feedbackList.filter((f) => f.status === 'new').length, color: '#d97706' },
              ].map((kpi, i) => (
                <div key={i} className="card" style={{ padding: '20px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted-text)', textTransform: 'uppercase' }}>
                    {kpi.label}
                  </p>
                  <p style={{ fontSize: '32px', fontWeight: 800, color: kpi.color, marginTop: '8px' }}>{kpi.val}</p>
                </div>
              ))}
            </div>

            {/* RECENT VIDEOS & RECENT FEEDBACK */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', color: 'var(--deep-ocean)' }}>Recent Videos</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('vod')}>
                    View All ({videos.length})
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {videos.slice(0, 4).map((v) => (
                    <div
                      key={v.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '32px',
                            position: 'relative',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            backgroundColor: '#e2e8f0',
                          }}
                        >
                          <Image src={v.thumbnail_path} alt={v.title} fill style={{ objectFit: 'cover' }} unoptimized />
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600 }}>{v.title}</p>
                          <p style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                            {v.categories.join(', ')} • {v.duration_seconds ? `${Math.floor(v.duration_seconds / 60)}m` : 'VOD'}
                          </p>
                        </div>
                      </div>
                      <span className={`badge badge-${v.status}`}>{v.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', color: 'var(--deep-ocean)' }}>Recent Merchant Feedback</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('feedback')}>
                    Review All
                  </button>
                </div>
                {feedbackList.length === 0 ? (
                  <p style={{ color: 'var(--muted-text)', fontSize: '13px' }}>No feedback submitted yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {feedbackList.slice(0, 4).map((f) => (
                      <div
                        key={f.id}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px' }}>{f.merchant_name}</span>
                          <span style={{ color: '#f59e0b', fontSize: '13px' }}>{'★'.repeat(f.rating)}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--ink)' }}>&ldquo;{f.comment}&rdquo;</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px' }}>
                          <span style={{ color: 'var(--muted-text)' }}>by {f.user_display_name || 'Member'}</span>
                          <span className={`badge badge-${f.status}`}>{f.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VOD MANAGEMENT */}
        {activeTab === 'vod' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Video On Demand (VOD)</h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Upload, curate, and publish lifestyle videos to the mobile application.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)}>
                + Upload New Video
              </button>
            </div>

            {/* FILTERS & SEARCH BAR */}
            <div
              className="card"
              style={{
                padding: '16px 20px',
                marginBottom: '20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: '220px' }}>
                <input
                  type="text"
                  placeholder="Search by title, tag, or description..."
                  className="input-field"
                  value={vodSearch}
                  onChange={(e) => setVodSearch(e.target.value)}
                />
              </div>

              <div>
                <select
                  className="input-field"
                  value={vodFilterStatus}
                  onChange={(e) => setVodFilterStatus(e.target.value)}
                  style={{ minWidth: '150px' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>

              <div>
                <select
                  className="input-field"
                  value={vodFilterCategory}
                  onChange={(e) => setVodFilterCategory(e.target.value)}
                  style={{ minWidth: '180px' }}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* VIDEOS DATA TABLE */}
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Preview</th>
                    <th>Title & Description</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Published At</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVideos.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted-text)' }}>
                        No videos matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredVideos.map((video) => (
                      <tr key={video.id}>
                        <td>
                          <div
                            onClick={() => setPreviewVideo(video)}
                            style={{
                              width: '72px',
                              height: '48px',
                              position: 'relative',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              backgroundColor: '#e2e8f0',
                              cursor: 'pointer',
                            }}
                          >
                            <Image
                              src={video.thumbnail_path}
                              alt={video.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              unoptimized
                            />
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '14px',
                              }}
                            >
                              ▶
                            </div>
                          </div>
                        </td>
                        <td>
                          <p style={{ fontWeight: 600, color: 'var(--deep-ocean)', marginBottom: '2px' }}>{video.title}</p>
                          <p
                            style={{
                              fontSize: '12px',
                              color: 'var(--muted-text)',
                              maxWidth: '350px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {video.description}
                          </p>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{video.categories.join(', ')}</span>
                        </td>
                        <td>{video.duration_seconds ? `${Math.floor(video.duration_seconds / 60)} min` : 'VOD'}</td>
                        <td>
                          <span className={`badge badge-${video.status}`}>{video.status}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                            {video.published_at ? new Date(video.published_at).toLocaleDateString() : 'Unpublished'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleTogglePublish(video)}
                              title="Toggle mobile publish visibility"
                            >
                              {video.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setPreviewVideo(video)}
                              title="Play Video"
                            >
                              Play
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteVideo(video.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: WELCOME GIFTS */}
        {activeTab === 'gifts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Welcome Gifts & Perks</h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Manage digital membership privileges and track issued vouchers.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className={`btn ${giftViewMode === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setGiftViewMode('catalog')}
                >
                  Gift Campaigns
                </button>
                <button
                  className={`btn ${giftViewMode === 'issued' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setGiftViewMode('issued')}
                >
                  Issued Member Vouchers ({memberGifts.length})
                </button>
                <button className="btn btn-coral" onClick={() => setIsAddGiftModalOpen(true)}>
                  + New Welcome Gift
                </button>
              </div>
            </div>

            {giftViewMode === 'catalog' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '20px',
                }}
              >
                {welcomeGifts.map((gift) => (
                  <div key={gift.id} className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ height: '140px', position: 'relative', backgroundColor: '#e2e8f0' }}>
                      <Image src={gift.image_path} alt={gift.title} fill style={{ objectFit: 'cover' }} unoptimized />
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <span className={`badge ${gift.is_active ? 'badge-active' : 'badge-archived'}`}>
                          {gift.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '16px', color: 'var(--deep-ocean)', marginBottom: '6px' }}>{gift.title}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginBottom: '14px', minHeight: '40px' }}>
                        {gift.description}
                      </p>
                      <div
                        style={{
                          fontSize: '12px',
                          padding: '10px',
                          backgroundColor: 'var(--surface-alt)',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '14px',
                        }}
                      >
                        <p>
                          <strong>Validity:</strong> {gift.validity_days} days from issue
                        </p>
                        <p>
                          <strong>Eligibility:</strong> {gift.new_member_only ? 'New Members' : 'All Members'}
                        </p>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                        <strong>Instructions:</strong> {gift.redemption_instructions}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Voucher Code</th>
                      <th>Recipient</th>
                      <th>Gift Title</th>
                      <th>Issued At</th>
                      <th>Expires At</th>
                      <th>Status</th>
                      <th>Redeemed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberGifts.map((mg) => (
                      <tr key={mg.id}>
                        <td>
                          <code style={{ fontWeight: 700, color: 'var(--island-teal)' }}>{mg.redemption_code}</code>
                        </td>
                        <td>{mg.user_display_name || 'Member'}</td>
                        <td>{mg.gift?.title || 'Welcome Gift'}</td>
                        <td>{new Date(mg.issued_at).toLocaleDateString()}</td>
                        <td>{new Date(mg.expires_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge badge-${mg.status}`}>{mg.status}</span>
                        </td>
                        <td>
                          {mg.redeemed_at ? new Date(mg.redeemed_at).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS & BROADCASTS */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                  Island Announcements & Notifications
                </h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Broadcast travel alerts and live program updates to mobile devices.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setIsNewCampaignModalOpen(true)}>
                + Draft Announcement
              </button>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title & Message</th>
                    <th>Deep Link</th>
                    <th>Audience</th>
                    <th>Status</th>
                    <th>Provider Message ID</th>
                    <th>Created</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((n) => (
                    <tr key={n.id}>
                      <td>
                        <p style={{ fontWeight: 600, color: 'var(--deep-ocean)' }}>{n.title}</p>
                        <p style={{ fontSize: '13px', color: 'var(--muted-text)' }}>{n.message}</p>
                      </td>
                      <td>
                        <code>{n.deep_link || 'None'}</code>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{n.target_audience || 'All'}</td>
                      <td>
                        <span className={`badge badge-${n.status}`}>{n.status}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                          {n.provider_message_id || 'Not broadcasted'}
                        </span>
                      </td>
                      <td>{new Date(n.created_at).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        {n.status === 'draft' ? (
                          <button
                            className="btn btn-coral btn-sm"
                            onClick={() => setConfirmBroadcastCampaign(n)}
                          >
                            Broadcast...
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600 }}>Sent</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CAMPAIGN LOCATIONS (GEOFENCES) */}
        {activeTab === 'locations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                  Transit Hubs & Campaign Geofences
                </h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Configure island coordinate perimeters for proximity-triggered messages and partner welcome hubs.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setIsAddLocationModalOpen(true)}>
                + Add Island Location
              </button>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Location / Transit Hub Name</th>
                    <th>Description</th>
                    <th>Coordinates (Lat, Lng)</th>
                    <th>Radius</th>
                    <th>Status</th>
                    <th>Associated Campaign</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((loc) => (
                    <tr key={loc.id}>
                      <td>
                        <p style={{ fontWeight: 600, color: 'var(--deep-ocean)' }}>{loc.name}</p>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'var(--muted-text)' }}>{loc.description || '—'}</span>
                      </td>
                      <td>
                        <code>
                          {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                        </code>
                      </td>
                      <td>{loc.radius_meters} meters</td>
                      <td>
                        <span className={`badge ${loc.is_active ? 'badge-active' : 'badge-archived'}`}>
                          {loc.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                          {loc.associated_campaign_id || 'General Welcome Hub'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: MERCHANT FEEDBACK */}
        {activeTab === 'feedback' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                  Member Merchant Feedback
                </h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Review member ratings and verified comments for island partners.
                </p>
              </div>
              <div>
                <select
                  className="input-field"
                  value={feedbackFilterStatus}
                  onChange={(e) => setFeedbackFilterStatus(e.target.value)}
                  style={{ minWidth: '160px' }}
                >
                  <option value="all">All Feedback</option>
                  <option value="new">New / Unreviewed</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Merchant / Island Partner</th>
                    <th>Rating</th>
                    <th>Customer Comment</th>
                    <th>Member Name</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th style={{ textAlign: 'right' }}>Review Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList
                    .filter((f) => feedbackFilterStatus === 'all' || f.status === feedbackFilterStatus)
                    .map((item) => (
                      <tr key={item.id}>
                        <td>
                          <p style={{ fontWeight: 600 }}>{item.merchant_name}</p>
                        </td>
                        <td>
                          <span style={{ color: '#f59e0b', fontSize: '14px' }}>{'★'.repeat(item.rating)}</span>
                        </td>
                        <td>
                          <p style={{ fontSize: '13px', maxWidth: '320px' }}>&ldquo;{item.comment}&rdquo;</p>
                          {item.admin_notes && (
                            <p style={{ fontSize: '11px', color: 'var(--island-teal)', marginTop: '4px' }}>
                              <strong>Note:</strong> {item.admin_notes}
                            </p>
                          )}
                        </td>
                        <td>{item.user_display_name || 'Member'}</td>
                        <td>
                          <span className={`badge badge-${item.status}`}>{item.status}</span>
                        </td>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setFeedbackModalItem(item);
                              setAdminNotes(item.admin_notes || '');
                            }}
                          >
                            Review...
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: MEMBER DIRECTORY (PRIVACY-PRESERVING) */}
        {activeTab === 'members' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                  Member Community Directory
                </h1>
                <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                  Privacy-preserving directory. Displays opaque public membership codes; personal email and credentials
                  are strictly omitted.
                </p>
              </div>
              <div style={{ minWidth: '280px' }}>
                <input
                  type="text"
                  placeholder="Search by name or ILC code..."
                  className="input-field"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Display Name</th>
                    <th>Public Membership Identifier</th>
                    <th>Account Status</th>
                    <th>Member Since</th>
                  </tr>
                </thead>
                <tbody>
                  {members
                    .filter(
                      (m) =>
                        !memberSearch ||
                        m.display_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                        m.membership_code.toLowerCase().includes(memberSearch.toLowerCase())
                    )
                    .map((m) => (
                      <tr key={m.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#e2e8f0',
                                color: 'var(--deep-ocean)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}
                            >
                              {m.display_name.charAt(0)}
                            </div>
                            <span style={{ fontWeight: 600 }}>{m.display_name}</span>
                          </div>
                        </td>
                        <td>
                          <code style={{ fontSize: '14px', fontWeight: 700, color: 'var(--island-teal)' }}>
                            {m.membership_code}
                          </code>
                        </td>
                        <td>
                          <span className="badge badge-active">{m.status}</span>
                        </td>
                        <td>{new Date(m.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS & AUDIT TRAIL */}
        {activeTab === 'settings' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '28px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                Platform Settings & Audit Trail
              </h1>
              <p style={{ color: 'var(--muted-text)', fontSize: '14px' }}>
                Configure partner integrations (YouTube, Otamigo) and review administrative actions.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* LIVE TV & FESTIVAL BROADCAST CONTROL CARD */}
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', color: 'var(--deep-ocean)', marginBottom: '2px' }}>
                      Live TV Broadcast Control
                    </h3>
                    <p style={{ color: 'var(--muted-text)', fontSize: '12px' }}>
                      Controls stream status, host LGU, and banner on mobile app.
                    </p>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      backgroundColor: settings.is_live ? '#DCFCE7' : '#F1F5F9',
                      color: settings.is_live ? '#166534' : '#64748B',
                      border: `1px solid ${settings.is_live ? '#86EFAC' : '#CBD5E1'}`,
                    }}
                  >
                    {settings.is_live ? '● ON AIR (LIVE)' : '○ OFF-AIR (CALENDAR)'}
                  </span>
                </div>

                <form onSubmit={handleSaveSettings}>
                  {/* LIVE TOGGLE */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!settings.is_live}
                        onChange={(e) => setSettings({ ...settings, is_live: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: 600 }}>Enable Active Live Broadcast (Switches mobile to Live Mode)</span>
                    </label>
                  </div>

                  {/* SHOW BANNER TOGGLE */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={settings.show_live_banner !== false}
                        onChange={(e) => setSettings({ ...settings, show_live_banner: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontWeight: 600 }}>Show Live Takeover Banner on Mobile Home Screen</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Live Broadcast Headline</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.live_broadcast_title || ''}
                      placeholder="e.g. MassKara 2026: Arena Street Dance Grand Finals"
                      onChange={(e) => setSettings({ ...settings, live_broadcast_title: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Host City / LGU Partner</label>
                      <input
                        type="text"
                        className="input-field"
                        value={settings.live_host_lgu || ''}
                        placeholder="e.g. City Government of Bacolod"
                        onChange={(e) => setSettings({ ...settings, live_host_lgu: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Active Viewer Count</label>
                      <input
                        type="text"
                        className="input-field"
                        value={settings.live_viewer_count || ''}
                        placeholder="e.g. 3,420"
                        onChange={(e) => setSettings({ ...settings, live_viewer_count: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stream Video ID or HLS URL</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.live_stream_video_id || settings.youtube_live_stream_id || ''}
                      placeholder="YouTube Video ID or custom HLS URL"
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          live_stream_video_id: e.target.value,
                          youtube_live_stream_id: e.target.value,
                        })
                      }
                    />
                    <small style={{ color: 'var(--muted-text)', fontSize: '12px' }}>
                      Controls the sovereign player stream on mobile.
                    </small>
                  </div>

                  <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

                  <h4 style={{ fontSize: '14px', color: 'var(--deep-ocean)', marginBottom: '10px' }}>
                    Pre-Event Countdown & Next Festival
                  </h4>

                  <div className="form-group">
                    <label className="form-label">Next Festival Title</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.next_festival_title || ''}
                      placeholder="e.g. MassKara Festival 2026: Arena Dance Grand Finals"
                      onChange={(e) => setSettings({ ...settings, next_festival_title: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Festival Date</label>
                      <input
                        type="text"
                        className="input-field"
                        value={settings.next_festival_date || ''}
                        placeholder="e.g. October 26, 2026"
                        onChange={(e) => setSettings({ ...settings, next_festival_date: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Host Location</label>
                      <input
                        type="text"
                        className="input-field"
                        value={settings.next_festival_location || ''}
                        placeholder="e.g. Bacolod City, Negros Occidental"
                        onChange={(e) => setSettings({ ...settings, next_festival_location: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', width: '100%' }}>
                    Save Live TV Broadcast Settings
                  </button>
                </form>
              </div>

              {/* SETTINGS CARD */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--deep-ocean)', marginBottom: '16px' }}>
                  Integration Configuration
                </h3>
                <form onSubmit={handleSaveSettings}>
                  <div className="form-group">
                    <label className="form-label">YouTube Live Stream ID</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.youtube_live_stream_id || ''}
                      onChange={(e) => setSettings({ ...settings, youtube_live_stream_id: e.target.value })}
                    />
                    <small style={{ color: 'var(--muted-text)', fontSize: '12px' }}>
                      Configures the stream player for Live TV tab on mobile.
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">YouTube Fallback Channel URL</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.youtube_channel_url || ''}
                      onChange={(e) => setSettings({ ...settings, youtube_channel_url: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Otamigo Travel Booking Base URL</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.otamigo_booking_base_url || ''}
                      onChange={(e) => setSettings({ ...settings, otamigo_booking_base_url: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Otamigo Affiliate Identifier</label>
                    <input
                      type="text"
                      className="input-field"
                      value={settings.otamigo_affiliate_id || ''}
                      onChange={(e) => setSettings({ ...settings, otamigo_affiliate_id: e.target.value })}
                    />
                    <small style={{ color: 'var(--muted-text)', fontSize: '12px' }}>
                      Appended as ?aff= identifier for transparent partner attribution.
                    </small>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                    Save Configuration
                  </button>
                </form>
              </div>

              {/* AUDIT LOG CARD */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--deep-ocean)', marginBottom: '16px' }}>
                  Administrative Audit Trail
                </h3>
                <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {auditEvents.map((evt) => (
                    <div
                      key={evt.id}
                      style={{
                        padding: '10px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <strong style={{ color: 'var(--island-teal)' }}>{evt.action}</strong>
                        <span style={{ color: 'var(--muted-text)' }}>
                          {new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ color: 'var(--muted-text)' }}>
                        by <code>{evt.actor_email}</code> on {evt.entity_type} ({evt.entity_id})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL 1: VIDEO UPLOAD WORKFLOW --- */}
        {isUploadModalOpen && (
          <div className="modal-overlay" onClick={() => !isUploading && setIsUploadModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Upload Video Feature</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginBottom: '20px' }}>
                Directly upload MP4 videos and publish to the Island Living mobile app.
              </p>

              {uploadError && (
                <div
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    marginBottom: '16px',
                  }}
                >
                  {uploadError}
                </div>
              )}

              <form onSubmit={handleVideoUploadSubmit}>
                <div className="form-group">
                  <label className="form-label">Video MP4 File (Dropzone)</label>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="input-field"
                    onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                  />
                  <small style={{ color: 'var(--muted-text)', fontSize: '11px' }}>
                    Supported formats: MP4, WebM (up to 150MB). If omitted, demo media is attached.
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Video Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coron Island: Kayangan Lake & Coral Gardens"
                    className="input-field"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    rows={3}
                    placeholder="Provide editorial overview..."
                    className="input-field"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="input-field"
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Publication Status</label>
                    <select
                      className="input-field"
                      value={uploadStatus}
                      onChange={(e) => setUploadStatus(e.target.value as any)}
                    >
                      <option value="published">Publish Immediately to Mobile</option>
                      <option value="draft">Save as Draft</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Palawan, Diving, Marine Reserve"
                    className="input-field"
                    value={uploadTags}
                    onChange={(e) => setUploadTags(e.target.value)}
                  />
                </div>

                {isUploading && (
                  <div style={{ margin: '16px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span>Uploading & Processing Media...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${uploadProgress}%`,
                          backgroundColor: 'var(--island-teal)',
                          transition: 'width 0.2s',
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsUploadModalOpen(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Save & Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 2: VIDEO PREVIEW PLAYER --- */}
        {previewVideo && (
          <div className="modal-overlay" onClick={() => setPreviewVideo(null)}>
            <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--deep-ocean)' }}>{previewVideo.title}</h3>
                <button
                  onClick={() => setPreviewVideo(null)}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ backgroundColor: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
                <video
                  src={previewVideo.media_path}
                  controls
                  autoPlay
                  style={{ width: '100%', maxHeight: '420px', display: 'block' }}
                >
                  Your browser does not support HTML5 video.
                </video>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--ink)', marginBottom: '8px' }}>{previewVideo.description}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className={`badge badge-${previewVideo.status}`}>{previewVideo.status}</span>
                {previewVideo.categories.map((c, i) => (
                  <span key={i} className="badge" style={{ backgroundColor: '#e2e8f0' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL 3: WELCOME GIFT CREATION --- */}
        {isAddGiftModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddGiftModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Add Welcome Gift Campaign</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginBottom: '20px' }}>
                Privileges issued to eligible members upon registration.
              </p>

              <form onSubmit={handleCreateGift}>
                <div className="form-group">
                  <label className="form-label">Gift Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Free Sunset Cocktail at Partner Lounge"
                    className="input-field"
                    value={giftTitle}
                    onChange={(e) => setGiftTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Explain the perk to the member..."
                    className="input-field"
                    value={giftDescription}
                    onChange={(e) => setGiftDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Validity (Days from Issue)</label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    className="input-field"
                    value={giftValidityDays}
                    onChange={(e) => setGiftValidityDays(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Redemption Instructions *</label>
                  <input
                    type="text"
                    required
                    placeholder="Show QR pass to partner receptionist..."
                    className="input-field"
                    value={giftInstructions}
                    onChange={(e) => setGiftInstructions(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsAddGiftModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 4: NOTIFICATION BROADCAST CONFIRMATION --- */}
        {confirmBroadcastCampaign && (
          <div className="modal-overlay" onClick={() => setConfirmBroadcastCampaign(null)}>
            <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '18px', color: 'var(--deep-ocean)', marginBottom: '8px' }}>
                Confirm Notification Broadcast
              </h2>
              <div
                style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  fontSize: '13px',
                }}
              >
                ⚠️ <strong>Live Delivery Action:</strong> This announcement will be submitted to mobile devices.
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontWeight: 700, fontSize: '14px' }}>{confirmBroadcastCampaign.title}</p>
                <p style={{ fontSize: '13px', color: 'var(--ink)', marginTop: '4px' }}>
                  {confirmBroadcastCampaign.message}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={() => setConfirmBroadcastCampaign(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-coral"
                  onClick={() => handleBroadcastConfirmation(confirmBroadcastCampaign)}
                >
                  Confirm & Broadcast
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL 5: NEW ANNOUNCEMENT FORM --- */}
        {isNewCampaignModalOpen && (
          <div className="modal-overlay" onClick={() => setIsNewCampaignModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Draft Announcement</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginBottom: '20px' }}>
                Compose push notification message for travel updates and event alerts.
              </p>

              <form onSubmit={handleCreateCampaign}>
                <div className="form-group">
                  <label className="form-label">Notification Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boracay Sunset Music Series Tonight"
                    className="input-field"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notification Body *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Join us live at Station 2 for sunset acoustics starting at 5 PM."
                    className="input-field"
                    value={campaignMessage}
                    onChange={(e) => setCampaignMessage(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Deep Link (Optional)</label>
                  <input
                    type="text"
                    placeholder="ilc://vod/siargao-sunrise-cloud-9-and-beyond"
                    className="input-field"
                    value={campaignDeepLink}
                    onChange={(e) => setCampaignDeepLink(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsNewCampaignModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Draft
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 6: ADD LOCATION GEOFENCE --- */}
        {isAddLocationModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddLocationModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>Add Island Transit Hub</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted-text)', marginBottom: '20px' }}>
                Set up location radius for mobile geofence monitoring.
              </p>

              <form onSubmit={handleCreateLocation}>
                <div className="form-group">
                  <label className="form-label">Location / Hub Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Panglao International Airport Hub"
                    className="input-field"
                    value={locName}
                    onChange={(e) => setLocName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Latitude *</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      className="input-field"
                      value={locLat}
                      onChange={(e) => setLocLat(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Longitude *</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      className="input-field"
                      value={locLng}
                      onChange={(e) => setLocLng(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Radius (Meters) *</label>
                  <input
                    type="number"
                    min={50}
                    max={10000}
                    required
                    className="input-field"
                    value={locRadius}
                    onChange={(e) => setLocRadius(Number(e.target.value))}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsAddLocationModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Location
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL 7: FEEDBACK REVIEW --- */}
        {feedbackModalItem && (
          <div className="modal-overlay" onClick={() => setFeedbackModalItem(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', color: 'var(--deep-ocean)', marginBottom: '4px' }}>
                Review Member Feedback
              </h2>
              <div style={{ margin: '16px 0', padding: '16px', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ fontWeight: 600 }}>{feedbackModalItem.merchant_name}</p>
                <p style={{ color: '#f59e0b', fontSize: '15px', margin: '4px 0' }}>
                  {'★'.repeat(feedbackModalItem.rating)} ({feedbackModalItem.rating}/5)
                </p>
                <p style={{ fontSize: '14px', color: 'var(--ink)' }}>&ldquo;{feedbackModalItem.comment}&rdquo;</p>
              </div>

              <div className="form-group">
                <label className="form-label">Admin Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record verification with merchant partner..."
                  className="input-field"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setFeedbackModalItem(null)}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleUpdateFeedbackStatus('reviewed')}
                >
                  Mark Reviewed
                </button>
                <button
                  type="button"
                  className="btn btn-coral"
                  onClick={() => handleUpdateFeedbackStatus('resolved')}
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
