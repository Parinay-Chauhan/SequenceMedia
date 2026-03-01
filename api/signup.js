import { MongoClient } from "mongodb";

let client;

export default async function handler(req, res) {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
  }

  const db = client.db("site");
  const users = db.collection("users");

  if (req.method === "POST") {
    const { email, password } = req.body;
    await users.insertOne({ email, password });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}