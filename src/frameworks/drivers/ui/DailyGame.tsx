"use client";

import { evaluateGuess, normalizeWord } from "@/src/domain/services/evaluateGuess";
import { LetterState } from "@/src/domain/entities/LetterState";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = { targetWord: string };

const AZERTY_ROWS = [
  ["A","Z","E","R","T","Y","U","I","O","P"],
  ["Q","S","D","F","G","H","J","K","L","M"],
  ["↵","W","X","C","V","B","N","⌫"],
];

export default function DailyGame({ targetWord }: Props) {
  const len = useMemo(() => normalizeWord(targetWord).length, [targetWord]);
  const maxTries = 6;

  const [rows, setRows] = useState<string[]>(Array(maxTries).fill(""));
  const [rowIndex, setRowIndex] = useState(0);
  const [states, setStates] = useState<LetterState[][]>(Array(maxTries).fill([]));
  const [message, setMessage] = useState<string | null>(null);
  const current = rows[rowIndex] ?? "";

  const setCurrent = (value: string) => {
    setRows((r) => {
      const copy = [...r];
      copy[rowIndex] = value;
      return copy;
    });
  };

  const submit = useCallback(async () => {
    if (current.length !== len) {
      setMessage(`Mot de ${len} lettres requis`);
      return;
    }
    // Validation dictionnaire
    const res = await fetch('/api/validate-word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: current })
    });
    const { valid } = await res.json();
    if (!valid) {
      setMessage('Mot inconnu du dictionnaire');
      return;
    }

    const rowStates = evaluateGuess(current, targetWord);
    setStates((s) => {
      const copy = [...s];
      copy[rowIndex] = rowStates;
      return copy;
    });

    if (normalizeWord(current) === normalizeWord(targetWord)) {
      setMessage('Bravo !');
    } else if (rowIndex + 1 >= maxTries) {
      setMessage(`Raté. Le mot était: ${targetWord.toUpperCase()}`);
    } else {
      setRowIndex((i) => i + 1);
    }
  }, [current, len, rowIndex, targetWord]);

  const press = useCallback((key: string) => {
    if (message?.startsWith('Bravo') || message?.startsWith('Raté')) return;
    if (key === '⌫') {
      setCurrent(current.slice(0, -1));
      return;
    }
    if (key === '↵') {
      submit();
      return;
    }
    const ch = key.toLowerCase();
    if (!/^[a-z]$/.test(ch)) return; // pas d'accents pour la saisie, simplifié
    if (current.length >= len) return;
    setCurrent(current + ch);
  }, [current, len, message, submit]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') return press('↵');
      if (e.key === 'Backspace') return press('⌫');
      const k = e.key.toUpperCase();
      if (/^[A-Z]$/.test(k)) press(k);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [press]);

  return (
    <div className="mt-8 space-y-6">
      {/* Grille */}
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {Array.from({ length: maxTries }).map((_, r) => (
            <div key={r} className="inline-flex items-center gap-2">
              {Array.from({ length: len }).map((__, c) => {
                const filled = (r < rowIndex) || (r === rowIndex && c < (rows[r]?.length || 0));
                const ch = rows[r]?.[c]?.toUpperCase() ?? '';
                const st = states[r]?.[c];
                let cls = 'border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100';
                if (st === LetterState.Correct) cls = 'border-green-600 bg-green-600 text-white';
                else if (st === LetterState.Present) cls = 'border-amber-500 bg-amber-500 text-white';
                else if (st === LetterState.Absent && r < rowIndex) cls = 'border-zinc-700 bg-zinc-700 text-white';
                return (
                  <div key={c} className={`flex h-14 w-14 items-center justify-center select-none rounded-md border text-2xl font-semibold sm:h-16 sm:w-16 ${cls}`}>
                    {filled ? ch : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          {message}
        </div>
      )}

      {/* Clavier */}
      <div className="mx-auto w-full max-w-xl select-none">
        <div className="flex flex-col gap-2">
          {AZERTY_ROWS.map((row, i) => (
            <div key={i} className="flex items-center justify-center gap-2">
              {row.map((k) => (
                <button
                  key={k}
                  onClick={() => press(k)}
                  className={`h-10 rounded-md px-2 text-sm font-medium text-white ${k==='↵'||k==='⌫' ? 'w-16 bg-zinc-700' : 'min-w-8 bg-zinc-600'} hover:brightness-110`}
                >
                  {k}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
