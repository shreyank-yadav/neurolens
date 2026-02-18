# 🧠 NeuroLens

Multimodal AI-Powered Emotion Aware Wellness System

---

# 📌 Project Overview

NeuroLens is a multimodal AI-based mental wellness backend system that detects emotions using:

* Face (Image-based emotion detection)
* Voice (Audio-based emotion detection)

It stores emotional logs securely and calculates user risk levels for preventive mental healthcare.

---

# 🏗 Current Architecture

Frontend (Pending)
↓
Backend (Node.js + Express)
↓
AI Service (FastAPI + Python ML)
↓
MongoDB Database

---

# ✅ Work Completed (MVP Stage)

## 🔹 AI Service (FastAPI)

✔ Face Emotion Detection (`/detect-face`)
✔ Voice Emotion Detection (`/detect-voice`)
✔ File handling with auto-cleanup
✔ FER (Facial Emotion Recognition) model integration
✔ Librosa-based voice feature extraction (MFCC)
✔ REST API endpoints

### AI Service Tech Stack

* Python 3.10
* FastAPI
* TensorFlow
* FER
* OpenCV
* Librosa
* NumPy
* Uvicorn

---

## 🔹 Backend (Node.js)

✔ User Registration
✔ User Login (JWT Authentication)
✔ Protected Routes
✔ Save Face Emotion
✔ Save Voice Emotion
✔ Emotion History API
✔ Risk Score Calculation
✔ Multer file handling (Image + Audio separated)
✔ MongoDB integration

### Backend Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Multer
* Axios

---

# 📂 Folder Structure

```
neuroLens/
│
├── ai-service/
│   ├── app.py
│   ├── temp_files/
│   └── venv/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │
│   └── uploads/
│
└── .gitignore
```

---

# 🗄 Database Schema

## 👤 User Model

Stored in MongoDB

```js
{
  _id: ObjectId,
  name: String,
  email: String,
  password: Hashed String,
  role: "user" | "admin" | "therapist",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 😊 EmotionLog Model

```js
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  emotion: String,          // happy | sad | angry | neutral
  confidence: Number,       // 0.0 - 1.0
  createdAt: Date,
  updatedAt: Date
}
```

---

# 📡 API Endpoints

## 🔐 Auth Routes

POST `/api/auth/register`
POST `/api/auth/login`

---

## 🎭 Emotion Routes

POST `/api/emotion/save`      → Face Emotion (image key)
POST `/api/emotion/voice`     → Voice Emotion (file key)
GET  `/api/emotion/history`
GET  `/api/emotion/risk`

---

# 📤 File Upload Formats

## Image Upload

* Key: `image`
* Format: JPG / PNG
* Stored temporarily in `uploads/`

## Audio Upload

* Key: `file`
* Format: WAV only
* Stored temporarily in `uploads/`

Files are auto-deleted after processing.

---

# 📊 Risk Calculation Logic (Current)

* Last 5 emotional records checked
* sad / angry counted as negative

Risk Levels:

* 0 negative → Low
* 1-2 negative → Moderate
* 3+ negative → High

---

# 🚧 Work Remaining

## 🔜 Backend

* Weighted risk scoring
* Time-decay emotion analysis
* Therapist dashboard APIs
* Alert notification system
* Role-based access control expansion

## 🔜 AI Service

* Real deep learning voice emotion model
* Emotion trend prediction model
* Multimodal fusion (face + voice combined prediction)
* Touch sensor integration (future hardware phase)

## 🔜 Frontend

* React Native mobile app
* Live webcam detection
* Live microphone detection
* Neurologist dashboard UI

---

# 🎯 Current Project Status

AI Service: ~70% MVP Complete
Backend: ~75% Complete
Frontend: Not Started
Hardware Integration: Not Started

Overall Project Completion: ~60%

---

# 🚀 Future Vision

NeuroLens aims to become a:

"Multimodal Emotion Intelligence Platform for Preventive Mental Healthcare"

Planned features:

* Real-time emotion tracking
* Predictive mental health alerts
* Therapist monitoring dashboard
* Emotion analytics visualization
* Smart wearable integration

---

# 👨‍💻 Developer Notes

* All routes are JWT protected
* All files are validated before upload
* AI service runs on port 8000
* Backend runs on port 5000
* MongoDB connection required before starting backend

---

# 🧠 Project Type

AI + Backend Microservice Architecture
Startup-Ready Scalable Design

---

backend and ai-service by: Shreyank Yadav
Project: NeuroLens

---
