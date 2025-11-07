import { GetDailyWordUseCase, GetRandomWordUseCase, ValidateWordUseCase, ListLeaderboardUseCase, SubmitScoreUseCase } from '@/application/use_cases';
import { TrouveMotGateway, FrenchDictionaryGateway, LeaderboardMongoRepository } from '@/src/frameworks/drivers/infrastructure';

// Word use cases
export function makeGetDailyWordUseCase() {
  return new GetDailyWordUseCase(new TrouveMotGateway());
}

export function makeGetRandomWordUseCase() {
  return new GetRandomWordUseCase(new TrouveMotGateway());
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
