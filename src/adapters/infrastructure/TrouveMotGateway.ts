import type { Word } from "@/src/domain/entities/Word";
import type { WordGateway } from "@/src/app/use_cases/GetDailyWordUseCase";

export class TrouveMotGateway implements WordGateway {
  constructor(private readonly baseUrl: string = "https://trouve-mot.fr/api") {}

  async getDailyWord(): Promise<Word> {
    const url = `${this.baseUrl}/daily`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`TrouveMot API error (${res.status})`);
    }
    const data = (await res.json()) as Partial<Word>;
    if (!data || typeof data.name !== "string" || typeof data.categorie !== "string") {
      throw new Error("Invalid response shape from TrouveMot API");
    }
    return { name: data.name, categorie: data.categorie };
  }
}
