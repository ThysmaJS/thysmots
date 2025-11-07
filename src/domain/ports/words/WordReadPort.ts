import type { Word } from '@/src/domain/entities/Word';

export interface DailyWordReader {
  getDailyWord(): Promise<Word>;
}

export interface RandomWordReader {
  getRandomWord(): Promise<Word>;
}

export class GetDailyWord {
  constructor(private readonly reader: DailyWordReader) {}
  async execute(): Promise<Word> { return this.reader.getDailyWord(); }
}

export class GetRandomWord {
  constructor(private readonly reader: RandomWordReader) {}
  async execute(): Promise<Word> { return this.reader.getRandomWord(); }
}
