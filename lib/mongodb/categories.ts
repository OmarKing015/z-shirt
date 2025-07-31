import { Category } from "@/types/mongodb";
import { connectToDatabase } from "../mongodbConfig";

export async function getAllCategories(): Promise<Category[]> {
  const { db } = await connectToDatabase();
  const categories = await db.collection("categories").find({}).toArray();
  return categories as unknown as Category[];
}
