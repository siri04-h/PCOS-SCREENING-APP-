// Lunara design tokens.
// Signature idea: the moon-phase arc. Every "progress" or "cycle position" in this
// app is expressed as a moon illustration moving from new -> full -> new, not a
// generic circular progress ring. It's the one visual motif that repeats across
// Dashboard, Cycle Calendar, and Progress screens.

export const colors = {
  // Backgrounds
  midnight: '#251F3D', // deep indigo-plum, used for hero/nav surfaces
  midnightSoft: '#332B4D',
  moonlight: '#FBF8F4', // warm cream, main app background
  cloud: '#F2ECE3', // card background on cream

  // Accents
  lavender: '#B6A7DE', // primary accent
  lavenderDeep: '#8B76C4',
  blush: '#E7A8C4', // secondary accent — period/cycle warmth
  blushDeep: '#D9789F',
  sage: '#93AF8F', // wellness / positive / low-risk
  amber: '#D9A05B', // moderate risk / attention
  coral: '#CB6F63', // higher risk / concerning pattern (muted, not alarm-red)

  // Text
  ink: '#3A3252', // primary text, dark plum instead of black
  inkMuted: '#847A99', // secondary text
  inkOnDark: '#F3EEFA',
  inkOnDarkMuted: '#B7ADD1',

  // Utility
  border: '#E4DCEE',
  white: '#FFFFFF',
};

export const gradients = {
  hero: [colors.midnight, '#3C3163'],
  moon: [colors.lavender, colors.blushDeep],
};

export const fonts = {
  display: 'Fraunces_600SemiBold',
  displayItalic: 'Fraunces_500Medium_Italic',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
};

export const type = {
  hero: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, color: colors.ink },
  h1: { fontFamily: fonts.display, fontSize: 24, lineHeight: 30, color: colors.ink },
  h2: { fontFamily: fonts.display, fontSize: 19, lineHeight: 25, color: colors.ink },
  eyebrow: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1.4,
    color: colors.lavenderDeep,
    textTransform: 'uppercase',
  },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.ink },
  bodyMuted: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.inkMuted },
  label: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.ink },
  caption: { fontFamily: fonts.body, fontSize: 12, color: colors.inkMuted },
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: '#2B2440',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
};

// Risk level -> color, used consistently across PCOS result, dashboard badges, alerts.
export function riskColor(level) {
  switch ((level || '').toLowerCase()) {
    case 'low':
      return colors.sage;
    case 'moderate':
      return colors.amber;
    case 'high':
      return colors.coral;
    default:
      return colors.inkMuted;
  }
}

export default { colors, gradients, fonts, type, spacing, radii, shadow, riskColor };
