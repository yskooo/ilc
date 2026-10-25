import { api } from './api';

export interface LiveBroadcastConfig {
  isLive: boolean;
  broadcastTitle: string;
  hostLgu: string;
  videoId: string;
  streamUrl: string;
  showLiveBanner: boolean;
  viewerCount: string;
  nextFestivalTitle: string;
  nextFestivalDate: string;
  nextFestivalLocation: string;
}

export const DEFAULT_BROADCAST_CONFIG: LiveBroadcastConfig = {
  isLive: true,
  broadcastTitle: 'MassKara 2026: Arena Street Dance Grand Finals',
  hostLgu: 'City Government of Bacolod',
  videoId: 'P-iu1vverWQ',
  streamUrl: 'https://www.youtube.com/watch?v=P-iu1vverWQ',
  showLiveBanner: true,
  viewerCount: '3,420',
  nextFestivalTitle: 'MassKara Festival 2026: Arena Street Dance Grand Finals',
  nextFestivalDate: 'October 26, 2026',
  nextFestivalLocation: 'Bacolod City, Negros Occidental',
};

class BroadcastService {
  private cachedConfig: LiveBroadcastConfig = DEFAULT_BROADCAST_CONFIG;

  /**
   * Fetches the live broadcast configuration from CMS platform settings (/api/settings)
   * Falls back gracefully to default cached configuration when offline.
   */
  async fetchBroadcastConfig(): Promise<LiveBroadcastConfig> {
    try {
      const res = await api.fetch<{ success: boolean; settings?: Record<string, any> }>('/settings');
      if (res && res.settings) {
        const s = res.settings;
        this.cachedConfig = {
          isLive: s.is_live !== undefined ? !!s.is_live : DEFAULT_BROADCAST_CONFIG.isLive,
          broadcastTitle: s.live_broadcast_title || DEFAULT_BROADCAST_CONFIG.broadcastTitle,
          hostLgu: s.live_host_lgu || DEFAULT_BROADCAST_CONFIG.hostLgu,
          videoId: s.live_stream_video_id || s.youtube_live_stream_id || DEFAULT_BROADCAST_CONFIG.videoId,
          streamUrl: s.live_stream_url || `https://www.youtube.com/watch?v=${s.live_stream_video_id || DEFAULT_BROADCAST_CONFIG.videoId}`,
          showLiveBanner: s.show_live_banner !== undefined ? !!s.show_live_banner : DEFAULT_BROADCAST_CONFIG.showLiveBanner,
          viewerCount: s.live_viewer_count || DEFAULT_BROADCAST_CONFIG.viewerCount,
          nextFestivalTitle: s.next_festival_title || DEFAULT_BROADCAST_CONFIG.nextFestivalTitle,
          nextFestivalDate: s.next_festival_date || DEFAULT_BROADCAST_CONFIG.nextFestivalDate,
          nextFestivalLocation: s.next_festival_location || DEFAULT_BROADCAST_CONFIG.nextFestivalLocation,
        };
      }
      return this.cachedConfig;
    } catch {
      // In offline / fallback mode, return current cache
      return this.cachedConfig;
    }
  }

  getConfig(): LiveBroadcastConfig {
    return this.cachedConfig;
  }
}

export const broadcastService = new BroadcastService();
