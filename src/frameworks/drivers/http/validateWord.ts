import { NextResponse, NextRequest } from 'next/server';
import { makeValidateWordUseCase } from '@/src/frameworks/drivers/container';

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();
    if (typeof word !== 'string') {
      return NextResponse.json({ valid: false, error: 'Invalid payload' }, { status: 400 });
    }
    const useCase = makeValidateWordUseCase();
    const result = await useCase.execute(word);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ valid: false, normalized: '' }, { status: 200 });
  }
}
