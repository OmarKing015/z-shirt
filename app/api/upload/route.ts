import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Binary } from 'mongodb';
import { auth, clerkClient, currentUser, getAuth, User} from '@clerk/nextjs/server';
// import { uri } from '@/lib/mongodbConfig';

export const uri = process.env.MONGODB_API_KEY || "";


export async function POST(req: NextRequest) {
  
  // Parse the multipart form data
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
const user =await currentUser();

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
    filename: user?.fullName || "custom tshirt",
    UserId: user?.id,
    data: new Binary(buffer),
    uploadedAt: new Date(),
  });
  const assetId = result.insertedId
  await client.close();
  return NextResponse.json({ message: 'File uploaded successfully', assetId }, { status: 200 });
}
