import { ListLeaderboardUseCase } from './ListLeaderboardUseCase';
import type { LeaderboardRepository, LeaderboardEntry } from '@/src/domain/ports/LeaderboardRepository';

describe('ListLeaderboardUseCase', () => {
  class FakeRepo implements LeaderboardRepository {
    constructor(private data: LeaderboardEntry[]) {}
    async listTop(limit: number): Promise<LeaderboardEntry[]> {
      return this.data.slice(0, limit);
    }
    async add(): Promise<void> { throw new Error('not used'); }
  }

  it('maps repository entries to DTO with ISO date', async () => {
    const now = new Date();
    const repo = new FakeRepo([{ name: 'Alice', score: 42, createdAt: now }]);
    const uc = new ListLeaderboardUseCase(repo);
    const result = await uc.execute(10);
    expect(result).toEqual([{ name: 'Alice', score: 42, date: now.toISOString() }]);
  });

  it('respects limit parameter', async () => {
    const repo = new FakeRepo([
      { name: 'A', score: 1, createdAt: new Date() },
      { name: 'B', score: 2, createdAt: new Date() },
      { name: 'C', score: 3, createdAt: new Date() }
    ]);
    const uc = new ListLeaderboardUseCase(repo);
    const result = await uc.execute(2);
    expect(result).toHaveLength(2);
    expect(result.map(r => r.name)).toEqual(['A','B']);
  });
});
