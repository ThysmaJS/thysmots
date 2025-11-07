import { LeaderboardRepository } from '@/src/domain/ports/LeaderboardRepository';

export class ListLeaderboardUseCase {
  constructor(private readonly repo: LeaderboardRepository) {}
  async execute(limit: number = 10): Promise<{ name: string; score: number; date: string }[]> {
    const rows = await this.repo.listTop(limit);
    return rows.map(r => ({ name: r.name, score: r.score, date: r.createdAt.toISOString() }));
  }
}
