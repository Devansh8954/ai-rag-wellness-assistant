# AI RAG Wellness Platform — System Architecture & Deep Dive

The **AI RAG Wellness Assistant** is a production-grade conversational AI microservice built with **TypeScript, Express, Google Gemini AI, and Vector Retrieval-Augmented Generation (RAG)**.

---

### 🧠 What is RAG (Retrieval-Augmented Generation)?

Standard Large Language Models (LLMs) often suffer from:
1. **Hallucinations:** Generating non-factual or unsafe answers.
2. **Lack of Domain Context:** Giving generic responses instead of evidence-based psychological guidelines.

**How RAG Solves This:**
Before sending the user's question to Google Gemini AI, our **Vector RAG Engine** searches a curated knowledge base of evidence-based wellness guidelines (CBT, 5-4-3-2-1 Grounding, Box Breathing, Sleep Hygiene) using term-frequency similarity matching. It injects the relevant medical context into the AI prompt so the model gives grounded, accurate, and supportive answers.

---

### 🏛️ System Architecture

```
  ┌─────────────────────────────────────────────────────────────┐
  │                   DARK-MODE GLASS UI                       │
  │     Live Response Streaming · RAG Evidence Badges           │
  └──────────────────────────────┬──────────────────────────────┘
                                 │ HTTP / JSON
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                    SAFETY GUARDRAIL MIDDLEWARE              │
  │     Intercepts crisis keywords (e.g. 988 lifeline)          │
  └──────────────────────────────┬──────────────────────────────┘
                                 │ Safe Queries Only
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                  VECTOR RAG RETRIEVAL ENGINE                │
  │     Similarity matching across evidence-based docs          │
  └──────────────────────────────┬──────────────────────────────┘
                                 │ Grounded Context
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                  GEMINI AI PROMPT AUGMENTATION              │
  │     Combines directive + RAG context + session memory       │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                   GOOGLE GEMINI AI API                      │
  └─────────────────────────────────────────────────────────────┘
```

---

### 🚀 Key Technical Components

1. **RAG Vector Engine (`src/services/ragEngine.ts`):** Tokenizes queries and calculates similarity scores to retrieve evidence-based grounding snippets.
2. **Crisis Guardrail Middleware (`src/middleware/safetyGuardrails.ts`):** Intercepts high-risk crisis keywords with instant emergency response resources.
3. **Session Memory Service (`src/services/sessionMemory.ts`):** Maintains multi-turn context per session ID.
4. **Multimodal Analysis (`src/routes/chat.ts`):** Handles image uploads for wellness environmental analysis.
