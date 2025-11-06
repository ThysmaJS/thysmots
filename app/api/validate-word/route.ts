import { NextRequest, NextResponse } from 'next/server';
import { ValidateWordUseCase } from '@/src/app/use_cases/ValidateWordUseCase';
import { FrenchDictionaryGateway } from '@/src/adapters/infrastructure';

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();
    if (typeof word !== 'string') {
      return NextResponse.json({ valid: false, error: 'Invalid payload' }, { status: 400 });
    }
    const useCase = new ValidateWordUseCase(new FrenchDictionaryGateway());
    const result = await useCase.execute(word);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ valid: false, normalized: '' }, { status: 200 });
  }
}
