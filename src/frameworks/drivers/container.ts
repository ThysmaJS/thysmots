import { ValidateWordUseCase, ListLeaderboardUseCase, SubmitScoreUseCase } from '@/app/use_cases';
import { TrouveMotGateway, FrenchDictionaryGateway, LeaderboardMongoRepository } from '@/src/frameworks/drivers/infrastructure';
import { GetDailyWord, GetRandomWord } from '@/src/domain/ports/words/WordReadPort';

// Word use cases (now domain port classes provide execution)
export function makeGetDailyWordUseCase() {
  return new GetDailyWord(new TrouveMotGateway());
}

export function makeGetRandomWordUseCase() {
  return new GetRandomWord(new TrouveMotGateway());
}

export function makeValidateWordUseCase() {
  return new ValidateWordUseCase(new FrenchDictionaryGateway());
}

// Leaderboard use cases
function makeLeaderboardRepo() {
  return new LeaderboardMongoRepository();
}

export function makeListLeaderboardUseCase() {
  return new ListLeaderboardUseCase(makeLeaderboardRepo());
}

export function makeSubmitScoreUseCase() {
  return new SubmitScoreUseCase(makeLeaderboardRepo());
}
