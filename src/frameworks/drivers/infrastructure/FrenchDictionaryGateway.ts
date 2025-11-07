import type { WordDictionaryGateway } from "@/src/domain/ports/WordDictionaryGateway";

export class FrenchDictionaryGateway implements WordDictionaryGateway {
  constructor(
    private readonly dictApiBase: string = "https://api.dictionaryapi.dev/api/v2/entries",
    private readonly wiktionaryApi: string = "https://fr.wiktionary.org/w/api.php"
  ) {}

  async isValid(word: string): Promise<boolean> {
    const candidate = (word ?? "").trim().toLocaleLowerCase("fr").normalize("NFC");
    if (!candidate) return false;
    const dictOk = await this.checkDictionaryApi(candidate);
    if (dictOk) return true;
    const wikiOk = await this.checkWiktionary(candidate);
    return wikiOk;
  }
  private async checkDictionaryApi(w: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.dictApiBase}/fr/${encodeURIComponent(w)}`, { cache: 'no-store' });
      if (res.status === 200) return true;
      if (res.status === 404) return false;
      return false;
    } catch {
      return false;
    }
  }
  private async checkWiktionary(w: string): Promise<boolean> {
    try {
      const url = new URL(this.wiktionaryApi);
      url.searchParams.set("action", "query");
      url.searchParams.set("format", "json");
      url.searchParams.set("origin", "*");
      url.searchParams.set("redirects", "1");
      url.searchParams.set("titles", w);
      const res = await fetch(url.toString(), {
        cache: 'no-store',
        headers: { 'User-Agent': 'thysmots/1.0 (https://thysmots.vercel.app)' }
      });
      if (!res.ok) return false;
      const data = await res.json() as any;
      const pages = data?.query?.pages;
      if (!pages || typeof pages !== 'object') return false;
      for (const id of Object.keys(pages)) {
        const page = pages[id];
        if (page && !("missing" in page)) return true;
      }
      const head = await fetch(`https://fr.wiktionary.org/wiki/${encodeURIComponent(w)}`, {
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'User-Agent': 'thysmots/1.0 (https://thysmots.vercel.app)' }
      });
      return head.ok;
    } catch {
      return false;
    }
  }
}
