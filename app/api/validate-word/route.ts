import { NextRequest, NextResponse } from 'next/server';
import { ValidateWordUseCase } from '@/application/use_cases/ValidateWordUseCase';
import { FrenchDictionaryGateway } from '@/src/frameworks/drivers/infrastructure';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();
    if (typeof word !== 'string') {
      return NextResponse.json({ valid: false, error: 'Invalid payload' }, { status: 400 });
    }
    const useCase = new ValidateWordUseCase(new FrenchDictionaryGateway());
    const result = await useCase.execute(word);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error('[POST /api/validate-word] error:', e);
    return NextResponse.json({ valid: false, normalized: '' }, { status: 200 });
  }
}
