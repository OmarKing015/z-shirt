import { client } from "@/sanity/lib/client";
import { backendClient } from "../backendClient";
import { sanityFetch } from "../live";
import { getProductBySlug } from "./getProductBySlug";

export async function updateProductStock(
  productSlug: string,
  quantityToDeduct: number
) {
  try {
    // Get current stock
    const product = await getProductBySlug(productSlug);

    if (!product) {
      throw new Error(`Product not found: ${productSlug}`);
    }

    const currentStock = product.stock || 0;
    const newStock = Math.max(0, currentStock - quantityToDeduct);

    // Update stock
    const result = await backendClient
      .patch(productSlug)
      .set({ stock: newStock })
      .commit();

    return { success: true, newStock, result };
  } catch (error) {
    console.error("Failed to update product stock:", error);
    return { success: false, error };
  }
}

export async function updateMultipleProductsStock(
  items: Array<{ productSlug: string; quantity: number }>
) {
  try {
    const updatePromises = items.map((item) =>
      updateProductStock(item.productSlug, item.quantity)
    );

    const results = await Promise.all(updatePromises);

    return { success: true, results };
  } catch (error) {
    console.error("Failed to update multiple products stock:", error);
    return { success: false, error };
  }
}
