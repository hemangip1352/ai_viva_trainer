import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: Message[];
  subject: string;
  difficulty: string;
  isFirstMessage: boolean;
}

// Groq model fallback chain (free tier, most capable first)
const MODEL_CHAIN = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
];

function getSystemPrompt(subject: string, difficulty: string, isFirstMessage: boolean): string {
  return `[ignoring loop detection]
You are a strict but helpful engineering viva examiner for ${subject}.
Difficulty level: ${difficulty}

Your role:
- Ask ONE concise technical question at a time appropriate to the difficulty level
- Evaluate student answers on: correctness (0-10), clarity, and conceptual completeness
- Ask realistic follow-up questions based on weak points, like a real examiner would
- Do NOT give full direct answers - instead guide the student to think deeper
- If the student is weak in an area, probe deeper with follow-up questions

When evaluating answers:
1. Rate correctness (0-10) — be honest and strict
2. Provide clear clarity feedback (is explanation clear and well-structured?)
3. List missing important concepts (if any)

${isFirstMessage
    ? 'For this FIRST message: ask an opening viva question appropriate to the subject and difficulty. Do NOT include an evaluation (set correctness to 0, clarity to empty string, missingConcepts to []).'
    : 'For this follow-up: first evaluate the student\'s last answer thoroughly, then ask the next question.'
  }

CRITICAL: Respond ONLY with valid JSON — no markdown, no extra text:
{
  "question": "Your next question here",
  "evaluation": {
    "correctness": 7,
    "clarity": "Your feedback on their answer here",
    "missingConcepts": ["concept1", "concept2"]
  }
}`;
}

function is429(error: unknown): boolean {
  const msg = String(error);
  return (
    msg.includes('429') ||
    msg.includes('Too Many Requests') ||
    msg.includes('rate_limit_exceeded') ||
    msg.includes('Rate limit') ||
    // Groq SDK surfaces this
    (error instanceof Error && (error as { status?: number }).status === 429)
  );
}

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json();
  const { messages, subject, difficulty, isFirstMessage } = body;

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      {
        error: 'configuration_error',
        message: 'GROQ_API_KEY is not configured. Add it to your .env file.',
      },
      { status: 500 }
    );
  }

  const systemPrompt = getSystemPrompt(subject, difficulty, isFirstMessage);

  // Build Groq-compatible message history (OpenAI format)
  const chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = messages.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));

  let lastError: unknown = null;

  for (const modelName of MODEL_CHAIN) {
    try {
      const completion = await groq.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory,
          // For the initial message, send a trigger prompt
          ...(isFirstMessage
            ? [{ role: 'user' as const, content: 'Please start the viva examination.' }]
            : []),
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });

      const responseText = completion.choices[0]?.message?.content ?? '';
      console.log(`✓ [${modelName}] responded successfully`);

      // Parse JSON response
      let parsedResponse;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        parsedResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch {
        parsedResponse = null;
      }

      // Ensure we always have a valid structure
      if (!parsedResponse?.question) {
        parsedResponse = {
          question: responseText.trim() || 'Could you elaborate on your understanding of the topic?',
          evaluation: isFirstMessage
            ? null
            : { correctness: 5, clarity: 'Response could not be parsed.', missingConcepts: [] },
        };
      }

      // For first message, evaluation is not meaningful
      if (isFirstMessage) {
        parsedResponse.evaluation = null;
      }

      return NextResponse.json(parsedResponse);
    } catch (error) {
      lastError = error;

      if (is429(error)) {
        console.warn(`✗ [${modelName}] rate-limited — trying next model...`);
        continue;
      }

      console.warn(`✗ [${modelName}] error: ${String(error).slice(0, 150)}`);
      continue; // always try next model
    }
  }

  // All models rate-limited or failed
  console.error('All Groq models exhausted. Last error:', String(lastError).slice(0, 200));

  if (is429(lastError)) {
    return NextResponse.json(
      {
        error: 'rate_limit',
        message:
          "You've reached the daily API limit for today. Groq's free tier resets every 24 hours. Please try again tomorrow! 🌙",
      },
      { status: 429 }
    );
  }

  return NextResponse.json(
    {
      error: 'service_unavailable',
      message: 'The AI service is temporarily unavailable. Please try again in a few minutes.',
    },
    { status: 503 }
  );
}
