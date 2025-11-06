import type { WordDictionaryGateway } from "@/src/app/use_cases/ValidateWordUseCase";

// Utilise https://api.dictionaryapi.dev/api/v2/entries/fr/<word>
export class DictionaryApiGateway implements WordDictionaryGateway {
  private readonly baseUrl = "https://api.dictionaryapi.dev/api/v2/entries";

  async isValid(word: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/fr/${encodeURIComponent(word)}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.status === 404) return false;
      if (!res.ok) return false;
      const data = await res.json();
      return Array.isArray(data) && data.length > 0;
    } catch {
      return false;
    }
  }
}
