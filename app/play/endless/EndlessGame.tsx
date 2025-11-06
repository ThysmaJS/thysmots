'use client';

import { useCallback, useEffect, useState } from 'react';
import DailyGame from '../daily/DailyGame';

export default function EndlessGame() {
  const [target, setTarget] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewWord = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/random-word', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch random word');
      const data = await res.json();
      const obj = Array.isArray(data) ? data[0] : data;
      const name: string | undefined = obj?.name;
      const cat: string | undefined = obj?.categorie;
      if (!name || typeof name !== 'string') throw new Error('Invalid random word');
      setTarget(name);
      setCategory(typeof cat === 'string' ? cat : null);
    } catch (e: any) {
      setError(e?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNewWord(); }, [fetchNewWord]);

  const onEnd = useCallback((result: 'win' | 'lose') => {
    // Nouveau mot uniquement en fin de partie
    fetchNewWord();
  }, [fetchNewWord]);

  if (loading && !target) return <p className="text-sm text-zinc-500">Chargement…</p>;
  if (error && !target) return (
    <div className="space-y-3">
      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      <button onClick={fetchNewWord} className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm text-white">Réessayer</button>
    </div>
  );

  if (!target) return null;
  return (
    <div className="space-y-4">
      {category && (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Catégorie : {category}</p>
      )}
      <DailyGame target={target} onEnd={onEnd} />
    </div>
  );
}
