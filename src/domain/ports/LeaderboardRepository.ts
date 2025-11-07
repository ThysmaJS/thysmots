export interface LeaderboardEntry {
  name: string;
  score: number;
  createdAt: Date;
}

export interface LeaderboardRepository {
  listTop(limit: number): Promise<LeaderboardEntry[]>;
  add(entry: LeaderboardEntry): Promise<void>;
}
