import type { LetterState } from '@/src/domain/services/evaluate';

const ROWS = [
  ['A','Z','E','R','T','Y','U','I','O','P'],
  ['Q','S','D','F','G','H','J','K','L','M'],
  ['⌫','W','X','C','V','B','N','⏎'],
];

export default function Keyboard({
  onKey,
  onBackspace,
  onEnter,
  letterStates,
}: {
  onKey: (ch: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  letterStates: Record<string, LetterState>;
}) {
  return (
    <div className="select-none">
      {ROWS.map((row, i) => (
        <div key={i} className="mx-auto mt-2 flex max-w-2xl justify-center gap-2">
          {row.map((k) => (
            <Key
              key={k}
              label={k}
              state={letterStates[k]}
              onClick={() => {
                if (k === '⌫') return onBackspace();
                if (k === '⏎') return onEnter();
                onKey(k);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Key({ label, onClick, state }: { label: string; onClick: () => void; state?: LetterState }) {
  const base = 'h-12 min-w-8 rounded-md px-3 text-sm font-medium';
  const theme = state === 'correct'
    ? 'bg-green-600 text-white'
    : state === 'present'
    ? 'bg-amber-500 text-white'
    : state === 'absent'
    ? 'bg-zinc-700 text-zinc-200'
    : 'bg-zinc-300 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100';
  return (
    <button onClick={onClick} className={`${base} ${theme}`}>{label}</button>
  );
}
