# 🤖 AI Resume Builder

An AI-powered web application that generates professional, ATS-friendly resumes using Google Gemini AI.

Users can enter their education, skills, projects, work experience, and other details, and the application generates a structured professional resume targeted to their selected job role.

## 🌐 Live Demo

https://ai-resume-builder1-1.onrender.com

## ✨ Features

- AI-powered resume generation
- ATS-friendly resume formatting
- Multiple target job roles
- Professional resume preview
- Automatic professional summary generation
- Skills and project optimization
- Resume content improvement using Gemini AI
- PDF/print support
- Copy generated resume HTML
- Responsive user interface
- Secure backend API architecture
- API rate limiting
- Production CORS protection

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- REST API

### AI

- Google Gemini API
- Gemini 2.5 Flash

### Security

- Environment variables
- CORS
- API rate limiting
- Request-size limiting

### Deployment

- Render
- GitHub

## 🏗️ Architecture

User
↓
Frontend
↓
REST API
↓
Node.js / Express Backend
↓
Google Gemini API
↓
Generated Resume
↓
Resume Preview / PDF

## 📁 Project Structure

AI Resume Builder/

├── index.html
├── style.css
├── script.js
├── README.md
├── .gitignore
│
└── backend/
    ├── server.js
    ├── package.json
    └── package-lock.json

## ⚙️ How It Works

1. The user selects a target resume role.
2. The user enters personal information, education, experience, projects, and technical skills.
3. The frontend sends the information to the Express backend.
4. The backend creates an ATS-focused prompt.
5. The backend securely communicates with the Google Gemini API.
6. Gemini generates structured resume HTML.
7. The backend returns the generated resume to the frontend.
8. The application displays the resume in the preview.
9. The user can print/save the resume as a PDF or copy the generated HTML.

## 🔐 Security

The Gemini API key is never stored in frontend JavaScript.

The key is stored as a server-side environment variable:

GEMINI_API_KEY

The `.env` file is excluded from Git using `.gitignore`.

Additional backend protection includes:

- CORS restrictions
- Request-size limits
- API rate limiting

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/gurupavan7/ai-resume-builder1.git
