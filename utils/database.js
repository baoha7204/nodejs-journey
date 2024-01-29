import { MongoClient, ServerApiVersion } from "mongodb";

let db;

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const mongoConnect = async () => {
  const connectedClient = await client.connect();
  db = connectedClient.db("shop");
  return connectedClient;
};

export const getDb = () => {
  if (db) {
    return db;
  }
  throw new Error("No database found!");
};
