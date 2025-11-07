import { LeaderboardRepository, LeaderboardEntry } from '@/src/domain/ports/LeaderboardRepository';

export class SubmitScoreUseCase {
  constructor(private readonly repo: LeaderboardRepository) {}
  async execute(name: string, score: number): Promise<void> {
    const cleanName = name.replace(/\s+/g, ' ').trim().slice(0, 24);
    const safeScore = Math.max(0, Math.floor(score));
    if (!cleanName || !Number.isFinite(safeScore)) return;
    await this.repo.add({ name: cleanName, score: safeScore, createdAt: new Date() });
  }
}
