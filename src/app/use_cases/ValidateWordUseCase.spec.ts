import { ValidateWordUseCase } from './ValidateWordUseCase';
import { WordDictionaryGateway } from '@/src/domain/ports/WordDictionaryGateway';

describe('ValidateWordUseCase', () => {
  it('rejects short words', async () => {
    const gw: WordDictionaryGateway = { isValid: async () => true };
    const uc = new ValidateWordUseCase(gw);
    const r = await uc.execute('a');
    expect(r.valid).toBe(false);
  });
  it('normalizes and validates', async () => {
    let received = '';
    const gw: WordDictionaryGateway = { isValid: async (w) => { received = w; return w === 'école'; } };
    const uc = new ValidateWordUseCase(gw);
    const r = await uc.execute('ÉCOLE');
    expect(received).toBe('école');
    expect(r.valid).toBe(true);
    expect(r.normalized).toBe('école');
  });
});
