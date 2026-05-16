import Anthropic from '@anthropic-ai/sdk';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

const SYSTEM_PROMPT = `You are Mylo — Mylestone's AI Health Companion, a warm, knowledgeable assistant for parents and carers tracking their baby's health journey.

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

  const { message, fileBase64, fileMediaType, fileName, files, history } = req.body || {};

  if (!message && !fileBase64 && (!files || files.length === 0)) {
    return res.status(400).json({ error: 'No message or file provided' });
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
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        ...historyMessages,
        { role: 'user', content: currentContent },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    res.status(200).json({ response: text });
  } catch (err: any) {
    console.error('Claude API error:', err);
    res.status(500).json({ error: err?.message || 'Failed to get AI response' });
  }
}
