import { MongoClient } from "mongodb";

let client;
let db;

export default async function handler(req, res) {
  try {
    // connect once
    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
      db = client.db("site");
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const users = db.collection("users");

    // prevent duplicate users
    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    await users.insertOne({ email, password });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}