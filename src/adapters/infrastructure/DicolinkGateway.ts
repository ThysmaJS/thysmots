import type { WordDictionaryGateway } from "@/src/app/use_cases/ValidateWordUseCase";

export class DicolinkGateway implements WordDictionaryGateway {
  async isValid(word: string): Promise<boolean> {
    const clean = word.normalize('NFC').toLowerCase();
    const res = await fetch(`https://fr.wiktionary.org/wiki/${encodeURIComponent(clean)}`, { method: 'HEAD' });
    return res.ok;
  }
}
