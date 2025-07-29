import { type NextRequest, NextResponse } from "next/server";
import { MongoClient, Binary } from "mongodb";
import type { File as FileModel } from "@/lib/models";

export const uri = process.env.MONGODB_API_KEY || "";

export async function GET() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('ZSHIRT');
        const files = await db.collection<FileModel>("upload").find({}).sort({ createdAt: -1 }).toArray();
        await client.close();

        const formattedFiles = files?.map((file) => ({
            _id: file._id?.toString(),
            name: file.fileName,
            userName:file.userName,
            orderNumber:file.orderNumber,
            downloadUrl: `/api/admin/files/${file._id}/download`,
            createdAt: file.uploadDate.toISOString(),
        }));

        return NextResponse.json(formattedFiles);
    } catch (error) {
        console.error("Error fetching files:", error);
        return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const name = formData.get("name") as string;
        const category = formData.get("category") as string;

        if (!file || !name || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('ZSHIRT');
        const collection = db.collection('files');

        const result = await collection.insertOne({
            name,
            category,
            file: new Binary(buffer),
            contentType: file.type,
            createdAt: new Date(),
        });
        await client.close();

        return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
