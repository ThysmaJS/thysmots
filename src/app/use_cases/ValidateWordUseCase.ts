import { WordDictionaryGateway } from '@/src/domain/ports/WordDictionaryGateway';

export class ValidateWordUseCase {
  constructor(private readonly gateway: WordDictionaryGateway) {}
  async execute(raw: string): Promise<{ valid: boolean; normalized: string }> {
    const normalized = this.normalize(raw);
    if (!this.isEligible(normalized)) return { valid: false, normalized };
    const ok = await this.gateway.isValid(normalized);
    return { valid: ok, normalized };
  }
  private normalize(w: string): string { return (w ?? '').trim().toLocaleLowerCase('fr').normalize('NFC'); }
  private isEligible(w: string): boolean { return /^[a-zA-ZÀ-ÖØ-öø-ÿœŒ'’-]{2,}$/u.test(w); }
}
