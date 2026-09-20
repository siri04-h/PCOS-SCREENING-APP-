import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import { colors, type, spacing, radii } from '../../theme/theme';
import { Card, Button, Chip, Eyebrow } from '../../components/UI';
import { Input } from '../../components/Input';
import emotionApi from '../../api/emotionApi';

const SELF_REPORT_OPTIONS = ['Happy', 'Calm', 'Anxious', 'Sad', 'Irritable', 'Stressed', 'Neutral'];

export default function EmotionInputScreen({ navigation }) {
  const [text, setText] = useState('');
  const [selfReport, setSelfReport] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [facePhoto, setFacePhoto] = useState(null);
  const [recording, setRecording] = useState(null);
  const [voiceUri, setVoiceUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const openCamera = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert('Camera permission needed', 'Enable camera access to use facial emotion detection.');
        return;
      }
    }
    setCameraOpen(true);
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });
    setFacePhoto(photo.uri);
    setCameraOpen(false);
  };

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Microphone permission needed', 'Enable microphone access to use voice emotion detection.');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: rec } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(rec);
      setIsRecording(true);
    } catch (e) {
      Alert.alert('Recording failed', 'Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    setVoiceUri(recording.getURI());
    setRecording(null);
  };

  const onSubmit = async () => {
    if (!text && !selfReport && !facePhoto && !voiceUri) {
      Alert.alert('Share something', 'Add at least one signal — text, voice, face, or a self-report.');
      return;
    }
    setSubmitting(true);
    try {
      if (facePhoto) await emotionApi.submitFaceEmotion(facePhoto);
      if (voiceUri) await emotionApi.submitVoiceEmotion(voiceUri);
      await emotionApi.fuseAndSubmit({
        date: new Date().toISOString().slice(0, 10),
        text: text || undefined,
        selfReport: selfReport || undefined,
      });
      Alert.alert('Thanks for sharing', 'Your emotion check-in has been recorded.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Couldn’t save', 'Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cameraOpen) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.midnight }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />
        <View style={styles.cameraControls}>
          <Pressable style={styles.cameraCancel} onPress={() => setCameraOpen(false)}>
            <Text style={{ color: colors.white }}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.captureBtn} onPress={capturePhoto} />
          <View style={{ width: 60 }} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
      <Eyebrow>Emotion check-in</Eyebrow>
      <Text style={[type.h1, { marginTop: 6, marginBottom: spacing.lg }]}>How are you feeling?</Text>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={type.h2}>Type it out</Text>
        <Input
          value={text}
          onChangeText={setText}
          placeholder="Write a sentence or two about how today feels..."
          style={{ marginTop: spacing.sm, marginBottom: 0 }}
        />
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={type.h2}>Voice</Text>
        <Text style={[type.bodyMuted, { marginTop: 4, marginBottom: spacing.sm }]}>
          Record a short voice note — tone carries emotional signal too.
        </Text>
        <Button
          title={isRecording ? 'Stop recording' : voiceUri ? 'Re-record' : 'Start recording'}
          variant={isRecording ? 'primary' : 'outline'}
          onPress={isRecording ? stopRecording : startRecording}
        />
        {voiceUri ? <Text style={[type.caption, { marginTop: 8 }]}>Voice note captured ✓</Text> : null}
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <Text style={type.h2}>Face</Text>
        <Text style={[type.bodyMuted, { marginTop: 4, marginBottom: spacing.sm }]}>
          A quick selfie helps detect facial emotion cues. Nothing is stored without your consent.
        </Text>
        <Button title={facePhoto ? 'Retake photo' : 'Open camera'} variant="outline" onPress={openCamera} />
        {facePhoto ? <Text style={[type.caption, { marginTop: 8 }]}>Photo captured ✓</Text> : null}
      </Card>

      <Card style={{ marginBottom: spacing.lg }}>
        <Text style={type.h2}>Or just tell us</Text>
        <View style={[styles.chipRow, { marginTop: spacing.sm }]}>
          {SELF_REPORT_OPTIONS.map((s) => (
            <Chip key={s} label={s} selected={selfReport === s} onPress={() => setSelfReport(s)} />
          ))}
        </View>
      </Card>

      <Button title="Submit check-in" onPress={onSubmit} loading={submitting} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, backgroundColor: colors.moonlight, flexGrow: 1, paddingTop: 60 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  cameraCancel: { width: 60 },
  captureBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: colors.lavender,
  },
});
