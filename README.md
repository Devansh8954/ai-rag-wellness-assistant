<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4285F4,50:6f42c1,100:34A853&height=220&section=header&text=AI%20RAG%20Wellness%20Assistant&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Google%20Gemini%20AI%20%7C%20Vector%20RAG%20Engine%20%7C%20Crisis%20Guardrails%20%7C%20GCP%20Cloud%20Run&descAlignY=60&descSize=16" width="100%"/>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini%20AI-1.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GCP Cloud Run](https://img.shields.io/badge/GCP_Cloud_Run-Deployed-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![Live Platform](https://img.shields.io/badge/Live_Platform-28a745?style=for-the-badge&logo=googlecloud&logoColor=white)](https://ai-rag-wellness-assistant-266670750120.asia-south1.run.app)
[![CI/CD WIF](https://img.shields.io/badge/CI%2FCD-GitHub_Actions_WIF-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](.github/workflows)

> An enterprise-grade **AI Mental Health & Wellness Assistant** powered by **Node.js, TypeScript, Google Gemini AI, and a custom RAG (Retrieval-Augmented Generation) Vector Search Engine**. Features real-time safety crisis guardrails, dynamic multi-turn session memory, multimodal image evaluation, and keyless WIF deployment to GCP Cloud Run.

### 🌐 [Live Platform Demo → https://ai-rag-wellness-assistant-266670750120.asia-south1.run.app](https://ai-rag-wellness-assistant-266670750120.asia-south1.run.app)

</div>

---

## 💡 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT INTERFACE                               │
│              Responsive Interactive Chat UI & Vision Upload             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP / REST API
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     EXPRESS GATEWAY & GUARDRAIL                         │
│  • CORS & Rate Limiter Middleware                                       │
│  • Crisis Interception Middleware (988 Emergency Lifeline Intercept)   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────────────────┐               ┌───────────────────┐
│       RAG VECTOR SEARCH ENGINE    │               │  SESSION MANAGER  │
│ • TF-IDF Cosine Similarity        │               │ • Conversation    │
│ • Clinical Guidelines Store       │               │   Buffer Memory   │
│ • Relevant Context Injection      │               │ • State Tracking  │
└──────────────────┬────────────────┘               └─────────┬─────────┘
                   │                                          │
                   └────────────────────┬─────────────────────┘
                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         GOOGLE GEMINI 1.5 FLASH                         │
│             Generative Contextual Synthesis & Multimodal Vision         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Platform Features

| Capability | Technical Details |
|---|---|
| 🔍 **RAG Vector Search Engine** | Custom TF-IDF Cosine Similarity vector engine matching queries against validated CBT and wellness guidelines prior to LLM synthesis. |
| 🛡️ **Crisis Safety Intercept** | Intercepts high-risk distress keywords at the middleware level, bypassing LLM generation to immediately return 988 Crisis Lifeline resources. |
| 🧠 **Multi-Turn Session Memory** | Stateful conversation buffer preserving contextual history across multi-turn user dialogs. |
| 👁️ **Multimodal Vision Analysis** | Image evaluation endpoint leveraging Gemini Vision to analyze environmental context for wellness insights. |
| ☁️ **GCP Cloud Run Serverless** | Containerized microservice executing on GCP Cloud Run with zero-idle scaling and Workload Identity Federation (WIF) CI/CD. |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Language** | TypeScript 5.x | Strongly-typed interfaces, domain modeling, OOP patterns |
| **Runtime** | Node.js 20.x | High-throughput asynchronous backend server |
| **Web Framework** | Express.js 4.x | RESTful routing, middleware orchestration, static hosting |
| **AI Model** | Google Gemini 1.5 Flash | LLM reasoning, contextual response synthesis, multimodal vision |
| **RAG Engine** | TF-IDF + Cosine Similarity | Local vector store & semantic similarity scoring |
| **Containers** | Docker | Multi-stage slim Docker build (`node:20-alpine`) |
| **Cloud Hosting** | GCP Cloud Run | Auto-scaling serverless container platform |
| **CI/CD Pipeline** | GitHub Actions + WIF | Keyless OIDC authentication deployment pipeline |

---

## 📁 Repository Structure

```
node Gemini project/
└── Nodejs_gemini-main/
    ├── src/
    │   ├── controllers/           # Route controllers (Chat, Vision, RAG)
    │   ├── services/              # Gemini AI & RAG Vector Engine business logic
    │   ├── middleware/            # Safety crisis interceptor & rate limiter
    │   ├── vectorStore/           # CBT & mental health knowledge base vectors
    │   └── app.ts                 # Express application initialization
    ├── public/                    # Interactive web UI frontend
    ├── Dockerfile                 # Multi-stage production container build
    ├── .github/workflows/         # Keyless GCP Cloud Run WIF deploy workflow
    └── package.json
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js v18 or v20
- Docker Desktop (Optional)
- Google Gemini API Key ([Get one free](https://ai.google.dev/))

### Installation & Run

```bash
# 1. Clone repo
git clone https://github.com/Devansh8954/node-Gemini-project.git
cd "node Gemini project/Nodejs_gemini-main"

# 2. Install dependencies
npm install

# 3. Configure Environment
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🐳 Docker Deployment

```bash
# Build Docker image
docker build -t ai-rag-wellness-assistant .

# Run container locally
docker run -d -p 3000:3000 --env-file .env ai-rag-wellness-assistant
```

---

## 📡 Key API Endpoints

| Endpoint | Method | Payload | Description |
|---|---|---|---|
| `/api/chat` | `POST` | `{"message": "string", "sessionId": "string"}` | RAG-augmented Gemini AI wellness conversation |
| `/api/vision` | `POST` | `multipart/form-data` (image file) | Multimodal visual wellness environment analysis |
| `/health` | `GET` | — | Liveness & readiness check for GCP Cloud Run |

---

## 🎯 Key Architecture & Interview Highlights

- **Why Custom RAG Vector Search?** Prevents LLM hallucinations by grounding responses in verified CBT wellness documentation using TF-IDF vector similarity.
- **Safety Interception Pattern:** Prevents dangerous queries from reaching the AI model by running early-gate keyword matching for instant emergency redirection.
- **Keyless GCP Authentication:** CI/CD uses Google Cloud Workload Identity Federation (WIF), eliminating long-lived service account JSON keys.

---

<div align="center">

**Built with ❤️ by [Devansh Tyagi](https://github.com/Devansh8954)**

[![Live Platform](https://img.shields.io/badge/Live_Platform-28a745?style=for-the-badge&logo=googlecloud&logoColor=white)](https://ai-rag-wellness-assistant-266670750120.asia-south1.run.app)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4285F4,50:6f42c1,100:34A853&height=100&section=footer" width="100%"/>

</div>

