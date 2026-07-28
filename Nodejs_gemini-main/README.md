# AI RAG Mental Health & Wellness Assistant Platform

A production-grade, RAG-backed conversational AI platform built with **TypeScript, Node.js, Express, and Google Gemini AI**. Grounded in evidence-based psychological grounding techniques, cognitive reframing, and sleep hygiene practices with automated crisis safety guardrails and multi-turn session memory.

[![CI/CD Deploy to GCP Cloud Run](https://github.com/Devansh8954/Nodejs_gemini-main/actions/workflows/deploy.yml/badge.svg)](https://github.com/Devansh8954/Nodejs_gemini-main/actions)

---

## 🚀 Key Features

- **Vector RAG Engine (TF-IDF & Cosine Similarity):** Prevents AI hallucinations by searching a curated evidence-based wellness knowledge base before augmenting prompts to Gemini AI.
- **Safety Interception Guardrails:** Intercepts high-risk crisis keywords in real-time, instantly delivering 24/7 emergency helpline resources (988 Lifeline).
- **Session Memory Management:** Maintains sliding conversation buffers across user interactions.
- **Multimodal Image Analysis:** Analyzes uploaded images for wellness and environmental stress context.
- **Glassmorphism Dark UI:** Interactive single-page UI with RAG context evidence badges and instant quick-prompts.
- **GCP Cloud Run Serverless Architecture:** Automated zero-downtime keyless deployment via GitHub Actions (Workload Identity Federation).

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Language** | TypeScript 5.x |
| **Framework** | Express.js 4.x |
| **AI Integration** | Google Gemini AI (`gemini-1.5-flash`) |
| **RAG & Vector Search** | Custom TF-IDF Cosine Similarity Retriever |
| **Testing** | Jest + Supertest (80%+ Coverage) |
| **Containers & Deployment**| Docker + GCP Cloud Run |

---

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to launch the platform locally.

---

## Documentation Deep Dives

- [System Architecture & RAG Breakdown](docs/project-explained.md)
- [Technical Interview Q&A Guide](docs/interview.md)
- [Local Setup & Testing Guide](docs/run-locally.md)
