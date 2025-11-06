import { normalizeFrench } from "@/src/domain/valueObjects/Text";
import type { WordDictionaryGateway } from "@/src/app/use_cases/ValidateWordUseCase";

// Simple validation using Datamuse (supports v=fr for French)
export class DatamuseDictionaryGateway implements WordDictionaryGateway {
  private readonly base = 'https://api.datamuse.com/words';

  async isValid(word: string): Promise<boolean> {
    const q = normalizeFrench(word);
    if (!q || q.length < 2) return false;
    const url = `${this.base}?sp=${encodeURIComponent(q)}&v=fr&max=1`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return false;
    const data = (await res.json()) as Array<{ word: string }>;
    if (!Array.isArray(data) || data.length === 0) return false;
    const candidate = normalizeFrench(data[0].word || '');
    return candidate === q;
  }
}
