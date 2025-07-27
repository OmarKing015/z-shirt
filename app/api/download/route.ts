import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { uri } from '@/lib/mongodbConfig';


export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ZSHIRT');
  const collection = db.collection('uploads');

  const fileDoc = await collection.findOne({ filename });
  await client.close();

  if (!fileDoc || !fileDoc.data) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }

  // fileDoc.data is a BSON Binary object, so get the buffer
  const buffer = fileDoc.data.buffer;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    },
  });
}
