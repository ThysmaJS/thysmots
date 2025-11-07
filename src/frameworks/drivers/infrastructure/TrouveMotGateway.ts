import type { Word } from "@/src/domain/entities/Word";
import type { WordGateway as DailyWordGateway } from "@/app/use_cases/GetDailyWordUseCase";
import type { RandomWordGateway } from "@/app/use_cases";

export class TrouveMotGateway implements DailyWordGateway, RandomWordGateway {
  constructor(private readonly baseUrl: string = "https://trouve-mot.fr/api") {}

  async getDailyWord(): Promise<Word> {
    const url = `${this.baseUrl}/daily`;
    const res = await fetch(url, { next: { revalidate: 3600 }, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`TrouveMot API error (${res.status})`);
    const data = await this.safeParseJson(res);
    const obj = Array.isArray(data) ? data[0] : data;
    if (!obj || typeof obj.name !== "string") throw new Error("Invalid response shape from TrouveMot API");
    const categorie = typeof obj.categorie === 'string' ? obj.categorie : 'Inconnue';
    return { name: obj.name, categorie };
  }
  async getRandomWord(): Promise<Word> {
    const url = `${this.baseUrl}/random`;
    const res = await fetch(url, { cache: "no-store", headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`TrouveMot API error (${res.status})`);
    const data = await this.safeParseJson(res);
    const obj = Array.isArray(data) ? data[0] : data;
    if (!obj || typeof obj.name !== "string") throw new Error("Invalid response shape from TrouveMot API");
    const categorie = typeof obj.categorie === 'string' ? obj.categorie : 'Inconnue';
    return { name: obj.name, categorie };
  }
  private async safeParseJson(res: Response): Promise<any> {
    try { return await res.json(); } catch {
      const text = await res.text();
      const trimmed = text.trim();
      const aStart = trimmed.indexOf('['); const aEnd = trimmed.lastIndexOf(']');
      const oStart = trimmed.indexOf('{'); const oEnd = trimmed.lastIndexOf('}');
      const candidates: string[] = [];
      if (aStart !== -1 && aEnd !== -1 && aEnd > aStart) candidates.push(trimmed.slice(aStart, aEnd + 1));
      if (oStart !== -1 && oEnd !== -1 && oEnd > oStart) candidates.push(trimmed.slice(oStart, oEnd + 1));
      for (const c of candidates) { try { return JSON.parse(c); } catch {} }
      throw new Error('Invalid JSON from TrouveMot API');
    }
  }
}
