from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class EmotionRequest(BaseModel):
    dummy_input: str

@app.get("/")
def root():
    return {"message": "NeuroLens AI Service Running 🧠"}

@app.post("/detect-face")
def detect_face(data: EmotionRequest):
    emotions = ["happy", "sad", "angry", "neutral"]
    emotion = random.choice(emotions)

    return {
        "emotion": emotion,
        "confidence": round(random.uniform(0.7, 0.95), 2)
    }
