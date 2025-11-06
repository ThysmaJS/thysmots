export type LetterState = 'correct' | 'present' | 'absent';

export function stripAccents(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae');
}

export function judgeGuess(answerRaw: string, guessRaw: string): LetterState[] {
  const answer = stripAccents(answerRaw.toLowerCase());
  const guess = stripAccents(guessRaw.toLowerCase());
  const n = answer.length;
  const states: LetterState[] = Array(n).fill('absent');

  const counts: Record<string, number> = {};

  for (let i = 0; i < n; i++) {
    const a = answer[i];
    if (guess[i] === a) {
      states[i] = 'correct';
    } else {
      counts[a] = (counts[a] ?? 0) + 1;
    }
  }

  for (let i = 0; i < n; i++) {
    if (states[i] === 'correct') continue;
    const g = guess[i];
    if (counts[g] > 0) {
      states[i] = 'present';
      counts[g]!--;
    } else {
      states[i] = 'absent';
    }
  }

  return states;
}
