from fastapi import FastAPI, File, UploadFile
import shutil
import os
import cv2
import librosa
import numpy as np
from fer.fer import FER

app = FastAPI()

UPLOAD_FOLDER = "temp_files"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Initialize Face Emotion Detector
emotion_detector = FER(mtcnn=True)


@app.get("/")
def root():
    return {"message": "NeuroLens AI Service Running 🧠"}


# =====================================
# FACE EMOTION DETECTION
# =====================================
@app.post("/detect-face")
async def detect_face(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    try:
        # Save image
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Read image
        img = cv2.imread(file_path)

        if img is None:
            return {"emotion": "Image read error", "confidence": 0}

        # Detect emotion
        results = emotion_detector.detect_emotions(img)

        if not results:
            return {"emotion": "No face detected", "confidence": 0}

        emotions = results[0]["emotions"]
        top_emotion = max(emotions, key=emotions.get)
        confidence = emotions[top_emotion]

        return {
            "emotion": top_emotion,
            "confidence": round(float(confidence), 2)
        }

    except Exception as e:
        return {"emotion": "Face processing error", "confidence": 0}

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


# =====================================
# VOICE EMOTION DETECTION
# =====================================
@app.post("/detect-voice")
async def detect_voice(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    try:
        # Save audio
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Load first 3 seconds
        audio, sr = librosa.load(file_path, duration=3, offset=0.5)

        if len(audio) == 0:
            return {"emotion": "Empty audio", "confidence": 0}

        # Extract MFCC features
        mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)
        mfcc_mean = np.mean(mfcc.T, axis=0)

        # Simple energy-based placeholder classifier
        energy = np.mean(np.abs(audio))

        if energy > 0.06:
            emotion = "angry"
            confidence = 0.80
        elif energy > 0.03:
            emotion = "happy"
            confidence = 0.75
        else:
            emotion = "sad"
            confidence = 0.70

        return {
            "emotion": emotion,
            "confidence": confidence
        }

    except Exception as e:
        return {"emotion": "Voice processing error", "confidence": 0}

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
