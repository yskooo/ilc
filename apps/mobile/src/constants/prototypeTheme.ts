import { Platform } from 'react-native';

export type ThemeMode = 'dark' | 'light';
export type PrototypeTab = 'home' | 'live' | 'rewards' | 'travel' | 'more';

import realYoutubeData from '../data/realYoutubeContent.json';

export type VideoCategoryFilter =
  | 'All'
  | 'Travel Destination'
  | 'Festivals'
  | 'Sipalay'
  | 'Christmas & New Year'
  | 'Explore'
  | 'Food'
  | 'Hotels & Resorts'
  | 'Philippines'
  | 'International';

export interface PrototypeVideo {
  id: string;
  t: string;
  m: string;
  category: string;
  region?: string;
  sceneIndex?: number;
  videoUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  isShort?: boolean;
}

export interface WatchHistoryItem {
  videoId: string;
  progress: number; // 0 to 100
  lastWatched: string;
}

export interface PrototypeMerchant {
  id: string;
  n: string;
  c: string;
  t: string;
  address: string;
  hours: string;
  offer: string;
  description: string;
  sceneIndex: number;
}

export interface PrototypeFeedback {
  w: string;
  r: number;
  t: string;
}

export interface PrototypeTravelQuery {
  type: 'Flights' | 'Ferries' | 'Stays';
  from: string;
  to: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  type: 'geo' | 'announcement';
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

export const VIDEO_CATEGORIES: VideoCategoryFilter[] = [
  'All',
  'Travel Destination',
  'Festivals',
  'Sipalay',
  'Christmas & New Year',
];

export const INITIAL_VIDEOS: PrototypeVideo[] = realYoutubeData.videos.map((v, idx) => {
  let cat = 'Travel Destination';
  const lower = v.title.toLowerCase();
  if (
    lower.includes('sinulog') ||
    lower.includes('festival') ||
    lower.includes('masskara') ||
    lower.includes('bangsamoro') ||
    lower.includes('fiesta')
  ) {
    cat = 'Festivals';
  } else if (lower.includes('sipalay')) {
    cat = 'Sipalay';
  } else if (lower.includes('christmas') || lower.includes('new year')) {
    cat = 'Christmas & New Year';
  }
  return {
    id: v.id,
    t: v.title,
    m: v.duration || 'Feature',
    category: cat,
    region: 'Philippines',
    sceneIndex: idx % 6,
    videoUrl: v.videoUrl,
    embedUrl: v.embedUrl,
    thumbnailUrl: v.thumbnail,
    isShort: false,
  };
});

export const INITIAL_CONTINUE_WATCHING: WatchHistoryItem[] = [
  { videoId: 'ZfxZC_toy1U', progress: 65, lastWatched: '3m left' },
  { videoId: 'YYjXRYsN_vI', progress: 38, lastWatched: '5m left' },
];

export const MERCHANTS: PrototypeMerchant[] = [
  {
    id: 'merch-1',
    n: 'Harbor Roast Café',
    c: 'Bacolod',
    t: 'Coffee',
    address: '21st Lacson Street, Bacolod City, Negros Occidental',
    hours: 'Daily · 6:30 AM – 10:00 PM',
    offer: '5% off all espresso & specialty brews + Welcome Gift redemption partner',
    description:
      'Artisanal single-origin Negros highland coffee roasted in small batches, paired with warm piaya and coastal pastries.',
    sceneIndex: 0,
  },
  {
    id: 'merch-2',
    n: 'Punta Taza Grill',
    c: 'Bacolod',
    t: 'Dining',
    address: 'Pala-Pala Coastal Walk, Bacolod City, Negros Occidental',
    hours: 'Tue – Sun · 11:00 AM – 11:00 PM',
    offer: '5% off total dining bill with your ILC Digital Member Card',
    description:
      'Open-air sunset grill serving authentic chicken inasal,charcoal-grilled blue marlin, and fresh Guimaras mango salads.',
    sceneIndex: 3,
  },
  {
    id: 'merch-3',
    n: 'Sugarlands Boutique Inn',
    c: 'Iloilo',
    t: 'Stay',
    address: 'General Luna Heritage District, Iloilo City',
    hours: 'Front Desk · 24 Hours (Check-in 2:00 PM)',
    offer: '5% off best available room rate + complimentary welcome drink',
    description:
      'Restored heritage courtyard sanctuary blending colonial Visayan architecture with tranquil tropical gardens.',
    sceneIndex: 4,
  },
  {
    id: 'merch-4',
    n: 'Molo Weekend Market',
    c: 'Iloilo',
    t: 'Shopping',
    address: 'Molo Plaza Artisan Arcade, Iloilo City',
    hours: 'Fri – Sun · 8:00 AM – 8:00 PM',
    offer: '5% off hablon weaves, tablea cacao, and curated island crafts',
    description:
      'Handwoven hablon textiles, heirloom Panay delicacies, and coastal homeware crafted by local Visayan artisans.',
    sceneIndex: 1,
  },
  {
    id: 'merch-5',
    n: 'Sunrise Island Tours',
    c: 'Cebu',
    t: 'Tours',
    address: 'Pier 1 Marina Terminal, Cebu City',
    hours: 'Daily · 5:30 AM – 6:00 PM',
    offer: '5% off private island-hopping charters & marine sanctuary passes',
    description:
      'Guided outrigger and speedboat expeditions across Nalusuan, Gilutongan, and Olango Island marine sanctuaries.',
    sceneIndex: 2,
  },
  {
    id: 'merch-6',
    n: 'Mactan Dive Hub',
    c: 'Cebu',
    t: 'Activities',
    address: 'Punta Engaño Coastal Road, Lapu-Lapu City, Mactan',
    hours: 'Daily · 7:00 AM – 7:00 PM',
    offer: '5% off PADI fun dives, nitrox fills, and reef gear rental',
    description:
      'PADI 5-Star dive center offering guided wall dives, house reef snorkeling, and underwater photography excursions.',
    sceneIndex: 5,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'geo',
    title: 'Welcome to Bacolod!',
    msg: 'Touchdown at Bacolod-Silay Airport. Show your ILC card for 5% off at Harbor Roast Café and Punta Taza Grill.',
    time: 'Just now',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'announcement',
    title: 'New Episode Premiere',
    msg: 'Siquijor: island of slow days is now streaming in Watch.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'geo',
    title: 'Welcome to Cebu!',
    msg: 'Near Mactan-Cebu Airport: Enjoy 5% off island charters with Sunrise Island Tours.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'notif-4',
    type: 'announcement',
    title: 'Live Tonight at 7:00 PM',
    msg: 'MassKara street dance broadcasts live from Bacolod on Live TV.',
    time: '2 days ago',
    read: true,
  },
];

export const HUBS: Record<string, string> = {
  'Bacolod-Silay Airport': 'Bacolod',
  'Iloilo Airport': 'Iloilo',
  'Mactan-Cebu Airport': 'Cebu',
  'Cebu Pier 1': 'Cebu',
};

export const TABS: [PrototypeTab, string][] = [
  ['home', 'Watch'],
  ['live', 'Live TV'],
  ['rewards', 'Rewards'],
  ['travel', 'Travel'],
  ['more', 'More'],
];

export const LIVE_SCHEDULE: [string, string][] = [
  ['Today, 7:00 PM', 'MassKara street dance, live from Bacolod'],
  ['Sat, 10:00 AM', 'Dinagyang preview with the festival team'],
  ['Sun, 6:30 PM', 'Island Living Weekly: new episodes'],
];

export const TRAVEL_RESULTS: [string, string, string][] = [
  ['Morning', '₱1,890', '7:10 – 8:05'],
  ['Midday', '₱2,240', '12:30 – 13:25'],
  ['Evening', '₱1,740', '18:45 – 19:40'],
];

export const SERIF_FONT = Platform.select({
  ios: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  android: 'Roboto, sans-serif',
  default: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif',
});

export const SANS_FONT = Platform.select({
  ios: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
  android: 'Roboto, sans-serif',
  default: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif',
});

export const PROTOTYPE_THEMES = {
  dark: {
    bg: '#04150B',
    surf: '#0A2414',
    phoneBg: '#061A0E',
    sheetBg: '#061A0E',
    ink: '#F2F7EC',
    mute: '#98B39E',
    line: 'rgba(255,255,255,0.1)',
    brand: '#C9DC3F',
    hib: '#C9DC3F',
    tide: '#79AA34',
    on: '#06240F',
    tabsBg: 'rgba(8,36,20,0.74)',
    tabsBorder: 'rgba(255,255,255,0.12)',
    tabOnBg: 'rgba(201,220,63,0.16)',
    tabOnColor: '#DCEB5C',
    btnBg: '#C9DC3F',
    btnGradient: 'linear-gradient(90deg,#9CC83A,#E2EA4B)',
    btnText: '#06240F',
    btnShadow: 'rgba(201,220,63,0.22)',
    btnAltColor: '#DCEB5C',
    btnAltBorder: 'rgba(201,220,63,0.55)',
    chipOnBg: '#C9DC3F',
    chipOnText: '#06240F',
    promoBorder: 'rgba(201,220,63,0.4)',
    promoBg: 'rgba(201,220,63,0.09)',
    promoGradient:
      'linear-gradient(160deg,rgba(201,220,63,0.14),rgba(201,220,63,0.02))',
    inputBg: 'rgba(255,255,255,0.05)',
    inputBorder: 'rgba(255,255,255,0.1)',
    giftBg: 'rgba(255,255,255,0.03)',
    statBg: 'rgba(255,255,255,0.04)',
    statNum: '#DCEB5C',
    bannerBg: 'rgba(8,36,20,0.93)',
    bannerText: '#F2F7EC',
    bannerBorder: 'rgba(201,220,63,0.45)',
    adminBg: 'rgba(10,29,36,0.85)',
    adminBorder: 'rgba(255,255,255,0.1)',
    modeBg: 'rgba(255,255,255,0.05)',
    modeOnBg: '#C9DC3F',
    modeOnText: '#1A1405',
    stageGradient:
      'radial-gradient(900px 520px at 12% -10%,#0B5A2A 0,transparent 60%),radial-gradient(700px 480px at 100% 100%,#3A4A0C 0,transparent 55%),#04150B',
  },
  light: {
    bg: '#EAF2E6',
    surf: '#FFFFFF',
    phoneBg: '#FFFFFF',
    sheetBg: '#FFFFFF',
    ink: '#0B2A16',
    mute: '#587160',
    line: 'rgba(6,36,15,0.12)',
    brand: '#0B6A2E',
    hib: '#0B6A2E',
    tide: '#2E8B3A',
    on: '#FFFFFF',
    tabsBg: 'rgba(255,255,255,0.86)',
    tabsBorder: 'rgba(6,36,15,0.12)',
    tabOnBg: 'rgba(11,106,46,0.12)',
    tabOnColor: '#0B6A2E',
    btnBg: '#0B6A2E',
    btnGradient: 'linear-gradient(90deg,#0B6A2E,#2E8B3A)',
    btnText: '#FFFFFF',
    btnShadow: 'rgba(11,106,46,0.28)',
    btnAltColor: '#0B6A2E',
    btnAltBorder: 'rgba(11,106,46,0.55)',
    chipOnBg: '#0B6A2E',
    chipOnText: '#FFFFFF',
    promoBorder: 'rgba(11,106,46,0.35)',
    promoBg: 'rgba(201,220,63,0.18)',
    promoGradient:
      'linear-gradient(160deg,rgba(201,220,63,0.3),rgba(201,220,63,0.05))',
    inputBg: '#F3F7F0',
    inputBorder: 'rgba(6,36,15,0.14)',
    giftBg: '#F3F7F0',
    statBg: '#F3F7F0',
    statNum: '#0B6A2E',
    bannerBg: 'rgba(255,255,255,0.96)',
    bannerText: '#0B2A16',
    bannerBorder: 'rgba(11,106,46,0.4)',
    adminBg: 'rgba(255,255,255,0.9)',
    adminBorder: 'rgba(6,36,15,0.1)',
    modeBg: 'rgba(255,255,255,0.7)',
    modeOnBg: '#0B6A2E',
    modeOnText: '#FFFFFF',
    stageGradient:
      'radial-gradient(900px 520px at 12% -10%,#CFE6B8 0,transparent 60%),radial-gradient(700px 480px at 100% 100%,#F3F0A6 0,transparent 55%),#EAF2E6',
  },
} as const;

export function computeMemberId(email: string): string {
  const clean = email || 'guest';
  const num = clean
    .split('')
    .reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 90000, 10000);
  return `ILC-${num}`;
}

