"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { judgeGuess, type LetterState, stripAccents } from "@/src/domain/entities";
import Keyboard from "./Keyboard";

const MAX_TRIES = 6;

export default function Board({ answer }: { answer: string }) {
  const len = answer.length;
  const [rows, setRows] = useState<string[]>(["", ...Array(MAX_TRIES - 1).fill("")]);
  const [states, setStates] = useState<LetterState[][]>(Array(MAX_TRIES).fill(Array(len).fill('absent')));
  const [tryIndex, setTryIndex] = useState(0);
  const [done, setDone] = useState<null | 'win' | 'lose'>(null);

  const keyStates = useMemo(() => {
    const map: Record<string, LetterState> = {};
    states.forEach((row, r) => {
      const guess = rows[r] ?? "";
      for (let i = 0; i < row.length; i++) {
        const ch = (guess[i] || '').toLowerCase();
        const st = row[i];
        map[ch] = mergeState(map[ch], st);
      }
    });
    return map;
  }, [states, rows]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const onPhysicalKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (done) return;
    if (e.key === 'Enter') return submit();
    if (e.key === 'Backspace') return erase();
    const k = e.key.toLowerCase();
    if (/^[a-zA-Zàâäéèêëîïôöùûüçœæ]$/.test(k)) add(k);
  };

  const onVirtualKey = (k: string) => {
    if (done) return;
    if (k === '↵') return submit();
    if (k === '⌫') return erase();
    if (/^[A-Z]$/.test(k)) add(k.toLowerCase());
  };

  function add(ch: string) {
    setRows(prev => prev.map((row, i) => i === tryIndex ? (row.length < len ? row + ch : row) : row));
  }
  function erase() {
    setRows(prev => prev.map((row, i) => i === tryIndex ? row.slice(0, -1) : row));
  }
  function submit() {
    const guess = rows[tryIndex];
    if (!guess || guess.length !== len) return;
    const res = judgeGuess(answer, guess);
    setStates(prev => prev.map((row, i) => i === tryIndex ? res : row));
    if (res.every(s => s === 'correct')) {
      setDone('win');
    } else if (tryIndex + 1 >= MAX_TRIES) {
      setDone('lose');
    } else {
      setTryIndex(i => i + 1);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <input
        ref={inputRef}
        className="sr-only"
        onKeyDown={onPhysicalKey}
      />

      <div className="grid grid-rows-6 gap-2">
        {rows.map((row, r) => (
          <div key={r} className="grid grid-cols-5 gap-2">
            {Array.from({ length: len }).map((_, c) => {
              const ch = (row[c] || '').toUpperCase();
              const st = states[r]?.[c] ?? 'absent';
              return (
                <div
                  key={`${r}-${c}`}
                  className={`aspect-square rounded-md border text-center text-xl font-semibold leading-[56px] transition-colors ${cellColor(st)}`}
                >
                  {ch}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Keyboard onKey={onVirtualKey} keyStates={keyStates} />
      </div>

      {done && (
        <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-300">
          {done === 'win' ? 'Bravo !' : `Dommage, c’était « ${stripAccents(answer).toUpperCase()} ».`}
        </p>
      )}
    </div>
  );
}

function cellColor(s: LetterState) {
  switch (s) {
    case 'correct':
      return 'border-green-600 bg-green-600 text-white';
    case 'present':
      return 'border-amber-500 bg-amber-500 text-white';
    default:
      return 'border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100';
  }
}

function mergeState(prev: LetterState | undefined, next: LetterState): LetterState {
  const rank = { absent: 0, present: 1, correct: 2 } as const;
  if (!prev) return next;
  return rank[next] >= rank[prev] ? next : prev;
}
