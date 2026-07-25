<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4285F4,100:34A853&height=180&section=header&text=Node.js%20Gemini%20AI&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Google%20Gemini%20AI%20Integration%20with%20Node.js%20%7C%20Express%20%7C%20Chat%20%7C%20BMI%20AI&descAlignY=60&descSize=14" width="100%"/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-34A853?style=for-the-badge)](./LICENSE)

> A **Node.js + Express backend** that integrates **Google Gemini AI** (`@google/generative-ai`) to power multiple AI-driven applications — including an interactive chat assistant, BMI AI analyzer, and streaming text generation.

</div>

---

## 📋 About This Project

This project demonstrates how to build **Google Gemini AI-powered applications** with Node.js and Express. It includes multiple server implementations showcasing different Gemini AI capabilities — from standard chat completions to streaming responses and domain-specific AI tools.

---

## ✨ Features

| Feature | Server File | Description |
|---|---|---|
| 💬 **Standard Chat** | `server.js` | Basic Gemini chat completions API |
| 🏋️ **BMI AI Analyzer** | `server_bmi.js` | AI-powered BMI calculation with health insights |
| 🔄 **Interactive Chat** | `server_interactive_chat.js` | Multi-turn conversational AI with history |
| ⚡ **Streaming Text** | `server_text_stream.js` | Real-time token streaming with Gemini |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API server |
| **@google/generative-ai** | Official Google Gemini SDK |
| **OpenAI SDK** | OpenAI-compatible integration |
| **dotenv** | Secure API key management |
| **Multer** | File upload middleware |
| **CORS** | Cross-origin request handling |
| **Vercel** | Serverless deployment |

---

## 📁 Project Structure

```
node Gemini project/
└── Nodejs_gemini-main/
    ├── server.js                    # Basic Gemini chat API
    ├── server_bmi.js                # BMI + AI health analysis
    ├── server_interactive_chat.js   # Multi-turn chat with history
    ├── server_text_stream.js        # Streaming token generation
    ├── public/                      # Frontend HTML/JS files
    ├── vercel.json                  # Vercel deployment config
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Google Gemini API Key](https://ai.google.dev/) (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/Devansh8954/node-Gemini-project.git
cd "node Gemini project/Nodejs_gemini-main"

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your API keys to .env:
# GEMINI_API_KEY=your_gemini_api_key_here
```

### Running the Servers

```bash
# Basic chat server
node server.js

# BMI AI Analyzer
node server_bmi.js

# Interactive multi-turn chat
node server_interactive_chat.js

# Streaming server
node server_text_stream.js
```

---

## 📡 API Examples

### Chat Completion

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain quantum computing in simple terms"}'
```

### BMI AI Analysis

```bash
curl -X POST http://localhost:3000/api/bmi \
  -H "Content-Type: application/json" \
  -d '{"weight": 70, "height": 175, "age": 25, "gender": "male"}'
```

### Interactive Chat (Multi-turn)

```bash
curl -X POST http://localhost:3000/api/chat/interactive \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "history": []}'
```

---

## ☁️ Deployment

Configured for **Vercel** serverless deployment:

```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod
```

Add `GEMINI_API_KEY` to your Vercel environment variables in the dashboard.

---

## 💡 Key Concepts Demonstrated

- ✅ Google Gemini SDK integration with Node.js
- ✅ Streaming AI responses with `generateContentStream()`
- ✅ Multi-turn chat history management
- ✅ Environment-based API key security with dotenv
- ✅ RESTful API design for AI microservices
- ✅ Serverless deployment with Vercel

---

<div align="center">

**Built with ❤️ by [Devansh Tyagi](https://github.com/Devansh8954)**

⭐ Star this repo if you found it useful!

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4285F4,100:34A853&height=100&section=footer" width="100%"/>

</div>
