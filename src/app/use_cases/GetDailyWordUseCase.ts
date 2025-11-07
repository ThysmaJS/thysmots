import type { Word } from "@/src/domain/entities/Word";

export interface WordGateway {
  getDailyWord(): Promise<Word>;
}

export class GetDailyWordUseCase {
  constructor(private readonly gateway: WordGateway) {}
  async execute(): Promise<Word> { return this.gateway.getDailyWord(); }
}