export function generateQrMatrix(seed: string): boolean[][] {
  let h = 0;
  for (const c of seed || 'guest') {
    h = (h * 31 + c.charCodeAt(0)) >>> 0;
  }
  const f = (x: number, y: number) =>
    (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);

  const matrix: boolean[][] = [];
  for (let y = 0; y < 21; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < 21; x++) {
      let on: boolean;
      if (f(x, y)) {
        const a = x > 13 ? x - 14 : x;
        const b = y > 13 ? y - 14 : y;
        on =
          a === 0 ||
          a === 6 ||
          b === 0 ||
          b === 6 ||
          (a > 1 && a < 5 && b > 1 && b < 5);
      } else {
        h = (Math.imul(h, 1103515245) + 12345) >>> 0;
        on = Boolean((h >>> 16) & 1);
      }
      row.push(on);
    }
    matrix.push(row);
  }
  return matrix;
}

const gr = (id: string, a: string, b: string) =>
  `<linearGradient id='${id}' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient>`;

const palm = (x: number, y: number, s: number, c: string) =>
  `<g fill='${c}' transform='translate(${x} ${y}) scale(${s})'><path d='M0 0Q3 -18 -2 -34L1 -34Q7 -18 3 0Z'/><path d='M-1 -34Q-14 -38 -22 -28Q-10 -34 -1 -31ZM0 -34Q12 -42 24 -32Q10 -36 1 -31ZM0 -34Q-6 -46 -16 -48Q-6 -44 -1 -33ZM1 -34Q8 -46 18 -46Q8 -42 2 -32Z'/></g>`;

