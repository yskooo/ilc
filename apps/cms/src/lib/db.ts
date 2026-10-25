import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  MembershipCard,
  Video,
  VideoCategory,
  WelcomeGift,
  MemberGift,
  NotificationCampaign,
  CampaignLocation,
  Feedback,
  AppSetting,
  AuditEvent,
  AnalyticsEvent,
  SanitizedMemberProfile,
} from '@ilc/shared';
import {
  generateMembershipCode,
  generateRedemptionCode,
  isGiftEligible,
  calculateGiftExpiry,
  sanitizeMemberForDirectory,
} from '@ilc/shared';

interface DatabaseSchema {
  users: Array<UserProfile & { password_hash: string }>;
  membership_cards: MembershipCard[];
  videos: Video[];
  categories: VideoCategory[];
  welcome_gifts: WelcomeGift[];
  member_gifts: MemberGift[];
  notification_campaigns: NotificationCampaign[];
  campaign_locations: CampaignLocation[];
  feedback: Feedback[];
  settings: Record<string, any>;
  audit_events: AuditEvent[];
  analytics_events: AnalyticsEvent[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Initial seed data reflecting supabase/seed.sql
function getInitialData(): DatabaseSchema {
  return {
    users: [
      {
        id: 'usr-admin-001',
        email: 'admin@islandlivingchannel.tv',
        password_hash: 'admin123', // In production, use bcrypt
        display_name: 'ILC Editorial Lead',
        avatar_url: null,
        account_status: 'active',
        role: 'super_admin',
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: 'usr-member-001',
        email: 'member@islandlivingchannel.tv',
        password_hash: 'member123',
        display_name: 'Maria Santos',
        avatar_url: null,
        account_status: 'active',
        role: 'member',
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ],
    membership_cards: [
      {
        id: 'card-001',
        user_id: 'usr-member-001',
        public_membership_code: 'ILC-7B9A-24E8',
        status: 'active',
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ],
    categories: [
      { id: 'c1', name: 'Islands & Beaches', slug: 'islands-beaches', description: 'Beaches and coastal escapes' },
      { id: 'c2', name: 'Food & Dining', slug: 'food-dining', description: 'Island delicacies and fresh seafood' },
      { id: 'c3', name: 'Resorts & Stays', slug: 'resorts-stays', description: 'Eco-luxury villas and stays' },
      { id: 'c4', name: 'Culture & Festivals', slug: 'culture-festivals', description: 'Local fiestas and traditions' },
      { id: 'c5', name: 'Adventure & Diving', slug: 'adventure-diving', description: 'Surfing, reefs, and hikes' },
      { id: 'c6', name: 'Wellness & Nature', slug: 'wellness-nature', description: 'Restorative island sanctuaries' },
    ],
    videos: [
      {
        id: 'vid-001',
        title: 'Edge of the North: Whispers of the Ivatan',
        slug: 'edge-of-the-north-whispers-of-the-ivatan',
        description:
          'Journey into the Pacific winds where typhoon-defying stone villages celebrate ancient coastal heritage.',
        media_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail_path: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
        duration_seconds: 2300,
        status: 'published',
        is_featured: true,
        published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        created_by: 'usr-admin-001',
        categories: ['Culture & Festivals', 'Islands & Beaches'],
        tags: ['Batanes', 'Heritage', 'Coastal'],
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'vid-002',
        title: 'Archipelago Whispers: Apo Reef',
        slug: 'archipelago-whispers-apo-reef',
        description:
          'The second largest contiguous coral reef system in the world, teeming with pelagic life and crystal drop-offs.',
        media_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail_path: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
        duration_seconds: 1125,
        status: 'published',
        is_featured: false,
        published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        created_by: 'usr-admin-001',
        categories: ['Nature Doc', 'Adventure & Diving'],
        tags: ['Apo Reef', 'Diving', 'Marine'],
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: 'vid-003',
        title: 'Ghost Fleets of Sangat Island',
        slug: 'ghost-fleets-of-sangat-island',
        description:
          'Exploring WWII maritime wrecks in Coron Bay and the thriving coral gardens that reclaimed them.',
        media_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail_path: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
        duration_seconds: 480,
        status: 'published',
        is_featured: false,
        published_at: new Date(Date.now() - 4 * 86400000).toISOString(),
        created_by: 'usr-admin-001',
        categories: ['Food & Dining'],
        tags: ['Cebu', 'Culinary', 'Seafood'],
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: 'vid-004',
        title: 'Batanes: Winds of the Northern Isles',
        slug: 'batanes-winds-northern-isles',
        description:
          'Journey across the breathtaking rolling hills of Marlboro, traditional Ivatan stone houses, and the towering lighthouses of Basco.',
        media_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnail_path: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
        duration_seconds: 542,
        status: 'published',
        is_featured: false,
        published_at: new Date(Date.now() - 6 * 86400000).toISOString(),
        created_by: 'usr-admin-001',
        categories: ['Culture & Festivals'],
        tags: ['Batanes', 'Ivatan', 'Scenery'],
        created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
      {
        id: 'vid-005',
        title: 'Bohol: Beyond the Chocolate Hills (Draft)',
        slug: 'bohol-beyond-chocolate-hills-draft',
        description:
          'Editorial preview covering Panglao dive spots, the Loboc river cruise, and tarsier sanctuary conservation.',
        media_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnail_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
        duration_seconds: 360,
        status: 'draft',
        is_featured: false,
        published_at: null,
        created_by: 'usr-admin-001',
        categories: ['Wellness & Nature'],
        tags: ['Bohol', 'Nature'],
        created_at: new Date(Date.now() - 100000).toISOString(),
        updated_at: new Date(Date.now() - 100000).toISOString(),
      },
    ],
    welcome_gifts: [
      {
        id: 'gift-001',
        title: 'Chilled Island Coconut Welcome Drink',
        description:
          'Enjoy a fresh, chilled whole young coconut upon check-in or arrival at any participating ILC partner hub across Boracay, El Nido, or Siargao.',
        image_path: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?q=80&w=800&auto=format&fit=crop',
        is_active: true,
        new_member_only: true,
        starts_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        ends_at: new Date(Date.now() + 335 * 86400000).toISOString(),
        validity_days: 30,
        redemption_instructions:
          'Present this digital pass and voucher QR code to the service counter at any verified ILC partner beach club or ferry lounge.',
        created_by: 'usr-admin-001',
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: 'gift-002',
        title: 'PHP 500 Sunset Cruise Voucher',
        description:
          'Exclusive member privilege: PHP 500 discount on your sunset catamaran or bangka cruise booking through our island partner network.',
        image_path: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
        is_active: true,
        new_member_only: true,
        starts_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        ends_at: new Date(Date.now() + 90 * 86400000).toISOString(),
        validity_days: 45,
        redemption_instructions:
          'Quote your voucher code when booking via the Otamigo concierge or present in person at the tour desk.',
        created_by: 'usr-admin-001',
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
    ],
    member_gifts: [
      {
        id: 'mg-001',
        user_id: 'usr-member-001',
        gift_id: 'gift-001',
        issued_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        expires_at: new Date(Date.now() + 25 * 86400000).toISOString(),
        status: 'active',
        redeemed_at: null,
        redemption_code: 'GIFT-7K4M9Q',
      },
    ],
    notification_campaigns: [
      {
        id: 'notif-001',
        title: 'Boracay Music & Arts Weekend',
        message: 'Join us live this Saturday at Station 2 for the annual sunset acoustic sessions!',
        deep_link: 'ilc://vod/siargao-sunrise-cloud-9-and-beyond',
        status: 'submitted',
        scheduled_at: null,
        target_audience: 'all',
        provider_message_id: 'sim_provider_msg_98124',
        created_by: 'usr-admin-001',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
    campaign_locations: [
      {
        id: 'loc-001',
        name: 'Boracay Station 2 Coastal Hub',
        description: 'Main beachfront promenade and partner lounge in Boracay Island',
        latitude: 11.9592,
        longitude: 121.9272,
        radius_meters: 800,
        is_active: true,
        associated_campaign_id: 'notif-001',
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
      {
        id: 'loc-002',
        name: 'El Nido Town Marine Terminal',
        description: 'Island hopping departure dock and tourist registration center',
        latitude: 11.1818,
        longitude: 119.3917,
        radius_meters: 1000,
        is_active: true,
        associated_campaign_id: null,
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
      {
        id: 'loc-003',
        name: 'Siargao General Luna Tourism Hub',
        description: 'Cloud 9 boardwalk entry and partner cafe cluster',
        latitude: 9.7877,
        longitude: 126.1558,
        radius_meters: 1200,
        is_active: true,
        associated_campaign_id: null,
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
      {
        id: 'loc-004',
        name: 'Mactan Cebu International Airport Lounge',
        description: 'Transit terminal partner welcome booth',
        latitude: 10.3075,
        longitude: 123.9794,
        radius_meters: 500,
        is_active: true,
        associated_campaign_id: null,
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
    ],
    feedback: [
      {
        id: 'fb-001',
        user_id: 'usr-member-001',
        user_display_name: 'Maria Santos',
        merchant_name: 'Sea Breeze Grill Boracay',
        rating: 5,
        comment: 'Fresh grilled seafood and warm service! Redeemed our welcome drink easily.',
        status: 'reviewed',
        admin_notes: 'Partner verified redemption smoothly.',
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
    settings: {
      brand_name: 'Island Living Channel',
      logo_url: 'https://www.islandlivingchannel.tv/wp-content/uploads/2022/02/ff.png',
      is_live: true,
      live_broadcast_title: 'MassKara 2026: Arena Street Dance Grand Finals',
      live_host_lgu: 'City Government of Bacolod',
      live_stream_video_id: 'P-iu1vverWQ',
      live_stream_url: 'https://www.youtube.com/watch?v=P-iu1vverWQ',
      show_live_banner: true,
      live_viewer_count: '3,420',
      next_festival_title: 'MassKara Festival 2026: Arena Street Dance Grand Finals',
      next_festival_date: 'October 26, 2026',
      next_festival_location: 'Bacolod City, Negros Occidental',
      youtube_live_stream_id: 'P-iu1vverWQ',
      youtube_channel_url: 'https://www.youtube.com/@islandlivingchannel',
      otamigo_booking_base_url: 'https://otamigo.com',
      otamigo_affiliate_id: 'ilc_official',
      push_provider_enabled: false,
    },
    audit_events: [
      {
        id: 'aud-001',
        actor_id: 'usr-admin-001',
        actor_email: 'admin@islandlivingchannel.tv',
        action: 'publish_video',
        entity_type: 'video',
        entity_id: 'vid-001',
        metadata: { title: 'El Nido: Secrets of the Bacuit Archipelago' },
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
    analytics_events: [],
  };
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn('Could not read existing database, initializing fresh data', e);
    }
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database:', e);
    }
  }

  // --- USERS & AUTH ---
  findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(email: string, passwordHash: string, displayName?: string, role: UserProfile['role'] = 'member') {
    const existing = this.findUserByEmail(email);
    if (existing) throw new Error('Email already registered');

    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const newUser: UserProfile & { password_hash: string } = {
      id: userId,
      email,
      password_hash: passwordHash,
      display_name: displayName?.trim() || email.split('@')[0] || 'Island Member',
      avatar_url: null,
      account_status: 'active',
      role,
      created_at: now,
      updated_at: now,
    };

    this.data.users.push(newUser);

    // Auto-create digital membership card with opaque code (NO PII)
    const membershipCode = generateMembershipCode();
    const newCard: MembershipCard = {
      id: `card-${Date.now()}`,
      user_id: userId,
      public_membership_code: membershipCode,
      status: 'active',
      created_at: now,
    };
    this.data.membership_cards.push(newCard);

    // Auto-issue active welcome gifts for new members
    this.issueNewMemberGifts(userId, now);

    this.saveData(this.data);
    return { user: newUser, membership: newCard };
  }

  getMembershipCardByUserId(userId: string): MembershipCard | null {
    return this.data.membership_cards.find((c) => c.user_id === userId) || null;
  }

  // --- WELCOME & MEMBER GIFTS ---
  private issueNewMemberGifts(userId: string, memberCreatedAt: string) {
    const eligibleGifts = this.data.welcome_gifts.filter((g) => isGiftEligible(g, memberCreatedAt));
    for (const gift of eligibleGifts) {
      // Check if already issued
      const alreadyIssued = this.data.member_gifts.some((mg) => mg.user_id === userId && mg.gift_id === gift.id);
      if (!alreadyIssued) {
        const issuedAt = new Date().toISOString();
        const expiresAt = calculateGiftExpiry(gift.validity_days);
        this.data.member_gifts.push({
          id: `mg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          user_id: userId,
          gift_id: gift.id,
          issued_at: issuedAt,
          expires_at: expiresAt,
          status: 'active',
          redeemed_at: null,
          redemption_code: generateRedemptionCode(),
        });
      }
    }
  }

  getWelcomeGifts(activeOnly = false): WelcomeGift[] {
    if (activeOnly) {
      return this.data.welcome_gifts.filter((g) => g.is_active);
    }
    return this.data.welcome_gifts;
  }

  createWelcomeGift(giftData: Omit<WelcomeGift, 'id' | 'created_at' | 'updated_at'>, actorId: string): WelcomeGift {
    const now = new Date().toISOString();
    const newGift: WelcomeGift = {
      ...giftData,
      id: `gift-${Date.now()}`,
      created_by: actorId,
      created_at: now,
      updated_at: now,
    };
    this.data.welcome_gifts.push(newGift);
    this.logAuditEvent(actorId, undefined, 'create_welcome_gift', 'welcome_gift', newGift.id, { title: newGift.title });
    this.saveData(this.data);
    return newGift;
  }

  updateWelcomeGift(id: string, updates: Partial<WelcomeGift>, actorId: string): WelcomeGift {
    const index = this.data.welcome_gifts.findIndex((g) => g.id === id);
    if (index === -1) throw new Error('Welcome gift not found');
    const updated = {
      ...this.data.welcome_gifts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.data.welcome_gifts[index] = updated;
    this.logAuditEvent(actorId, undefined, 'update_welcome_gift', 'welcome_gift', id, updates);
    this.saveData(this.data);
    return updated;
  }

  getMemberGifts(userId: string): Array<MemberGift & { gift?: WelcomeGift }> {
    const list = this.data.member_gifts.filter((mg) => mg.user_id === userId);
    return list.map((mg) => {
      const gift = this.data.welcome_gifts.find((g) => g.id === mg.gift_id);
      return { ...mg, gift };
    });
  }

  getAllMemberGifts(): Array<MemberGift & { gift?: WelcomeGift; user_display_name?: string }> {
    return this.data.member_gifts.map((mg) => {
      const gift = this.data.welcome_gifts.find((g) => g.id === mg.gift_id);
      const user = this.data.users.find((u) => u.id === mg.user_id);
      return { ...mg, gift, user_display_name: user?.display_name || 'Member' };
    });
  }

  redeemMemberGift(memberGiftId: string, actorId: string): MemberGift {
    const mg = this.data.member_gifts.find((item) => item.id === memberGiftId);
    if (!mg) throw new Error('Member gift not found');
    if (mg.status !== 'active') throw new Error(`Gift is already ${mg.status}`);

    const now = new Date().toISOString();
    mg.status = 'redeemed';
    mg.redeemed_at = now;
    this.logAuditEvent(actorId, undefined, 'redeem_gift', 'member_gift', memberGiftId, {
      redemption_code: mg.redemption_code,
    });
    this.saveData(this.data);
    return mg;
  }

  // --- VIDEOS & CATEGORIES ---
  getVideos(options?: {
    status?: Video['status'] | 'all';
    category?: string;
    search?: string;
    isFeatured?: boolean;
  }): Video[] {
    let result = [...this.data.videos];

    if (options?.status && options.status !== 'all') {
      result = result.filter((v) => v.status === options.status);
    } else if (!options?.status) {
      // Default to published videos only for safe public consumption
      result = result.filter((v) => v.status === 'published');
    }

    if (options?.category) {
      result = result.filter((v) => v.categories.includes(options.category!));
    }

    if (options?.isFeatured !== undefined) {
      result = result.filter((v) => v.is_featured === options.isFeatured);
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getVideoById(id: string): Video | null {
    return this.data.videos.find((v) => v.id === id) || null;
  }

  createVideo(videoData: Omit<Video, 'id' | 'created_at' | 'updated_at'>, actorId: string): Video {
    const now = new Date().toISOString();
    const newVideo: Video = {
      ...videoData,
      id: `vid-${Date.now()}`,
      created_by: actorId,
      published_at: videoData.status === 'published' ? now : null,
      created_at: now,
      updated_at: now,
    };
    this.data.videos.unshift(newVideo);
    this.logAuditEvent(actorId, undefined, 'create_video', 'video', newVideo.id, {
      title: newVideo.title,
      status: newVideo.status,
    });
    this.saveData(this.data);
    return newVideo;
  }

  updateVideo(id: string, updates: Partial<Video>, actorId: string): Video {
    const index = this.data.videos.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Video not found');

    const current = this.data.videos[index];
    const now = new Date().toISOString();
    let publishedAt = current.published_at;

    // Handle transition to published
    if (updates.status === 'published' && current.status !== 'published') {
      publishedAt = now;
    }

    const updated: Video = {
      ...current,
      ...updates,
      published_at: publishedAt,
      updated_at: now,
    };

    this.data.videos[index] = updated;
    this.logAuditEvent(actorId, undefined, 'update_video', 'video', id, updates);
    this.saveData(this.data);
    return updated;
  }

  deleteVideo(id: string, actorId: string): void {
    const index = this.data.videos.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Video not found');
    const [removed] = this.data.videos.splice(index, 1);
    this.logAuditEvent(actorId, undefined, 'delete_video', 'video', id, { title: removed.title });
    this.saveData(this.data);
  }

  getCategories(): VideoCategory[] {
    return this.data.categories;
  }

  // --- NOTIFICATION CAMPAIGNS ---
  getNotificationCampaigns(): NotificationCampaign[] {
    return [...this.data.notification_campaigns].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  createNotificationCampaign(
    data: Omit<NotificationCampaign, 'id' | 'created_at' | 'updated_at' | 'provider_message_id'>,
    actorId: string
  ): NotificationCampaign {
    const now = new Date().toISOString();
    const campaign: NotificationCampaign = {
      ...data,
      id: `notif-${Date.now()}`,
      status: 'draft',
      provider_message_id: null,
      created_by: actorId,
      created_at: now,
      updated_at: now,
    };
    this.data.notification_campaigns.unshift(campaign);
    this.logAuditEvent(actorId, undefined, 'create_campaign', 'notification_campaign', campaign.id, {
      title: campaign.title,
    });
    this.saveData(this.data);
    return campaign;
  }

  submitNotificationBroadcast(campaignId: string, actorId: string): NotificationCampaign {
    const campaign = this.data.notification_campaigns.find((c) => c.id === campaignId);
    if (!campaign) throw new Error('Campaign not found');

    const providerEnabled = this.data.settings.push_provider_enabled;
    const now = new Date().toISOString();

    if (providerEnabled) {
      campaign.status = 'submitted';
      campaign.provider_message_id = `expo_push_${Date.now()}_ok`;
    } else {
      // Honestly record that push provider credentials are not configured yet
      campaign.status = 'submitted';
      campaign.provider_message_id = `simulated_push_ready_${Date.now()}`;
    }

    campaign.updated_at = now;
    this.logAuditEvent(actorId, undefined, 'broadcast_campaign', 'notification_campaign', campaign.id, {
      status: campaign.status,
      provider_message_id: campaign.provider_message_id,
    });
    this.saveData(this.data);
    return campaign;
  }

  // --- CAMPAIGN LOCATIONS (GEOFENCES) ---
  getCampaignLocations(activeOnly = false): CampaignLocation[] {
    if (activeOnly) {
      return this.data.campaign_locations.filter((l) => l.is_active);
    }
    return this.data.campaign_locations;
  }

  createCampaignLocation(
    data: Omit<CampaignLocation, 'id' | 'created_at' | 'updated_at'>,
    actorId: string
  ): CampaignLocation {
    const now = new Date().toISOString();
    const loc: CampaignLocation = {
      ...data,
      id: `loc-${Date.now()}`,
      created_at: now,
      updated_at: now,
    };
    this.data.campaign_locations.push(loc);
    this.logAuditEvent(actorId, undefined, 'create_location', 'campaign_location', loc.id, { name: loc.name });
    this.saveData(this.data);
    return loc;
  }

  updateCampaignLocation(id: string, updates: Partial<CampaignLocation>, actorId: string): CampaignLocation {
    const index = this.data.campaign_locations.findIndex((l) => l.id === id);
    if (index === -1) throw new Error('Location not found');
    const updated = {
      ...this.data.campaign_locations[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.data.campaign_locations[index] = updated;
    this.logAuditEvent(actorId, undefined, 'update_location', 'campaign_location', id, updates);
    this.saveData(this.data);
    return updated;
  }

  // --- FEEDBACK ---
  getFeedback(status?: Feedback['status']): Feedback[] {
    let result = [...this.data.feedback];
    if (status) {
      result = result.filter((f) => f.status === status);
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  submitFeedback(data: { merchant_name: string; rating: number; comment: string }, userId: string): Feedback {
    const user = this.findUserById(userId);
    const now = new Date().toISOString();
    const fb: Feedback = {
      id: `fb-${Date.now()}`,
      user_id: userId,
      user_display_name: user?.display_name || 'Member',
      merchant_name: data.merchant_name.trim(),
      rating: data.rating,
      comment: data.comment.trim(),
      status: 'new',
      created_at: now,
      updated_at: now,
    };
    this.data.feedback.unshift(fb);
    this.saveData(this.data);
    return fb;
  }

  updateFeedbackStatus(id: string, status: Feedback['status'], adminNotes: string | null, actorId: string): Feedback {
    const fb = this.data.feedback.find((f) => f.id === id);
    if (!fb) throw new Error('Feedback not found');
    fb.status = status;
    if (adminNotes !== undefined) fb.admin_notes = adminNotes;
    fb.updated_at = new Date().toISOString();
    this.logAuditEvent(actorId, undefined, 'update_feedback_status', 'feedback', id, { status, adminNotes });
    this.saveData(this.data);
    return fb;
  }

  // --- MEMBERS DIRECTORY (PRIVACY-PRESERVING) ---
  getSanitizedMembers(search?: string): SanitizedMemberProfile[] {
    const members = this.data.users.filter((u) => u.role === 'member');
    let sanitized = members.map((m) => {
      const card = this.data.membership_cards.find((c) => c.user_id === m.id);
      return sanitizeMemberForDirectory(m, card?.public_membership_code || 'UNASSIGNED');
    });

    if (search) {
      const q = search.toLowerCase();
      sanitized = sanitized.filter(
        (m) => m.display_name.toLowerCase().includes(q) || m.membership_code.toLowerCase().includes(q)
      );
    }

    return sanitized;
  }

  // --- SETTINGS ---
  getSettings(): Record<string, any> {
    return { ...this.data.settings };
  }

  updateSettings(updates: Record<string, any>, actorId: string): Record<string, any> {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
    };
    this.logAuditEvent(actorId, undefined, 'update_settings', 'settings', 'global', updates);
    this.saveData(this.data);
    return this.data.settings;
  }

  // --- AUDIT & ANALYTICS ---
  logAuditEvent(
    actorId: string,
    actorEmail: string | undefined,
    action: string,
    entityType: string,
    entityId: string,
    metadata: Record<string, any> = {}
  ): AuditEvent {
    const actor = actorEmail ? undefined : this.findUserById(actorId)?.email;
    const event: AuditEvent = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_id: actorId,
      actor_email: actorEmail || actor || 'system',
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      created_at: new Date().toISOString(),
    };
    this.data.audit_events.unshift(event);
    if (this.data.audit_events.length > 500) {
      this.data.audit_events = this.data.audit_events.slice(0, 500);
    }
    return event;
  }

  getAuditEvents(limit = 100): AuditEvent[] {
    return this.data.audit_events.slice(0, limit);
  }

  trackAnalytics(eventName: string, properties: Record<string, any>, userId?: string | null): AnalyticsEvent {
    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: userId || null,
      event_name: eventName,
      event_properties: properties,
      occurred_at: new Date().toISOString(),
    };
    this.data.analytics_events.unshift(event);
    if (this.data.analytics_events.length > 1000) {
      this.data.analytics_events = this.data.analytics_events.slice(0, 1000);
    }
    return event;
  }
}

// Singleton database manager instance
export const db = new DatabaseManager();
