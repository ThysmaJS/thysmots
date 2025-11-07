import { NextResponse } from 'next/server';
import { makeListLeaderboardUseCase, makeSubmitScoreUseCase } from '@/src/frameworks/drivers/container';

export async function getLeaderboard() {
  try {
    const useCase = makeListLeaderboardUseCase();
    const items = await useCase.execute(10);
    return NextResponse.json({ items }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to load leaderboard' }, { status: 500 });
  }
}

export async function postLeaderboard(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; score?: unknown };
    const name = typeof body.name === 'string' ? body.name : '';
    const score = typeof body.score === 'number' ? body.score : NaN;
    if (!name || !Number.isFinite(score)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const useCase = makeSubmitScoreUseCase();
    await useCase.execute(name, score);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to save score' }, { status: 500 });
  }
}
