import type { LetterState } from '@/src/domain/services/evaluate';

export default function GameGrid({
  length,
  guesses,
  rows,
  current,
  maxRows,
}: {
  length: number;
  guesses: string[];
  rows: LetterState[][];
  current: string;
  maxRows: number;
}) {
  const totalRows = Math.max(guesses.length + 1, maxRows);
  const emptyRows = Math.max(0, totalRows - guesses.length - 1);

  return (
    <div className="w-full overflow-x-auto">
      <div
        className="mx-auto grid gap-2"
        style={{ gridTemplateColumns: `repeat(${length}, minmax(2.5rem, 1fr))`, maxWidth: `calc(${length} * 3rem)` }}
      >
        {guesses.map((g, i) => (
          <Row key={`g-${i}`} word={g} states={rows[i]} length={length} frozen />
        ))}
        <Row word={current} length={length} />
        {Array.from({ length: emptyRows }).map((_, i) => (
          <Row key={`e-${i}`} word="" length={length} />
        ))}
      </div>
    </div>
  );
}

function Row({ word, states, length, frozen }: { word: string; states?: LetterState[]; length: number; frozen?: boolean }) {
  const letters = [...word];
  return (
    <>
      {Array.from({ length }).map((_, idx) => {
        const ch = letters[idx]?.toUpperCase() || '';
        const st = states?.[idx];
        const base = 'aspect-square select-none rounded-md border text-center text-xl font-semibold leading-[3rem]';
        const theme = st === 'correct'
          ? 'bg-green-500 text-white border-green-600'
          : st === 'present'
          ? 'bg-amber-500 text-white border-amber-600'
          : frozen
          ? 'bg-zinc-800 text-zinc-100 border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'
          : 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700';
        return (
          <div key={idx} className={`${base} ${theme}`}>{ch}</div>
        );
      })}
    </>
  );
}
