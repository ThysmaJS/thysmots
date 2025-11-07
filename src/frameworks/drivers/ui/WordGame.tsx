'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { evaluateGuess, type LetterState } from '@/src/domain/services/evaluate';
import GameGrid from '@/src/frameworks/drivers/ui/GameGrid';
import Keyboard from '@/src/frameworks/drivers/ui/Keyboard';

export default function WordGame({ target, onEnd }: { target: string; onEnd?: (result: 'win' | 'lose') => void }) {
  const wordLength = useMemo(() => [...target].length, [target]);
  const maxRows = 6;
  const [guesses, setGuesses] = useState<string[]>([]);
  const [rows, setRows] = useState<LetterState[][]>([]);
  const [current, setCurrent] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const showMessage = (m: string) => {
    setMessage(m);
    setTimeout(() => setMessage(null), 1500);
  };

  const onType = useCallback((ch: string) => {
    if (done) return;
    const c = ch.toUpperCase();
    if (!/^[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸÆŒ]$/i.test(c)) return;
    if ([...current].length >= wordLength) return;
    setCurrent((s) => s + c);
  }, [current, wordLength, done]);

  const onBackspace = useCallback(() => {
    if (done) return;
    setCurrent((s) => s.slice(0, -1));
  }, [done]);

  const validateWord = async (word: string) => {
    const res = await fetch('/api/validate-word', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word }),
    });
    const data = await res.json();
    return !!data.valid;
  };

  const onEnter = useCallback(async () => {
    if (done) return;
    if ([...current].length !== wordLength) {
      showMessage('Mot incomplet');
      return;
    }
    // validate against dictionary
    const isValid = await validateWord(current);
    if (!isValid) {
      showMessage('Mot invalide');
      return;
    }
    const states = evaluateGuess(target.toUpperCase(), current.toUpperCase());

    const nextGuesses = [...guesses, current];
    const nextRows = [...rows, states];

    if (states.every((s) => s === 'correct')) {
      setGuesses(nextGuesses);
      setRows(nextRows);
      setCurrent('');
      setDone(true);
      showMessage('Bravo !');
      onEnd?.('win');
    } else if (guesses.length + 1 >= maxRows) {
      // Défaite: révéler le mot sur une ligne entière en vert
      const revealStates: LetterState[] = Array(wordLength).fill('correct');
      setGuesses([...nextGuesses, target]);
      setRows([...nextRows, revealStates]);
      setCurrent('');
      setDone(true);
      showMessage(`Perdu ! Mot: ${target.toUpperCase()}`);
      onEnd?.('lose');
    } else {
      setGuesses(nextGuesses);
      setRows(nextRows);
      setCurrent('');
    }
  }, [current, wordLength, target, guesses, rows, done, onEnd]);

  // Physical keyboard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') return void onEnter();
      if (e.key === 'Backspace') return void onBackspace();
      if (e.key.length === 1) onType(e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onEnter, onBackspace, onType]);

  return (
    <div className="space-y-6">
      <GameGrid
        length={wordLength}
        guesses={guesses}
        rows={rows}
        current={current}
        maxRows={maxRows}
        showCurrent={!done}
      />
      {message && (
        <div className="text-center text-sm text-red-600 dark:text-red-400">{message}</div>
      )}
      <Keyboard
        onKey={onType}
        onEnter={onEnter}
        onBackspace={onBackspace}
        letterStates={aggregateLetterStates(guesses, rows)}
      />
    </div>
  );
}

function aggregateLetterStates(guesses: string[], rows: LetterState[][]): Record<string, LetterState> {
  const map: Record<string, LetterState> = {};
  for (let i = 0; i < guesses.length; i++) {
    const g = [...guesses[i].toUpperCase()];
    const r = rows[i];
    g.forEach((ch, idx) => {
      const st = r[idx];
      const prev = map[ch];
      const rank = rankState(prev);
      const curRank = rankState(st);
      if (curRank > rank) map[ch] = st;
    });
  }
  return map;
}

function rankState(s?: LetterState) {
  return s === 'correct' ? 3 : s === 'present' ? 2 : s === 'absent' ? 1 : 0;
}
