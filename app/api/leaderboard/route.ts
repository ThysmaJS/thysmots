import { NextResponse } from 'next/server';
import { getDb } from '@/src/lib/mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Body = { name?: string; score?: unknown };

function sanitizeName(name: string): string {
  return name.replace(/\s+/g, ' ').trim().slice(0, 24);
}

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection('leaderboard')
      .find({}, { projection: { _id: 0, name: 1, score: 1, createdAt: 1 } })
      .sort({ score: -1, createdAt: -1 })
      .limit(10)
      .toArray();

    const items = docs.map((d: any) => ({
      name: d.name as string,
      score: Number(d.score) || 0,
      date: new Date(d.createdAt).toISOString(),
    }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (e: any) {
    console.error('[GET /api/leaderboard] error:', e);
    return NextResponse.json({ error: e?.message || 'Failed to load leaderboard' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const rawName = typeof body.name === 'string' ? body.name : '';
    const name = sanitizeName(rawName);
    const score = typeof body.score === 'number' ? Math.max(0, Math.floor(body.score)) : NaN;
    if (!name || !Number.isFinite(score)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const db = await getDb();
    await db.collection('leaderboard').insertOne({ name, score, createdAt: new Date() });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    console.error('[POST /api/leaderboard] error:', e);
    return NextResponse.json({ error: e?.message || 'Failed to save score' }, { status: 500 });
  }
}
