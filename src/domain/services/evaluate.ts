export type LetterState = 'correct' | 'present' | 'absent';

export function evaluateGuess(target: string, guess: string): LetterState[] {
  const t = [...target];
  const g = [...guess];
  const result: LetterState[] = Array(g.length).fill('absent');

  // frequency map for target letters not yet matched
  const freq = new Map<string, number>();

  // First pass: correct positions
  for (let i = 0; i < g.length; i++) {
    if (g[i] && t[i] && normalize(g[i]) === normalize(t[i])) {
      result[i] = 'correct';
    } else {
      const key = t[i] ? normalize(t[i]) : '';
      if (key) freq.set(key, (freq.get(key) || 0) + 1);
    }
  }

  // Second pass: present but misplaced
  for (let i = 0; i < g.length; i++) {
    if (result[i] === 'correct') continue;
    const key = normalize(g[i] || '');
    if (!key) continue;
    const count = freq.get(key) || 0;
    if (count > 0) {
      result[i] = 'present';
      freq.set(key, count - 1);
    }
  }

  return result;
}

function normalize(ch: string): string {
  // Case-insensitive, keep accents (French wordlists often keep diacritics)
  return ch.toLocaleLowerCase('fr');
}
