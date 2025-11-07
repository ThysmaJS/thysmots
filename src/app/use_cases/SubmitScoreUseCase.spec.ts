import { SubmitScoreUseCase } from './SubmitScoreUseCase';
import type { LeaderboardRepository, LeaderboardEntry } from '@/src/domain/ports/LeaderboardRepository';

describe('SubmitScoreUseCase', () => {
  class InMemoryRepo implements LeaderboardRepository {
    public entries: LeaderboardEntry[] = [];
    async listTop(): Promise<LeaderboardEntry[]> { return this.entries; }
    async add(entry: LeaderboardEntry): Promise<void> { this.entries.push(entry); }
  }

  it('trims and caps name, floors and clamps score', async () => {
    const repo = new InMemoryRepo();
    const uc = new SubmitScoreUseCase(repo);
    await uc.execute('  John   Doe   The  Third  With LongName ', 12.9);
    expect(repo.entries).toHaveLength(1);
    const e = repo.entries[0];
    expect(e.name.length).toBeLessThanOrEqual(24);
    expect(e.name.startsWith('John Doe The Third With')).toBe(true);
    expect(e.score).toBe(12);
    expect(e.createdAt instanceof Date).toBe(true);
  });

  it('ignores invalid payloads (empty name or NaN score)', async () => {
    const repo = new InMemoryRepo();
    const uc = new SubmitScoreUseCase(repo);
    await uc.execute('   ', 5);
    await uc.execute('Alice', NaN as any);
    expect(repo.entries).toHaveLength(0);
  });

  it('never stores negative scores', async () => {
    const repo = new InMemoryRepo();
    const uc = new SubmitScoreUseCase(repo);
    await uc.execute('Bob', -10);
    expect(repo.entries[0].score).toBe(0);
  });
});
