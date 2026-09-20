import os

# Make DeepFace optional
try:
    from deepface import DeepFace
except ImportError:
    DeepFace = None


def predict_face_emotion(image_path: str):
    # If DeepFace isn't installed, return a safe default
    if DeepFace is None:
        return {
            "emotion": "neutral",
            "confidence": 0.0
        }

    # If image doesn't exist
    if not image_path or not os.path.exists(image_path):
        return {
            "emotion": "neutral",
            "confidence": 0.0
        }

    try:
        result = DeepFace.analyze(
            img_path=image_path,
            actions=["emotion"],
            enforce_detection=False
        )

        if isinstance(result, list):
            result = result[0]

        dominant = result["dominant_emotion"]

        return {
            "emotion": dominant,
            "confidence": round(
                float(result["emotion"][dominant]) / 100,
                3
            )
        }

    except Exception as e:
        print("Face emotion error:", e)
        return {
            "emotion": "neutral",
            "confidence": 0.0
        }