import Image from "next/image";
import Link from "next/link";

export function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Thysmots
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Devine le mot caché en un minimum d'essais. Choisis le{" "}
            <span className="font-semibold">mot du jour</span> ou lance-toi en{" "}
            <span className="font-semibold">mode sans fin</span>.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/play/daily"
              className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow hover:bg-zinc-800 dark:bg-white dark:text-black"
            >
              Jouer au mot du jour
            </Link>
            <Link
              href="/play/endless"
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Mode sans fin
            </Link>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Inspiré de Wordle, pensé pour s'amuser et s'entraîner au quotidien.
          </p>
        </div>
        <div className="order-first md:order-none">
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800">
              <span>Thysmots</span>
              <span className="rounded bg-green-500/10 px-2 py-0.5 text-green-600 dark:text-green-400">
                Demo
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2 p-4">
              {"THYSMOTS"
                .slice(0, 5)
                .split("")
                .map((c, i) => (
                  <div
                    key={i}
                    className="aspect-square select-none rounded-md border border-zinc-200 bg-zinc-50 text-center text-lg font-semibold leading-[46px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    {c}
                  </div>
                ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`g-${i}`}
                  className="aspect-square select-none rounded-md border border-zinc-200 bg-zinc-50 text-center text-lg font-semibold leading-[46px] text-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-600"
                >
                  ?
                </div>
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`b-${i}`}
                  className="aspect-square select-none rounded-md border border-zinc-200 bg-zinc-50 text-center text-lg font-semibold leading-[46px] text-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-600"
                >
                  ·
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mt-20 grid gap-6 md:grid-cols-3">
        <ModeCard
          title="Mot du jour"
          description="Un nouveau mot chaque jour. Compare ton score avec tes amis."
          href="/play/daily"
          badge="Quotidien"
        />
        <ModeCard
          title="Mode sans fin"
          description="Joue autant que tu veux, enchaîne les parties."
          href="/play/endless"
          badge="Infini"
        />
        <ModeCard
          title="Défis personnalisés"
          description="Partage un mot secret pour défier tes amis."
          href="/play/challenge"
          badge="Bientôt"
          disabled
        />
      </section>
      <section className="mt-20">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Comment jouer ?
        </h2>
        <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-300">
          Devine le mot en 6 essais. Chaque essai doit être un mot valide. Les
          lettres changent de couleur pour indiquer si elles sont bien placées,
          mal placées, ou absentes.
        </p>
        <div className="mt-6 flex gap-3 text-xs font-medium">
          <span className="rounded-md bg-green-500/10 px-2 py-1 text-green-700 dark:text-green-400">
            Bien placé
          </span>
          <span className="rounded-md bg-yellow-500/10 px-2 py-1 text-yellow-700 dark:text-yellow-400">
            Mal placé
          </span>
          <span className="rounded-md bg-zinc-200 px-2 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            Absent
          </span>
        </div>
      </section>
    </div>
  );
}

function ModeCard({
  title,
  description,
  href,
  badge,
  disabled,
}: {
  title: string;
  description: string;
  href: string;
  badge?: string;
  disabled?: boolean;
}) {
  const Wrapper = disabled ? "div" : (Link as any);
  return (
    <Wrapper
      href={disabled ? undefined : href}
      className={`group relative block rounded-2xl border p-6 transition-colors ${
        disabled
          ? "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-70 dark:border-zinc-800 dark:bg-zinc-900"
          : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      }`}
    >
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-blue-600/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
          {badge}
        </span>
      )}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        {description}
      </p>
      {!disabled && (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:underline dark:text-blue-400">
          Commencer
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M12.97 3.97a.75.75 0 0 1 1.06 0l7 7a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06-1.06L18.94 12 12.97 6.03a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M4.5 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5h-14A.75.75 0 0 1 4.5 12Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </Wrapper>
  );
}
