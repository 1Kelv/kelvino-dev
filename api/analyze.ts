import Anthropic from '@anthropic-ai/sdk';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
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
5. Keep responses concise and readable — use short paragraphs and bullet points
6. When analysing images, describe what you observe objectively, then give general guidance
7. Always end with a brief reminder to consult a healthcare professional

Remember: you are a helpful companion, not a doctor.`;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, fileBase64, fileMediaType, fileName } = req.body || {};

  if (!message && !fileBase64) {
    return res.status(400).json({ error: 'No message or file provided' });
  }

  const content: Anthropic.MessageParam['content'] = [];

  if (fileBase64 && fileMediaType) {
    if (fileMediaType === 'application/pdf') {
      content.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 },
        title: fileName || 'Medical document',
      } as any);
    } else if (fileMediaType.startsWith('image/')) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: fileMediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: fileBase64,
        },
      });
    }
  }

  content.push({ type: 'text', text: message || 'Please analyse this.' });

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content }],
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
