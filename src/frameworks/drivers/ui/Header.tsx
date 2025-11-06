import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          <span className="text-xl">Thysmots</span>
          <span className="rounded-full bg-blue-600/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">beta</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300 sm:flex">
          <Link href="/play/daily" className="hover:text-zinc-900 dark:hover:text-white">Mot du jour</Link>
          <Link href="/play/endless" className="hover:text-zinc-900 dark:hover:text-white">Mode sans fin</Link>
          <Link href="/how-to-play" className="hover:text-zinc-900 dark:hover:text-white">Règles</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/play/daily"
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Jouer
          </Link>
        </div>
      </div>
    </header>
  );
}
