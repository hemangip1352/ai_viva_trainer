import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

function getSystemPrompt(subject: string, difficulty: string, isFirstMessage: boolean): string {
  return `You are a strict but helpful engineering viva examiner for ${subject}.
Difficulty level: ${difficulty}

Your role:
- Ask ONE concise technical question at a time appropriate to the difficulty level
- Evaluate student answers on: correctness (0-10), clarity, and conceptual completeness
- Ask realistic follow-up questions based on weak points, like an examiner would
- Do NOT give full direct answers - instead guide the student to think deeper
- If the student is weak in an area, probe deeper with follow-up questions

When evaluating answers:
1. Rate correctness (0-10)
2. Provide clarity feedback (is explanation clear and well-structured?)
3. List missing important concepts (if any)

${isFirstMessage ? 'For this first message, ask an initial viva question appropriate to the subject and difficulty level.' : ''}

IMPORTANT: Always respond with this JSON format:
{
  "question": "Your follow-up question (or initial question if first message)",
  "evaluation": {
    "correctness": 7,
    "clarity": "explanation of clarity here",
    "missingConcepts": ["concept1", "concept2"]
  }
}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { messages, subject, difficulty, isFirstMessage } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      }
    });

    // Build conversation history
    const conversationHistory = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Create the system message
    const systemPrompt = getSystemPrompt(subject, difficulty, isFirstMessage);

    // Start chat session
    const chat = model.startChat({
      history: conversationHistory,
    });

    // Send the prompt
    const result = await chat.sendMessage(systemPrompt);
    const responseText = result.response.text();

    // Parse JSON response
    let parsedResponse;
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if JSON parsing fails
        parsedResponse = {
          question: responseText,
          evaluation: {
            correctness: 5,
            clarity: 'Could not evaluate properly',
            missingConcepts: [],
          },
        };
      }
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      parsedResponse = {
        question: responseText,
        evaluation: {
          correctness: 5,
          clarity: 'Could not parse evaluation',
          missingConcepts: [],
        },
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
}
