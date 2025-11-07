import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri && process.env.NODE_ENV !== 'production') {
  console.warn('MONGODB_URI is not set. Leaderboard API will fail until you set it.');
}
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | undefined;
declare global { var _mongoClientPromise: Promise<MongoClient> | undefined; }
export async function getDb(): Promise<Db> {
  const dbName = process.env.MONGODB_DB || 'thysmots';
  if (!uri) throw new Error('Missing MONGODB_URI environment variable');
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {});
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
  const connected = await clientPromise;
  return connected.db(dbName);
}
