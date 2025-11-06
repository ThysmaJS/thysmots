export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 bg-white/80 py-8 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-black/60 dark:text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p>
          © {new Date().getFullYear()} Thysmots. Tous droits réservés.
        </p>
        <nav className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-zinc-900 dark:hover:text-white">Confidentialité</a>
          <a href="/terms" className="hover:text-zinc-900 dark:hover:text-white">Conditions</a>
          <a href="https://wordle.louan.me/" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white">
            Inspiration
          </a>
        </nav>
      </div>
    </footer>
  );
}
