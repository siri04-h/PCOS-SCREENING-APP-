import librosa
import numpy as np

def predict_voice_emotion(audio_path: str):
    y, sr = librosa.load(audio_path, sr=16000)

    # Extract basic audio features
    rms = np.mean(librosa.feature.rms(y=y))
    zcr = np.mean(librosa.feature.zero_crossing_rate(y))

    # Simple rule-based prediction
    if rms > 0.08:
        emotion = "anger"
    elif rms > 0.04:
        emotion = "happy"
    elif zcr > 0.12:
        emotion = "fear"
    else:
        emotion = "sad"

    confidence = round(min(0.75 + rms, 0.99), 3)

    return {
        "emotion": emotion,
        "confidence": confidence
    }