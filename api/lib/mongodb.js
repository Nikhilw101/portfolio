import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient = global.mongoClient;
let cachedDb = global.mongoDb;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('portfolio_analytics');

  global.mongoClient = client;
  global.mongoDb = db;

  return { client, db };
}
