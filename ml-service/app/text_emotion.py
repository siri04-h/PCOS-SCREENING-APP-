from transformers import pipeline

# Load emotion detection model once
emotion_pipeline = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1
)

def predict_text_emotion(text: str):
    """
    Predict emotion from user text.
    Returns emotion label and confidence score.
    """

    result = emotion_pipeline(text)[0][0]

    return {
        "emotion": result["label"],
        "confidence": round(float(result["score"]), 4)
    }