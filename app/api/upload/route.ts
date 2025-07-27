import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Binary } from 'mongodb';
import { uri } from '@/lib/mongodbConfig';



export async function POST(req: NextRequest) {
  // Parse the multipart form data
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  // Read the file as a buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Connect to MongoDB and insert the file
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ZSHIRT');
  const collection = db.collection('uploads');

  const result = await collection.insertOne({
    filename: file.name,
    data: new Binary(buffer),
    uploadedAt: new Date(),
  });
  const assetId = result.insertedId
  await client.close();
  return NextResponse.json({ message: 'File uploaded successfully', assetId }, { status: 200 });
}
