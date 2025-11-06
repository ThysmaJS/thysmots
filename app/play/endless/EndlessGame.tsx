'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import DailyGame from '../daily/DailyGame';
import Leaderboard from './Leaderboard';

export default function EndlessGame() {
  const [target, setTarget] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Score en direct
  const [wins, setWins] = useState<number>(0);
  const [games, setGames] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lbRefreshKey, setLbRefreshKey] = useState<number>(0);
  const resetTimeoutRef = useRef<number | null>(null);

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

  useEffect(() => () => {
    if (resetTimeoutRef.current !== null) {
      clearTimeout(resetTimeoutRef.current);
    }
  }, []);

  // Charger/sauvegarder le score localement
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('endless-score') || 'null');
      if (saved && typeof saved === 'object') {
        if (typeof saved.wins === 'number') setWins(saved.wins);
        if (typeof saved.games === 'number') setGames(saved.games);
        if (typeof saved.streak === 'number') setStreak(saved.streak);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('endless-score', JSON.stringify({ wins, games, streak }));
    } catch {}
  }, [wins, games, streak]);

  const addLeaderboardEntry = useCallback(async (name: string, score: number) => {
    // Try API first
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.warn('Leaderboard API save failed:', res.status, data);
        throw new Error('Failed to save');
      }
      setLbRefreshKey((k) => k + 1);
      return;
    } catch {}
    // Fallback to localStorage if API not available
    try {
      const raw = localStorage.getItem('endless-leaderboard');
      const list: Array<{ name: string; score: number; date: string }>
        = raw ? JSON.parse(raw) : [];
      list.push({ name, score, date: new Date().toISOString() });
      localStorage.setItem('endless-leaderboard', JSON.stringify(list));
      setLbRefreshKey((k) => k + 1);
      console.warn('Saved leaderboard locally (API unavailable).');
    } catch {}
  }, []);

  const onEnd = useCallback((result: 'win' | 'lose') => {
    // Mettre à jour le score en direct
    setGames((g) => g + 1);
    if (resetTimeoutRef.current !== null) clearTimeout(resetTimeoutRef.current);
    if (result === 'win') {
      setWins((w) => w + 1);
      setStreak((s) => s + 1);
      // Laisser la grille affichée 2s puis réinitialiser
      resetTimeoutRef.current = window.setTimeout(() => {
        setTarget(null);
        fetchNewWord();
      }, 2000);
    } else {
      const currentStreak = streak;
      // Perdu: afficher le mot (déjà fait dans DailyGame), attendre 2s puis demander le pseudo et réinitialiser
      resetTimeoutRef.current = window.setTimeout(async () => {
        if (currentStreak > 0) {
          const name = window.prompt('Tu as perdu ! Entre ton pseudo pour enregistrer le score (annuler pour ignorer) :');
          if (name && name.trim()) {
            await addLeaderboardEntry(name.trim().slice(0, 24), currentStreak);
          }
        }
        setStreak(0);
        setTarget(null);
        fetchNewWord();
      }, 2000);
    }
  }, [fetchNewWord, addLeaderboardEntry, streak]);

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
      <div className="flex items-center justify-between text-sm">
        {category && (
          <p className="text-zinc-600 dark:text-zinc-300">Catégorie : {category}</p>
        )}
        <div className="text-right">
          <p className="font-medium text-zinc-800 dark:text-zinc-100">Série en cours : {streak}</p>
        </div>
      </div>
      <DailyGame key={target} target={target} onEnd={onEnd} />
      <div className="pt-2">
        <Leaderboard refreshKey={lbRefreshKey} />
      </div>
    </div>
  );
}
