import type { Db, MongoClient } from "mongodb";

// Lazy singleton — never throws at module load time.
// process.env is read inside the function so it works with Nitro/Vite SSR.
let _clientPromise: Promise<MongoClient> | undefined;

async function getClient(): Promise<MongoClient> {
  if (_clientPromise) return _clientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to .env.local and restart the dev server."
    );
  }

  // Dynamic import so mongodb is never bundled for the browser
  const { MongoClient } = await import("mongodb");

  const options = {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  if (process.env.NODE_ENV === "development") {
    // Reuse connection across HMR reloads
    const g = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };
    if (!g._mongoClientPromise) {
      g._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    _clientPromise = g._mongoClientPromise;
  } else {
    _clientPromise = new MongoClient(uri, options).connect();
  }

  return _clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db();
}
