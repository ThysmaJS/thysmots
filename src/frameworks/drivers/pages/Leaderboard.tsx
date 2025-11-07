'use client';

import { useEffect, useMemo, useState } from 'react';

type Entry = { name: string; score: number; date: string };

export default function Leaderboard({ refreshKey = 0 }: { refreshKey?: number }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  const load = async () => {
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const items: Entry[] = Array.isArray(data?.items) ? data.items : [];
        setEntries(items);
        return;
      }
    } catch {}
    try {
      const raw = localStorage.getItem('endless-leaderboard');
      const list: Entry[] = raw ? JSON.parse(raw) : [];
      setEntries(Array.isArray(list) ? list : []);
    } catch {
      setEntries([]);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const top = useMemo(() => {
    const copy = [...entries];
    copy.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return copy.slice(0, 10);
  }, [entries]);

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mx-auto w-full max-w-sm">{children}</div>
  );

  if (top.length === 0) return (
    <Wrapper>
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">Leaderboard</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Aucun score pour le moment. Joue et enregistre ta série !</p>
      </div>
    </Wrapper>
  );

  return (
    <Wrapper>
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-100">Leaderboard</h2>
        <ol className="space-y-2">
          {top.map((e, i) => (
            <li key={`${e.name}-${e.date}`} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 text-right text-zinc-500">{i + 1}</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-100">{e.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">{e.score}</span>
                <span className="text-xs text-zinc-400">{new Date(e.date).toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Wrapper>
  );
}
