import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://nwagh008_db_user:kXxrNs4h153GEW2X@cluster0.hmxm6mq.mongodb.net/portfolio_analytics?retryWrites=true&w=majority";

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
