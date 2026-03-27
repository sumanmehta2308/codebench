# CodeBench 🚀

![CodeBench Logo](./Frontend/public/logo.png)

## 🌐 Live Links
- **Frontend (Vercel):** [code-bench-ui.vercel.app](https://code-rover-frontend.vercel.app/)
- **Backend (Render):** [code-bench-api.onrender.com](https://coderover-frontend.onrender.com/)

> **Note:** The **Docker-based Code Execution** feature requires a local setup with Docker Desktop running, as cloud platforms (Vercel/Render) do not support spawning nested Docker containers in their free tiers.

---

## 📖 Overview

**CodeBench** is a high-performance, full-stack platform designed for **remote technical interviews** and **collaborative coding**. It features a secure, containerized execution engine and real-time synchronization, allowing users to solve complex algorithmic problems in a shared virtual room.

### Key Features
- **Problem Archive:** A structured database of coding challenges with descriptions, constraints, and hidden test cases.
- **Secure Authentication:** Robust user management using **JWT (JSON Web Tokens)** and HTTP-only cookies.
- **Dashboard & Analytics:** Track solved problems and user performance via a personalized profile.
Real-Time Code Syncing: Multiple users can write and edit code simultaneously in a shared Monaco Editor.
Integrated Video & Audio: WebRTC-powered high-quality video calls for seamless communication during technical assessments.
Admin Control: Hosts can manage interview questions, set countdown timers, and control join requests
---

## 🛠️ Tech Stack

Layer         Technologies
Frontend      React.js, Redux Toolkit, Tailwind CSS v4, Monaco Editor, Vite
Backend       Node.js, Express.js, Socket.io (WebSockets)
Database      MongoDB (Mongoose), Redis (Rate Limiting)
Real-time     WebRTC (Peer-to-Peer Video/Audio)
DevOps        Docker (Isolated Execution), Judge0
Cloud         Cloudinary (User Avatars), Vercel, Render

---

## 🚀 Local Installation

### 1. Clone the Project
```bash
git clone [https://github.com/SumanMehta/CodeBench.git](https://github.com/SumanMehta/CodeBench.git)
cd CodeBench
PORT=8000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
VITE_BACKEND_URL=http://localhost:8000
VITE_BACKEND_URL_FOR_SOCKET=http://localhost:8000
npm install && npm run dev
Author
   Suman Mehta 
MCA Student @ National Institute of Technology (NIT), Raipur
 Email: sumanmehta8298@gmail.com
LeetCode: 650+ Problems Solved
GeeksforGeeks: 250+ Problems Solved
