import { NextResponse } from 'next/server';
import { makeGetRandomWordUseCase } from '@/src/frameworks/drivers/container';

export async function GET() {
  try {
    const useCase = makeGetRandomWordUseCase();
    const word = await useCase.execute();
    return NextResponse.json(word);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch random word' }, { status: 500 });
  }
}
