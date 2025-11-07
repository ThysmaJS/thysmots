import type { Word } from "@/src/domain/entities/Word";

export interface RandomWordGateway { getRandomWord(): Promise<Word>; }

export class GetRandomWordUseCase {
  constructor(private readonly gateway: RandomWordGateway) {}
  async execute(): Promise<Word> { return this.gateway.getRandomWord(); }
}
