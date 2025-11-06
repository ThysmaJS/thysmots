import type { Word } from "@/src/domain/entities/Word";
import type { WordGateway } from "./GetDailyWordUseCase";

export type LetterState = "correct" | "present" | "absent";

export interface CompareResult {
  states: LetterState[];
  success: boolean;
}

export class CompareGuessUseCase {
  constructor(private readonly gateway: WordGateway) {}

  async execute(guess: string): Promise<CompareResult> {
    const { name } = await this.gateway.getDailyWord();
    const target = name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    const g = guess.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

    const len = target.length;
    const states: LetterState[] = Array.from({ length: len }, () => "absent");

    const tCounts: Record<string, number> = {};
    for (let i = 0; i < len; i++) {
      const t = target[i];
      tCounts[t] = (tCounts[t] ?? 0) + 1;
    }

    // First pass: correct positions
    for (let i = 0; i < len; i++) {
      if (g[i] && g[i] === target[i]) {
        states[i] = "correct";
        tCounts[target[i]]!--;
      }
    }

    // Second pass: present but misplaced
    for (let i = 0; i < len; i++) {
      if (states[i] === "correct") continue;
      const ch = g[i];
      if (ch && tCounts[ch] > 0) {
        states[i] = "present";
        tCounts[ch]!--;
      }
    }

    const success = states.every((s) => s === "correct");
    return { states, success };
  }
}
