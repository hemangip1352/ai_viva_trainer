# AI Viva Trainer

An AI-powered web application that helps engineering students prepare for technical viva exams through interactive practice sessions with intelligent question generation and evaluation.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Features

- **Subject Selection**: Choose from DBMS, OOP, Operating Systems, Computer Networks, and Java
- **Difficulty Levels**: Easy, Medium, and Hard difficulty settings
- **AI Examiner**: Powered by Google Gemini for realistic viva simulation
- **Real-time Evaluation**: Instant scoring, clarity feedback, and missing concept identification
- **Results Dashboard**: Comprehensive performance summary after each session

## Environment Variables

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=your_google_api_key
```

Get your free API key from: [Google AI Studio](https://makersuite.google.com/app/apikey)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Google Gemini API](https://ai.google.dev/gemini-api) - learn about the AI API used in this project.
