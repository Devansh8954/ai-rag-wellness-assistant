# AI RAG System — Technical Interview Talking Points & Q&A

### 1. How does your RAG system prevent AI hallucinations?
> *"Instead of relying solely on the LLM's pre-trained weights, my application executes a vector retrieval step over a curated wellness knowledge base. The top matching documents are attached to the prompt as explicit context directives before hitting the Gemini API, ensuring the response remains grounded in verified techniques."*

### 2. How did you handle emergency or high-risk inputs safely?
> *"I implemented a Safety Guardrail Middleware that runs before LLM invocation. If crisis or self-harm keywords are detected, the middleware short-circuits the request and immediately returns a 200 response with verified 24/7 crisis helpline resources (988 Lifeline, Crisis Text Line), eliminating AI latency and risk."*

### 3. How is conversation state preserved across requests?
> *"A Session Memory Service maintains an in-memory sliding buffer of past user and assistant interactions indexed by session ID. This allows multi-turn conversations while capping memory usage to avoid buffer overflows."*
