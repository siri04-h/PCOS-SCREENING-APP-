import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, type, spacing, radii, shadow } from '../theme/theme';

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// A soft, encouraging empty state used across screens instead of plain
// gray text, so "no data yet" feels like part of the design, not a gap in it.
export function EmptyState({ icon = '🌙', message }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={[type.bodyMuted, { textAlign: 'center' }]}>{message}</Text>
    </View>
  );
}

export function Eyebrow({ children }) {
  return <Text style={type.eyebrow}>{children}</Text>;
}

export function Button({ title, onPress, variant = 'primary', loading, disabled, style }) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        isPrimary && styles.btnPrimary,
        isGhost && styles.btnGhost,
        variant === 'outline' && styles.btnOutline,
        (disabled || loading) && { opacity: 0.6 },
        pressed && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.white : colors.lavenderDeep} />
      ) : (
        <Text
          style={[
            styles.btnText,
            isPrimary && { color: colors.white },
            isGhost && { color: colors.lavenderDeep },
            variant === 'outline' && { color: colors.ink },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, color }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected && { backgroundColor: color || colors.lavender, borderColor: color || colors.lavender },
      ]}
    >
      <Text style={[styles.chipText, selected && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({ children, style }) {
  return <Text style={[type.h2, styles.sectionTitle, style]}>{children}</Text>;
}

export function Badge({ label, color = colors.lavender }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadow.card,
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: colors.lavenderDeep },
  btnGhost: { backgroundColor: 'transparent' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.border },
  btnText: { fontFamily: type.label.fontFamily, fontSize: 15, color: colors.ink },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipText: { fontFamily: type.label.fontFamily, fontSize: 13, color: colors.ink },
  sectionTitle: { marginBottom: spacing.sm },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  badgeText: { fontFamily: type.label.fontFamily, fontSize: 12 },
  emptyState: { alignItems: 'center', paddingVertical: spacing.sm },
  emptyIcon: { fontSize: 22, marginBottom: 6, opacity: 0.7 },
});
