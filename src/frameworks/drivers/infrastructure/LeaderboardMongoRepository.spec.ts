import { LeaderboardMongoRepository } from './LeaderboardMongoRepository';
import { getDb } from './mongodb';
import type { LeaderboardEntry } from '@/src/domain/ports/LeaderboardRepository';

jest.mock('./mongodb', () => ({
  getDb: jest.fn()
}));

describe('LeaderboardMongoRepository', () => {
  const sample: LeaderboardEntry[] = [
    { name: 'Alice', score: 10, createdAt: new Date('2024-01-01T00:00:00Z') },
    { name: 'Bob', score: 15, createdAt: new Date('2024-01-02T00:00:00Z') }
  ];

  beforeEach(() => {
    (getDb as jest.Mock).mockResolvedValue({
      collection: () => ({
        find: () => ({
          sort: () => ({
            limit: () => ({
              toArray: async () => sample.map(e => ({ name: e.name, score: e.score, createdAt: e.createdAt }))
            })
          })
        }),
        insertOne: jest.fn(async (doc) => { sample.push(doc as any); })
      })
    } as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('lists top entries', async () => {
    const repo = new LeaderboardMongoRepository();
    const top = await repo.listTop(5);
    expect(top).toHaveLength(2);
    expect(top[0].name).toBe('Alice');
    expect(top[1].score).toBe(15);
  });

  it('adds an entry', async () => {
    const repo = new LeaderboardMongoRepository();
    const before = sample.length;
    await repo.add({ name: 'Cara', score: 33, createdAt: new Date() });
    expect(sample.length).toBe(before + 1);
    expect(sample[sample.length - 1].name).toBe('Cara');
  });
});
