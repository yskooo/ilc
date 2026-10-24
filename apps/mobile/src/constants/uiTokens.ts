import { Platform, StyleSheet } from 'react-native';

/**
 * Island Living Digital — Unified Mobile Design Tokens
 * Engineered for Silicon Valley / Apple-caliber craftsmanship.
 * Strict typography tracking, luxury Apple Wallet card ratios, and responsive media bounds.
 */

export const FONT_STACK = Platform.select({
  ios: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  android: 'Roboto, sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  default: 'System',
});

export const TYPO = StyleSheet.create({
  // Large Titles (Screen Names)
  h1: {
    fontFamily: FONT_STACK,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.6,
  },
  // Section Headers
  h2: {
    fontFamily: FONT_STACK,
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 27,
    letterSpacing: -0.4,
  },
  // Card Titles & Subsections
  h3: {
    fontFamily: FONT_STACK,
    fontSize: 16.5,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  // Editorial Subtitle (iOS Large Subhead)
  subhead: {
    fontFamily: FONT_STACK,
    fontSize: 14.5,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: -0.1,
  },
  // Standard Body
  body: {
    fontFamily: FONT_STACK,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: FONT_STACK,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  bodyBold: {
    fontFamily: FONT_STACK,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  // Footnote / Supporting Descriptions
  footnote: {
    fontFamily: FONT_STACK,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  // Secondary Metadata Pills & Tags
  caption: {
    fontFamily: FONT_STACK,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  // Micro Headers & Section Category Labels (Apple Wallet style)
  micro: {
    fontFamily: FONT_STACK,
    fontSize: 10.5,
    fontWeight: '800',
    lineHeight: 14,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  // Card Monospace Number (Apple Card / Bank Card)
  cardMono: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: '"SF Mono", Menlo, Consolas, Monaco, monospace',
    }),
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2.5,
  },
});

export const ASPECT_RATIOS = {
  /** Standard Apple Pay / ISO Card Aspect Ratio (85.60mm / 53.98mm = 1.586) */
  CREDIT_CARD: 1.586,
  /** 16:9 Landscape for Full YouTube VOD Episodes & Live Broadcasts */
  LANDSCAPE_16_9: 16 / 9,
  /** 9:16 Portrait for YouTube Shorts, Reels, and Mobile Stories */
  PORTRAIT_9_16: 9 / 16,
  /** 4:5 Poster Aspect Ratio for Featured Showcases */
  POSTER_4_5: 4 / 5,
} as const;

export const RADII = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  card: 22,
  pill: 9999,
} as const;

export const SHADOWS = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
      } as any,
    }),
  },
  elevated: {
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 18,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      } as any,
    }),
  },
  luxuryCard: {
    ...Platform.select({
      ios: {
        shadowColor: '#022E14',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.35,
        shadowRadius: 28,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow:
          '0 24px 48px -12px rgba(2, 46, 20, 0.45), 0 8px 18px -4px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
      } as any,
    }),
  },
});