const bg = (id: string, a: string, b: string, y?: number, h?: number) =>
  `<defs>${gr(id, a, b)}</defs><rect y='${y || 0}' width='160' height='${h || 100}' fill='url(#${id})'/>`;

export const SC: (() => string)[] = [
  () =>
    bg('s', '#183d63', '#f6a04d') +
    bg('w', '#1e9da0', '#0b4f5d', 58, 42) +
    `<circle cx='108' cy='54' r='15' fill='#ffe3a1'/><path d='M96 62h24M100 66h16M92 70h30' stroke='#ffe3a1' stroke-width='1.2' opacity='.6'/><path d='M0 100V86Q70 74 160 90V100Z' fill='#f1d9a8'/>` +
    palm(22, 90, 1.1, '#06240f') +
    palm(42, 93, 0.8, '#0b3d1e'),
  () =>
    bg('s', '#3a2467', '#ff9a62') +
    `<circle cx='130' cy='28' r='6' fill='#ffe9b8'/><path d='M40 100V58H54V44L66 30L78 44V58H92V100Z' fill='#241438'/><path d='M66 30V21M63 24H69' stroke='#241438' stroke-width='2'/><rect x='62' y='62' width='8' height='14' rx='4' fill='#ffc86b'/><rect x='46' y='66' width='4' height='8' rx='2' fill='#ffc86b'/><rect x='82' y='66' width='4' height='8' rx='2' fill='#ffc86b'/><path d='M0 100V88H160V100Z' fill='#150b24'/><g fill='#ffd27a'><circle cx='14' cy='80' r='2.2'/><circle cx='28' cy='82' r='2.2'/><circle cx='108' cy='82' r='2.2'/><circle cx='124' cy='80' r='2.2'/><circle cx='144' cy='82' r='2.2'/></g>`,
  () =>
    bg('s', '#4fb8ea', '#dff4ff') +
    bg('w', '#1b8fc0', '#0a4d78', 58, 42) +
    `<circle cx='28' cy='20' r='9' fill='#fff3b0'/><ellipse cx='100' cy='18' rx='18' ry='5' fill='#fff' opacity='.8'/><path d='M100 58Q122 34 160 52V58Z' fill='#2f8f5b'/><path d='M0 58Q30 44 60 58Z' fill='#3aa56a' opacity='.8'/><path d='M34 68H92L84 78H42Z' fill='#fff'/><rect x='48' y='56' width='30' height='12' rx='2' fill='#f4f7f8'/><rect x='52' y='59' width='22' height='4' fill='#1b8fc0'/><rect x='60' y='50' width='12' height='6' fill='#e1251b'/><path d='M20 80H80M96 74H140M10 90H60' stroke='#fff' stroke-width='1' opacity='.4'/>`,
  () =>
    bg('s', '#7b2d8b', '#ff8a5c') +
    `<circle cx='80' cy='62' r='22' fill='#ffd36e'/><path d='M0 100V74H16V62H28V74H38V54H50V74H64V68H78V60H88V74H100V66H114V76H130V62H142V74H160V100Z' fill='#3a1850'/>` +
    palm(18, 100, 1.2, '#1c0b2b') +
    palm(144, 100, 1, '#1c0b2b'),
  () =>
    bg('s', '#79d0f0', '#eaf9ff') +
    bg('w', '#25c9c4', '#0a8c94', 58, 42) +
    `<circle cx='30' cy='22' r='11' fill='#fff1a8'/><path d='M70 60Q100 26 140 60Z' fill='#2e8b3a'/><path d='M110 60Q130 40 160 58V60Z' fill='#1f6d2c'/><path d='M0 100V82Q50 70 160 86V100Z' fill='#f5e3b5'/>` +
    palm(128, 90, 1, '#0b3d1e'),
  () =>
    bg('s', '#0f7ea0', '#031c29') +
    `<g fill='#9be8ff' opacity='.12'><path d='M30 0H42L24 100H0Z'/><path d='M70 0H84L66 100H40Z'/><path d='M110 0H120L110 100H84Z'/></g><g fill='#ffb347'><ellipse cx='60' cy='40' rx='9' ry='5'/><path d='M69 40L77 35V45Z'/></g><g fill='#ff6f91'><ellipse cx='108' cy='28' rx='6' ry='3.5'/><path d='M114 28L120 24V32Z'/></g><g fill='#ffe066'><ellipse cx='36' cy='62' rx='5' ry='3'/><path d='M41 62L46 59V65Z'/></g><g fill='#e8575d'><circle cx='14' cy='94' r='9'/><circle cx='34' cy='97' r='8'/><circle cx='120' cy='95' r='10'/></g><g fill='#ffb347'><circle cx='70' cy='98' r='9'/><circle cx='150' cy='96' r='8'/></g><g fill='none' stroke='#fff' opacity='.4'><circle cx='80' cy='60' r='2'/><circle cx='84' cy='50' r='1.4'/><circle cx='78' cy='44' r='1'/></g>`,
];

export const IC: Record<PrototypeTab, string> = {
  home: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5l5 2.5-5 2.5z"/>',
  live: '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 000 8.4M16.2 7.8a6 6 0 010 8.4M4.9 4.9a10 10 0 000 14.2M19.1 4.9a10 10 0 010 14.2"/>',
  rewards:
    '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8C9.5 8 8 7 8 5.5S9.5 3 12 8zM12 8c2.5 0 4-1 4-2.5S14.5 3 12 8z"/>',
  travel: '<path d="M21 3L3 10.5l7 2.5 2.5 7z"/><path d="M10 13L21 3"/>',
  more: '<path d="M4 7h16M4 12h16M4 17h16"/>',
};
