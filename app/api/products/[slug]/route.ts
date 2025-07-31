import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/mongodb/products";

export async function GET(
  request: Request,
  { params }: any
) {
  const slug = params.slug;
  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
