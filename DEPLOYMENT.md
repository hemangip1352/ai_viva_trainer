# AI Viva Trainer - Deployment Guide

## Overview
AI Viva Trainer is a modern web application that helps engineering students prepare for technical viva exams by practicing with an AI examiner powered by Google Generative AI (Gemini).

## Features Implemented

### 1. Landing Page (`/`)
- Clean, professional title: "AI Viva Trainer"
- Compelling subtitle explaining the app's purpose
- Three feature cards highlighting key capabilities
- "Start Viva" button to begin the session

### 2. Setup Page (`/setup`)
- Subject selection dropdown with 5 options:
  - DBMS (Database Management Systems)
  - OOP (Object-Oriented Programming)
  - Operating Systems
  - Computer Networks
  - Java
- Difficulty level selector (Easy, Medium, Hard)
- Interactive buttons for difficulty selection
- Start button to begin the viva session

### 3. Viva Chat Interface (`/viva`)
- Real-time chat interface with:
  - AI questions displayed with proper formatting
  - User answer input field
  - Send button with loading state
  - Message history scrolling
- Score display showing:
  - Correctness score (0-10)
  - Clarity feedback
  - Missing concepts identified
- "End Interview" button to finish the session

### 4. Results Page (`/results`)
- Comprehensive summary including:
  - Overall score calculation
  - Strengths identified
  - Areas for improvement
  - Improvement suggestions
  - Statistics (interactions, average score, highest/lowest)
- Action buttons to restart or go home

### 5. API Route (`/api/viva`)
- Handles communication with Google Gemini API
- Processes conversation history
- Returns evaluated answers with:
  - Next question
  - Correctness score
  - Clarity assessment
  - Missing concepts

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **State Management**: React Context (VivaProvider)
- **AI**: Google Generative AI (Gemini Pro model)
- **Styling**: Dark mode with professional color scheme
- **Type Safety**: TypeScript

## Environment Variables

Required for deployment:
```
GEMINI_API_KEY=your_google_gemini_api_key
```

Get your API key from: https://makersuite.google.com/app/apikey

## Deployment Instructions

### To Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the `GEMINI_API_KEY` environment variable in Vercel project settings
4. Deploy automatically

### Local Development

```bash
# Install dependencies
pnpm install

# Set environment variable
export GEMINI_API_KEY=your_api_key

# Run dev server
pnpm dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build the app
pnpm build

# Start production server
pnpm start
```

## Component Architecture

### Context & State
- **VivaProvider**: Manages session state globally
  - Session data (subject, difficulty)
  - Messages history
  - Scores tracking
  - Helper functions for summaries

### Components
- **ChatInterface**: Main viva chat UI
- **MessageList**: Displays messages with auto-scroll
- **ScoreDisplay**: Shows evaluation feedback
- **TypingIndicator**: Loading state animation

### Pages
- **page.tsx**: Landing page
- **setup/page.tsx**: Configuration page
- **viva/page.tsx**: Chat interface with initial question loading
- **results/page.tsx**: Results and summary

## Design System

### Colors (Dark Mode)
- Background: Dark navy (#1c1c2e)
- Primary: Professional blue (#a78bfa)
- Secondary: Light gray accents
- Foreground: Clean white text
- Card backgrounds: Slightly lighter than main background

### Typography
- Headings: Geist Sans (bold)
- Body: Geist Sans (regular)
- Responsive text scaling for mobile

### Layout
- Mobile-first responsive design
- Max-width containers for better readability
- Flexbox for alignment
- Proper spacing and visual hierarchy

## Features & Behavior

### AI Examiner Behavior
The AI examiner:
- Asks one concise question at a time
- Evaluates answers on correctness, clarity, and completeness
- Provides follow-up questions based on weak areas
- Guides students rather than giving direct answers
- Adjusts difficulty based on student selection

### User Flow
1. Start → Select Subject & Difficulty
2. Begin Viva → AI asks initial question
3. Answer & Submit → Receive evaluation
4. Continue with follow-up questions
5. End Interview → View comprehensive results

## Performance Notes

- Client-side React components for fast interactions
- Server-side API calls for Gemini processing
- Streaming disabled for response stability
- Optimized re-renders with React Context
- CSS-in-JS via Tailwind for minimal overhead

## Security

- No authentication required (as specified)
- No database (stateless)
- API key stored securely in environment variables
- Session data stored only in browser memory
- No persistent data storage

## Future Enhancement Ideas

1. User accounts for progress tracking
2. Multiple language support
3. More subjects/topics
4. Performance analytics
5. Mobile app version
6. Offline mode
7. Interview recordings/transcripts
8. Peer comparison (anonymized)

## Troubleshooting

### "GEMINI_API_KEY is not set"
- Ensure the environment variable is configured in your Vercel project settings
- For local development, set it in `.env.local`

### No initial question appears
- Check browser console for API errors
- Verify GEMINI_API_KEY is valid
- Ensure Gemini API is enabled in your Google Cloud project

### Styling issues
- Clear browser cache
- Verify Tailwind CSS is compiling (`pnpm build`)
- Check that globals.css is properly imported

## Support

For issues or questions:
1. Check the console logs in browser DevTools
2. Verify all environment variables are set
3. Test the API endpoint directly with curl
4. Review the generated console logs in development

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-14  
**AI Viva Trainer**
