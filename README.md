# AI Viva Trainer

An AI-powered mock viva examination tool for engineering students. Practice technical interviews with a strict AI examiner that evaluates your answers in real time and gives you actionable feedback.

---

## The Problem

Engineering students often walk into viva exams unprepared — not because they don't know the subject, but because they've never been tested in a conversational, pressure-based format. Reading notes is very different from explaining a concept out loud to an examiner who asks follow-up questions based on your weak spots.

## What It Does

AI Viva Trainer simulates a real viva session:

- You choose a **subject** (DBMS, OOP, Operating Systems, Computer Networks, Java) and a **difficulty level** (Easy / Medium / Hard)
- An AI examiner asks you an opening technical question
- You type your answer — the AI evaluates it on **correctness (0–10)**, **clarity**, and **missing concepts**
- Based on your weaknesses, it asks targeted follow-up questions — just like a real examiner would
- At the end, you get a **session summary** with your overall score, strengths, areas to improve, and revision suggestions

## Why It's Useful

- **Adaptive questioning** — the AI doesn't follow a fixed script; it probes deeper where you're weak
- **Honest evaluation** — scores reflect actual answer quality, not just keyword matching
- **Immediate feedback** — you know exactly what you missed and what to revise
- **Zero setup** — no account, no scheduling, practice any time

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Groq API — Llama 3.3 70B |
| State | React Context API |
| Deployment | Vercel |

---

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/hemangi1324/ai_viva_trainer.git
   cd ai_viva_trainer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**

   Create a `.env` file in the root:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
   Get a free key at [console.groq.com](https://console.groq.com) — no credit card needed.

4. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## API Limits

The Groq free tier allows **14,400 requests/day** — far more than the Gemini free tier. If you hit the limit, the app shows a clear message and the quota resets in 24 hours.

---

## Built with Next.js and Groq
