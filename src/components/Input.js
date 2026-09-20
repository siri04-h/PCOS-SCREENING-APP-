import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { colors, type, spacing, radii } from '../theme/theme';

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  style,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[{ marginBottom: spacing.md }, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused && styles.inputFocused]}
      />
    </View>
  );
}

// Fixed 1–5 scale selector
export function ScaleSelector({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
  lowLabel,
  highLabel,
}) {
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={styles.scaleRow}>
        {values.map((v) => (
          <Pressable
            key={v}
            onPress={() => onChange(v)}
            style={[
              styles.scaleDot,
              value === v && styles.scaleDotActive,
            ]}
          >
            <Text
              style={[
                styles.scaleDotText,
                value === v && styles.scaleDotTextActive,
              ]}
            >
              {v}
            </Text>
          </Pressable>
        ))}
      </View>

      {(lowLabel || highLabel) && (
        <View style={styles.scaleCaptions}>
          <Text style={type.caption}>{lowLabel}</Text>
          <Text style={type.caption}>{highLabel}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...type.label,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: type.body.fontFamily,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.white,
  },

  inputFocused: {
    borderColor: colors.lavenderDeep,
  },

  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  scaleDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },

  scaleDotActive: {
    backgroundColor: colors.lavenderDeep,
    borderColor: colors.lavenderDeep,
  },

  scaleDotText: {
    fontFamily: type.label.fontFamily,
    color: colors.ink,
    fontSize: 16,
  },

  scaleDotTextActive: {
    color: colors.white,
  },

  scaleCaptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});