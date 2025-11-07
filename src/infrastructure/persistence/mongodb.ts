import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  // In serverless env, throw only on first actual use to avoid build-time crash.
  // But we keep a helpful console for dev.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('MONGODB_URI is not set. Leaderboard API will fail until you set it.');
  }
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | undefined;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getDb(): Promise<Db> {
  const dbName = process.env.MONGODB_DB || 'thysmots';
  const connectionString = uri;
  if (!connectionString) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  if (!global._mongoClientPromise) {
    client = new MongoClient(connectionString, {});
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;

  const connected = await clientPromise;
  return connected.db(dbName);
}
