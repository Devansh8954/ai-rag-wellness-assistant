# Local Setup & Execution Guide

### Prerequisites
- Node.js 18+ & npm
- Google Gemini API Key (optional — fallback mode active if missing)

### Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
   ```env
   PORT=3000
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

4. Run test suites:
   ```bash
   npm test
   npm run test:coverage
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

Access the UI at `http://localhost:3000`.
