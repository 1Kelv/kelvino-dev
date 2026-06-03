import webpush from 'web-push';
import { Client, Databases, Query } from 'node-appwrite';

webpush.setVapidDetails(
  'mailto:' + (process.env.VAPID_EMAIL || 'admin@mylestone.app'),
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || '',
);

function makeAppwriteClient() {
  return new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');
}

const DB_ID = process.env.VITE_APPWRITE_DATABASE_ID || process.env.APPWRITE_DATABASE_ID || '';
const COL = {
  PUSH_SUBSCRIPTIONS: process.env.VITE_APPWRITE_COLLECTION_PUSH_SUBSCRIPTIONS || 'push_subscriptions',
  MEDICATIONS: process.env.VITE_APPWRITE_COLLECTION_MEDICATIONS || 'medications',
  APPOINTMENTS: process.env.VITE_APPWRITE_COLLECTION_APPOINTMENTS || 'appointments',
};

interface PushSub {
  $id: string;
  userId: string;
  babyId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

async function sendPush(sub: PushSub, payload: object): Promise<void> {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
    );
  } catch (err: any) {
    // 410 Gone means the subscription is expired — could clean it up, log for now
    console.error(`Push failed for ${sub.userId}:`, err?.statusCode, err?.message);
  }
}

export default async function handler(req: any, res: any) {
  // Vercel Cron sends Authorization header with CRON_SECRET
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return res.status(500).json({ error: 'VAPID keys not configured' });
  }

  const db = new Databases(makeAppwriteClient());
  const now = new Date();
  const currentHHMM = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')}`;

  // Fetch all push subscriptions (up to 200)
  const subRes = await db.listDocuments(DB_ID, COL.PUSH_SUBSCRIPTIONS, [Query.limit(200)]);
  const subs = subRes.documents as unknown as PushSub[];

  if (subs.length === 0) return res.status(200).json({ sent: 0 });

  let sent = 0;

  for (const sub of subs) {
    // --- Medication reminders ---
    try {
      const medRes = await db.listDocuments(DB_ID, COL.MEDICATIONS, [
        Query.equal('babyId', sub.babyId),
        Query.orderDesc('datetime'),
        Query.limit(200),
      ]);

      // Deduplicate: latest entry per medication name that has a reminderTime
      const seen = new Set<string>();
      for (const doc of medRes.documents as any[]) {
        if (!doc.reminderTime) continue;
        if (seen.has(doc.medicationName)) continue;
        seen.add(doc.medicationName);
        if (doc.reminderTime === currentHHMM) {
          await sendPush(sub, {
            title: `💊 Time for ${doc.medicationName}`,
            body: `${doc.dose} ${doc.unit} · ${doc.route}`,
            tag: `med-${doc.medicationName}`,
            url: '/app/medications',
          });
          sent++;
        }
      }
    } catch (err) {
      console.error('Medication reminder check failed:', err);
    }

    // --- Appointment reminders (24h and 1h before) ---
    try {
      const apptRes = await db.listDocuments(DB_ID, COL.APPOINTMENTS, [
        Query.equal('babyId', sub.babyId),
        Query.isNull('status'),
        Query.limit(50),
      ]);

      for (const doc of apptRes.documents as any[]) {
        const apptTime = new Date(doc.datetime).getTime();
        const diffMs = apptTime - now.getTime();
        const diffMins = diffMs / 60_000;

        // Within 1h window (55–65 mins) or 24h window (23h55m–24h5m)
        const in1h = diffMins >= 55 && diffMins < 65;
        const in24h = diffMins >= 1435 && diffMins < 1445;

        if (in1h || in24h) {
          const timeLabel = in1h ? 'in 1 hour' : 'tomorrow';
          await sendPush(sub, {
            title: `📅 Appointment reminder`,
            body: `${doc.hospitalName} — ${doc.department} ${timeLabel}`,
            tag: `appt-${doc.$id}-${in1h ? '1h' : '24h'}`,
            url: '/app/appointments',
          });
          sent++;
        }
      }
    } catch (err) {
      console.error('Appointment reminder check failed:', err);
    }
  }

  res.status(200).json({ sent, checked: subs.length });
}
