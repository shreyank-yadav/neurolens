# 🧠 NeuroLens – AI Powered Mental Health Monitoring System

---

## 🚀 Project Overview

NeuroLens is an AI-powered mental health monitoring system that:

* Detects **facial emotions** from images
* Detects **voice emotions** from audio
* Calculates **Risk Score**
* Calculates **Stress Index**
* Generates **Mental Health Dashboard Data**
* Stores historical emotional trends

Architecture:

Frontend → Backend (Node.js) → AI Service (FastAPI) → MongoDB

---

# 🏗️ Architecture

## 1️⃣ Backend (Node.js + Express)

Responsibilities:

* JWT Authentication
* Emotion storage
* Risk Engine
* Stress Engine
* Dashboard Aggregation API
* API layer for frontend

Location:

```
/backend
```

Runs on:

```
http://localhost:5000
```

---

## 2️⃣ AI Service (FastAPI)

Responsibilities:

* Face emotion detection (FER + OpenCV)
* Voice emotion detection (Librosa based processing)

Location:

```
/ai-service
```

Runs on:

```
http://127.0.0.1:8000
```

---

# 🗂️ Database Models (MongoDB)

## 👤 User Model

```
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

Currently active role: `user`

---

## 😊 EmotionLog Model

Stores both face & voice emotions.

```
{
  _id: ObjectId,
  userId: ObjectId,
  emotion: String,
  confidence: Number,
  createdAt: Date,
  updatedAt: Date
}
```

Supported emotions (AI based):

* happy
* sad
* angry
* fear
* disgust

---

## ⚠️ RiskLog Model

Calculated from last 7 emotional records.

```
{
  userId: ObjectId,
  totalChecked: Number,
  negativeCount: Number,
  consecutiveNegative: Number,
  highConfidenceNegative: Number,
  riskScore: Number,
  riskLevel: "Low" | "Moderate" | "High",
  createdAt: Date
}
```

### Risk Formula

```
riskScore =
  (negativeCount * 2) +
  (highConfidenceNegative * 3) +
  (consecutiveNegative * 4)
```

---

## 📊 StressLog Model

Weekly comparison based stress calculation.

```
{
  userId: ObjectId,
  currentWeekNegative: Number,
  previousWeekNegative: Number,
  moodDropPercentage: Number,
  stressIndex: Number,
  stressLevel: "Low" | "Moderate" | "High",
  createdAt: Date
}
```

### Stress Formula

```
stressIndex =
  (currentWeekNegative * 2) +
  (moodDropPercentage * 0.5)
```

---

# 🔐 Authentication

All protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

Login Endpoint:

```
POST /api/auth/login
```

---

# 📡 Backend API Endpoints

## 📷 Face Emotion

```
POST /api/emotion/save
FormData Key: image
```

## 🎙️ Voice Emotion

```
POST /api/emotion/voice
FormData Key: file
```

## 📜 Emotion History

```
GET /api/emotion/history
```

## ⚠️ Risk Score

```
GET /api/emotion/risk
```

## 📈 Risk History

```
GET /api/emotion/risk-history
```

## 📊 Stress Score

```
GET /api/emotion/stress
```

## 📊 Unified Dashboard API

```
GET /api/emotion/dashboard
```

Returns:

```
{
  latestEmotion,
  latestRisk,
  latestStress,
  totalLogs,
  last7DaysNegative
}
```

Frontend can build complete dashboard using this single endpoint.

---

# 🧠 AI Service Endpoints

## Face Detection

```
POST http://127.0.0.1:8000/detect-face
FormData: file
```

## Voice Detection

```
POST http://127.0.0.1:8000/detect-voice
FormData: file
```

---

# 🛠️ Setup Instructions

## Backend Setup

```
cd backend
npm install
node server.js
```

## AI Service Setup

```
cd ai-service
venv\Scripts\activate
python -m uvicorn app:app --reload --port 8000
```

---

# 📊 Current Completion Status (Phase 1)

| Module                | Status     |
| --------------------- | ---------- |
| Authentication        | ✅ Complete |
| Face Emotion AI       | ✅ Complete |
| Voice Emotion AI      | ✅ Complete |
| Emotion Storage       | ✅ Complete |
| Risk Engine           | ✅ Complete |
| Stress Engine         | ✅ Complete |
| Dashboard API         | ✅ Complete |
| Role Based Access     | 🔜 Phase 2 |
| Therapist/Admin Panel | 🔜 Phase 2 |

Backend: ~95% Complete
AI Service: Complete
Core Mental Health Engine: Complete

---

# 🎯 For Frontend Developers

Primary endpoint for dashboard:

```
GET /api/emotion/dashboard
```

Use this to display:

* Current Mood
* Risk Level Indicator
* Stress Level Indicator
* Total Emotional Logs
* Last 7 Days Negative Count

---

# 👨‍💻 Maintainer

Shreyank Yadav
mohit yadav
shubhendu dwivedi
NeuroLens – AI Mental Health Monitoring System


