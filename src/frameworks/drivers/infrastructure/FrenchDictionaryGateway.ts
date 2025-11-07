import type { WordDictionaryGateway } from "@/src/domain/ports/WordDictionaryGateway";

export class FrenchDictionaryGateway implements WordDictionaryGateway {
  private cache = new Map<string, { valid: boolean; expires: number }>();
  private ttlMs: number;
  private useDictApiFallback: boolean;

  constructor(
    private readonly dictApiBase: string = "https://api.dictionaryapi.dev/api/v2/entries",
    private readonly wiktionaryBase: string = "https://fr.wiktionary.org/wiki",
    opts?: { ttlMs?: number; fallbackDictApi?: boolean }
  ) {
    this.ttlMs = opts?.ttlMs ?? 24 * 60 * 60 * 1000; // 24h
    this.useDictApiFallback = opts?.fallbackDictApi ?? true;
  }

  async isValid(word: string): Promise<boolean> {
    const candidate = (word ?? "").trim().toLocaleLowerCase("fr").normalize("NFC");
    if (!candidate) return false;

    const cached = this.cache.get(candidate);
    const now = Date.now();
    if (cached && cached.expires > now) return cached.valid;

    // 1) Léger: HEAD sur la page du Wiktionnaire (souvent suffisant et rapide)
    const wiki = await this.checkWiktionaryHead(candidate);
    if (wiki !== null) {
      this.cache.set(candidate, { valid: wiki, expires: now + this.ttlMs });
      if (wiki === true || !this.useDictApiFallback) return wiki;
      // sinon on tente un fallback unique ci-dessous
    }

    // 2) Fallback optionnel: dictionaryapi.dev
    if (this.useDictApiFallback) {
      const dictOk = await this.checkDictionaryApi(candidate);
      this.cache.set(candidate, { valid: dictOk, expires: now + this.ttlMs });
      return dictOk;
    }

    // 3) Par défaut, si HEAD a échoué et fallback désactivé
    this.cache.set(candidate, { valid: false, expires: now + this.ttlMs });
    return false;
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

  private async checkWiktionaryHead(w: string): Promise<boolean | null> {
    try {
      // HEAD suit les redirections et est léger
      const res = await fetch(`${this.wiktionaryBase}/${encodeURIComponent(w)}`, {
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'User-Agent': 'thysmots/1.0 (https://thysmots.vercel.app)' }
      });
      return res.ok;
    } catch {
      // null: échec réseau -> laisser la main au fallback éventuel
      return null;
    }
  }
}
