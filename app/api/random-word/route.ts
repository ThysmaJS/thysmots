import { NextResponse } from 'next/server';
import { GetRandomWordUseCase } from '@/application/use_cases';
import { TrouveMotGateway } from '@/src/adapters/infrastructure';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const useCase = new GetRandomWordUseCase(new TrouveMotGateway());
    const word = await useCase.execute();
    return NextResponse.json(word);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch random word' }, { status: 500 });
  }
}
