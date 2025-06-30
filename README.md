# 🤖 AI Interview Preparation Website

A powerful and interactive AI-driven interview preparation platform that simulates real interview experiences using voice and intelligent question-answering. This project is built using the MERN stack and integrates with **Vapi** for real-time voice interaction and **Gemini AI** for dynamic interview question generation and analysis.

🌐 Live Demo: [https://ai-interview-preparation-website.onrender.com](https://ai-interview-preparation-website.onrender.com)

---

## 🚀 Features

- 🎤 **AI Voice Interviewer**: Simulates real interview conversations with voice using Vapi.
- 💬 **Real-time Q&A**: Users answer spoken questions, and responses are recorded and analyzed.
- 📊 **Post-Interview Analysis**: Summarized feedback and performance review using Gemini AI.
- 📝 **Role-Based Interview Creation**: Users can create interviews based on job role, type, and number of questions.
- 📂 **Your Interviews Dashboard**: View, manage, and retake past interviews easily.

---

## 🧰 Tech Stack

### 🟢 Backend
- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **Gemini AI API** (for question generation and interview analysis)
- **Vapi API** (for voice-based interaction)

### 🔵 Frontend
- **React.js**
- **React Router**
- **Bootstrap** (or your UI framework if different)
- **Axios** for API calls

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Ganesh6811/AI-Interview-Preparation-Website.git
cd ai-interview-preparation-website

cd backend
npm install
# Create .env file with your MongoDB URI, Gemini API Key, Vapi credentials, etc.
npm start


cd frontend
npm install
npm start
