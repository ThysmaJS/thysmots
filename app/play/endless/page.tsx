import EndlessGame from "./EndlessGame";

export const dynamic = 'force-dynamic';

export default async function EndlessPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Mot sans fin</h1>
      <div className="mt-8">
        <EndlessGame />
      </div>
    </div>
  );
}
