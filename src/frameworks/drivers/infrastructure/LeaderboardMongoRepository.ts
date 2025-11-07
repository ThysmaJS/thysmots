import { getDb } from './mongodb';
import { LeaderboardRepository, LeaderboardEntry } from '@/src/domain/ports/LeaderboardRepository';

export class LeaderboardMongoRepository implements LeaderboardRepository {
  async listTop(limit: number): Promise<LeaderboardEntry[]> {
    const db = await getDb();
    const docs = await db
      .collection('leaderboard')
      .find({}, { projection: { _id: 0, name: 1, score: 1, createdAt: 1 } })
      .sort({ score: -1, createdAt: -1 })
      .limit(limit)
      .toArray();
    return docs.map((d: any) => ({ name: d.name, score: Number(d.score) || 0, createdAt: new Date(d.createdAt) }));
  }

  async add(entry: LeaderboardEntry): Promise<void> {
    const db = await getDb();
    await db.collection('leaderboard').insertOne(entry);
  }
}
