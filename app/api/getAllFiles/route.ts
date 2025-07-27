import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI as string;

export async function GET() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("z-shirt");
    const collection = database.collection("upload");
    const files = await collection.find({}).toArray();
    return NextResponse.json(files);
  } finally {
    await client.close();
  }
}
