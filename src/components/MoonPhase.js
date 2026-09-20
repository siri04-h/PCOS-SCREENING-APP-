import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/theme';

/**
 * MoonPhase — Lunara's signature visual.
 * Renders a moon whose illuminated fraction represents `progress` (0..1),
 * e.g. how far through the cycle, or how complete a daily check-in is.
 * This replaces generic circular progress bars throughout the app.
 */
export default function MoonPhase({ progress = 0, size = 96 }) {
  const clamped = Math.max(0, Math.min(1, progress));
  const r = size / 2;
  const rr = r - 4;
  const cx = r;
  const cy = r;
  // Terminator curve: at progress 0 -> new moon (dark), 0.5 -> full, 1 -> new again.
  const shadowX = rr * (1 - 2 * (clamped <= 0.5 ? clamped * 2 : (1 - clamped) * 2));
  const waxing = clamped <= 0.5;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id="moonGlow" cx="50%" cy="50%" r="65%">
            <Stop offset="0" stopColor={colors.lavender} stopOpacity={0.35} />
            <Stop offset="1" stopColor={colors.lavender} stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="moonLit" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#F3EEFA" />
            <Stop offset="0.55" stopColor={colors.lavender} />
            <Stop offset="1" stopColor={colors.blushDeep} />
          </LinearGradient>
        </Defs>

        {/* Soft ambient glow behind the moon */}
        <Circle cx={cx} cy={cy} r={r} fill="url(#moonGlow)" />

        {/* Lit disc */}
        <Circle cx={cx} cy={cy} r={rr} fill="url(#moonLit)" />

        {/* A few faint craters for texture on the lit side */}
        <Circle cx={cx - rr * 0.32} cy={cy - rr * 0.28} r={rr * 0.1} fill={colors.lavenderDeep} opacity={0.18} />
        <Circle cx={cx + rr * 0.18} cy={cy + rr * 0.15} r={rr * 0.14} fill={colors.lavenderDeep} opacity={0.14} />
        <Circle cx={cx - rr * 0.05} cy={cy + rr * 0.35} r={rr * 0.07} fill={colors.lavenderDeep} opacity={0.16} />

        {/* Dark occluding shadow forming the crescent/gibbous edge */}
        <Path d={describeTerminator(cx, cy, rr, shadowX, waxing)} fill={colors.midnight} opacity={0.88} />

        <Circle cx={cx} cy={cy} r={rr} stroke={colors.lavender} strokeWidth={1} fill="none" opacity={0.35} />
      </Svg>
    </View>
  );
}

// Builds a path approximating a lunar terminator so the shaded portion looks
// like a real crescent/gibbous edge rather than a plain half-circle wipe.
function describeTerminator(cx, cy, rr, shadowX, waxing) {
  if (waxing) {
    return `M ${cx} ${cy - rr}
            A ${rr} ${rr} 0 0 0 ${cx} ${cy + rr}
            A ${Math.abs(shadowX)} ${rr} 0 0 ${shadowX >= 0 ? 1 : 0} ${cx} ${cy - rr} Z`;
  }
  return `M ${cx} ${cy - rr}
          A ${rr} ${rr} 0 0 1 ${cx} ${cy + rr}
          A ${Math.abs(shadowX)} ${rr} 0 0 ${shadowX >= 0 ? 0 : 1} ${cx} ${cy - rr} Z`;
}

const styles = StyleSheet.create({});
