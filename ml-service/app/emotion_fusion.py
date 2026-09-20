# app/emotion_fusion.py

def fuse_emotions(text_emotion, voice_emotion, face_emotion, self_report):
    emotions = [
        text_emotion.lower(),
        voice_emotion.lower(),
        face_emotion.lower(),
        self_report.lower()
    ]

    counts = {}
    for emotion in emotions:
        counts[emotion] = counts.get(emotion, 0) + 1

    overall = max(counts, key=counts.get)

    return {
        "overallEmotion": overall.capitalize(),
        "confidence": round(counts[overall] / len(emotions), 2),
        "sources": counts
    }