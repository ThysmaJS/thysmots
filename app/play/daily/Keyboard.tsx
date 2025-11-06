"use client";

import type { LetterState } from "@/src/domain/entities";

const rows = [
  ["A","Z","E","R","T","Y","U","I","O","P"],
  ["Q","S","D","F","G","H","J","K","L","M"],
  ["↵","W","X","C","V","B","N","⌫"],
];

export default function Keyboard({ onKey, keyStates }: {
  onKey: (key: string) => void;
  keyStates: Record<string, LetterState>;
}) {
  const color = (key: string) => {
    const k = key.toLowerCase();
    const s = keyStates[k];
    if (s === 'correct') return 'bg-green-600 text-white';
    if (s === 'present') return 'bg-amber-500 text-white';
    if (s === 'absent') return 'bg-zinc-700 text-white';
    return 'bg-zinc-300 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100';
  };

  return (
    <div className="select-none">
      {rows.map((r, i) => (
        <div key={i} className="mb-2 flex justify-center gap-2">
          {r.map((k) => (
            <button
              key={k}
              className={`h-12 rounded-md px-2 text-sm font-semibold ${color(k)} min-w-[2.2rem]`}
              onClick={() => onKey(k)}
            >
              {k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
