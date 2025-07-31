import { Product } from "@/types/mongodb";
import { connectToDatabase } from "../mongodbConfig";
import { ObjectId } from "mongodb";

export async function getAllProducts(): Promise<Product[]> {
  const { db } = await connectToDatabase();
  const products = await db.collection("products").find({}).toArray();
  return products as unknown as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { db } = await connectToDatabase();
  const product = await db.collection("products").findOne({ "slug.current": slug });
  return product as unknown as Product | null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const { db } = await connectToDatabase();
  const products = await db.collection("products").find({ "category.slug.current": categorySlug }).toArray();
  return products as unknown as Product[];
}

export async function searchProductbyName(name: string): Promise<Product[]> {
  const { db } = await connectToDatabase();
  const products = await db.collection("products").find({ name: { $regex: name, $options: "i" } }).toArray();
  return products as unknown as Product[];
}

export async function updateMultipleProductsStock(stockUpdates: { productId: string; quantity: number }[]) {
  const { db } = await connectToDatabase();
  const bulkOps = stockUpdates.map((update) => ({
    updateOne: {
      filter: { _id: new ObjectId(update.productId) },
      update: { $inc: { stock: -update.quantity } },
    },
  }));

  if (bulkOps.length === 0) {
    return { success: true };
  }

  const result = await db.collection("products").bulkWrite(bulkOps);
  return { success: result.isOk() };
}
