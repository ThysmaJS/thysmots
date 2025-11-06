import { GetDailyWordUseCase } from "@/src/app/use_cases";
import { TrouveMotGateway } from "@/src/adapters/infrastructure";
import DailyGame from "@/src/frameworks/drivers/ui/DailyGame";

export const dynamic = 'force-dynamic';

export default async function DailyPage() {
  const useCase = new GetDailyWordUseCase(new TrouveMotGateway());
  const word = await useCase.execute();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Mot du jour
      </h1>
      <p className="mt-2 text-center text-zinc-600 dark:text-zinc-300">Catégorie : {word.categorie}</p>

      <div className="mt-6 flex justify-center">
        <DailyGame targetWord={word.name} />
      </div>
    </div>
  );
}
