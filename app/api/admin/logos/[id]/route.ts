import { type NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { uri } from "../route";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("ZSHIRT");
    const collection = db.collection("logos");

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

    await client.close();

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Logo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Logo deleted successfully" });
  } catch (error) {
    console.error("Error deleting logo:", error);
    return NextResponse.json(
      { error: "Failed to delete logo" },
      { status: 500 }
    );
  }
}
