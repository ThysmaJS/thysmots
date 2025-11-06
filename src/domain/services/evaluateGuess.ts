import { LetterState } from "@/src/domain/entities/LetterState";

export function normalizeWord(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z]/g, '');
}

export function evaluateGuess(guessRaw: string, targetRaw: string): LetterState[] {
  const guess = normalizeWord(guessRaw);
  const target = normalizeWord(targetRaw);

  const len = target.length;
  const states: LetterState[] = Array(len).fill(LetterState.Absent);

  // Count letters in target
  const counts: Record<string, number> = {};
  for (let i = 0; i < len; i++) {
    const t = target[i];
    counts[t] = (counts[t] ?? 0) + 1;
  }

  // First pass: correct
  for (let i = 0; i < len; i++) {
    if (guess[i] === target[i]) {
      states[i] = LetterState.Correct;
      counts[guess[i]]!--;
    }
  }

  // Second pass: present
  for (let i = 0; i < len; i++) {
    if (states[i] === LetterState.Correct) continue;
    const g = guess[i];
    if (g && counts[g] > 0) {
      states[i] = LetterState.Present;
      counts[g]!--;
    }
  }

  return states;
}
