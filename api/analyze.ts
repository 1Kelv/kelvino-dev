import Anthropic from '@anthropic-ai/sdk';
import { Client, Databases, Query, ID } from 'node-appwrite';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

const DAILY_MESSAGE_LIMIT = 20;

const USAGE_COLLECTION = process.env.APPWRITE_COLLECTION_AI_USAGE || 'ai_usage';
const DB_ID = process.env.VITE_APPWRITE_DATABASE_ID || process.env.APPWRITE_DATABASE_ID || '';

function makeAppwriteClient() {
  return new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');
}

interface UsageResult {
  allowed: boolean;
  remaining: number | null;
}

// Checks and increments the user's daily Mylo message count.
// Fails open: if the usage collection or API key is missing, Mylo keeps working.
async function checkAndIncrementUsage(userId?: string): Promise<UsageResult> {
  if (!userId || !process.env.APPWRITE_API_KEY || !DB_ID) {
    return { allowed: true, remaining: null };
  }
  try {
    const databases = new Databases(makeAppwriteClient());
    const today = new Date().toISOString().slice(0, 10);
    const existing = await databases.listDocuments(DB_ID, USAGE_COLLECTION, [
      Query.equal('userId', userId),
      Query.equal('date', today),
      Query.limit(1),
    ]);

    if (existing.documents.length > 0) {
      const doc = existing.documents[0] as any;
      if (doc.count >= DAILY_MESSAGE_LIMIT) {
        return { allowed: false, remaining: 0 };
      }
      await databases.updateDocument(DB_ID, USAGE_COLLECTION, doc.$id, { count: doc.count + 1 });
      return { allowed: true, remaining: DAILY_MESSAGE_LIMIT - doc.count - 1 };
    }

    await databases.createDocument(DB_ID, USAGE_COLLECTION, ID.unique(), {
      userId,
      date: today,
      count: 1,
    });
    return { allowed: true, remaining: DAILY_MESSAGE_LIMIT - 1 };
  } catch (err) {
    console.error('Usage check failed (failing open):', err);
    return { allowed: true, remaining: null };
  }
}

const BASE_SYSTEM_PROMPT = `You are Mylo — Mylestone's AI Health Companion, a warm, knowledgeable assistant for parents and carers tracking their baby's health journey.

You help parents by:
- Analysing photos of symptoms (rashes, skin changes, eye discharge, etc.) and describing what you observe
- Summarising medical documents (discharge letters, specialist reports, prescriptions) in plain, parent-friendly English
- Answering questions about baby health, development milestones, feeding, and general wellbeing

IMPORTANT RULES:
1. NEVER provide a definitive medical diagnosis — always make this clear
2. Always recommend consulting a doctor, GP, midwife, paediatrician, or A&E for any medical concern
3. If something appears serious or urgent, say so clearly and advise seeking IMMEDIATE medical help
4. Be empathetic, calm, and reassuring — parents are often anxious
5. Keep responses concise and readable
6. When analysing images, describe what you observe objectively, then give general guidance
7. Always end with a brief reminder to consult a healthcare professional

FORMATTING RULES — always follow these:
- Use **bold** for key terms, medication names, or anything important
- Use bullet points (- item) for lists of symptoms, steps, or options
- Use short paragraphs with a blank line between them
- Never write a wall of text — break it up
- Use markdown formatting throughout your response

Remember: you are a helpful companion, not a doctor.`;

interface BabyContext {
  name: string;
  age: string;
  gender?: string;
  diagnosis?: string;
}

function buildSystemPrompt(babyContext?: BabyContext, userName?: string, recentTopics?: string[]): string {
  let prompt = BASE_SYSTEM_PROMPT;

  if (userName) {
    prompt += `\n\nPARENT/CARER: You are speaking with ${userName}. Use their name occasionally to make the conversation feel warm and personal — but don't overdo it.`;
  }

  if (babyContext) {
    prompt += `\n\nBABY PROFILE — always use this context in every response:
- Name: ${babyContext.name}
- Age: ${babyContext.age}${babyContext.gender ? `\n- Gender: ${babyContext.gender}` : ''}${babyContext.diagnosis ? `\n- Known diagnosis / medical conditions: ${babyContext.diagnosis}` : ''}

Always refer to the baby as ${babyContext.name} (never "the baby" or "your baby" when the name is known). Tailor all advice to their age and, where relevant, their known medical conditions.`;
  }

  if (recentTopics && recentTopics.length > 0) {
    prompt += `\n\nRECENT CONVERSATION TOPICS (for continuity — reference only if relevant):
${recentTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}`;
  }

  return prompt;
}

interface FilePayload {
  fileBase64: string;
  fileMediaType: string;
  fileName?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ error: 'AI service is not configured. Please contact support.' });
  }

  const { message, fileBase64, fileMediaType, fileName, files, history, babyContext, userName, recentTopics, userId } = req.body || {};

  if (!message && !fileBase64 && (!files || files.length === 0)) {
    return res.status(400).json({ error: 'No message or file provided' });
  }

  const usage = await checkAndIncrementUsage(userId);
  if (!usage.allowed) {
    return res.status(429).json({
      error: `You've reached today's limit of ${DAILY_MESSAGE_LIMIT} Mylo messages. Your limit resets at midnight — see you tomorrow! 💙`,
      limitReached: true,
    });
  }

  // Normalise to an array — support both legacy single-file and new multi-file formats
  const fileList: FilePayload[] = files && Array.isArray(files)
    ? files
    : fileBase64 && fileMediaType
      ? [{ fileBase64, fileMediaType, fileName }]
      : [];

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const historyMessages: Anthropic.MessageParam[] = (history || []).map((h: { role: string; text: string }) => ({
    role: h.role as 'user' | 'assistant',
    content: h.text,
  }));

  const currentContent: Anthropic.MessageParam['content'] = [];

  for (const f of fileList) {
    if (!f.fileBase64 || !f.fileMediaType) continue;
    if (f.fileMediaType === 'application/pdf') {
      currentContent.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: f.fileBase64 },
        title: f.fileName || 'Medical document',
      } as any);
    } else if (f.fileMediaType.startsWith('image/')) {
      currentContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: f.fileMediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: f.fileBase64,
        },
      });
    }
  }

  currentContent.push({ type: 'text', text: message || 'Please analyse this.' });

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 2048,
      system: buildSystemPrompt(babyContext, userName, recentTopics),
      messages: [
        ...historyMessages,
        { role: 'user', content: currentContent },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    res.status(200).json({ response: text, remaining: usage.remaining });
  } catch (err: any) {
    console.error('Claude API error:', err);

    const status = err?.status ?? err?.statusCode ?? 500;

    if (status === 529 || err?.error?.type === 'overloaded_error') {
      return res.status(503).json({
        error: "Mylo is a little busy right now — Anthropic's servers are under high demand. Please try again in a moment.",
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error: "Mylo has hit a rate limit. Please wait a few seconds and try again.",
      });
    }

    res.status(500).json({ error: 'Sorry, Mylo couldn\'t respond right now. Please try again.' });
  }
}
