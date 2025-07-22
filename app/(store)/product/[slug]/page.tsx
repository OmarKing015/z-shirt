import AddToBasketButton from "@/components/AddToBasketButton";
import { Button } from "@/components/ui/button";
import { imageUrl } from "@/lib/imageUrl";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product.price) {
    return notFound();
  }
  const isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
        <div
          className={`${isOutOfStock ? "opacity-50" : ""} relative aspect-square overflow-hidden rounded-lg shadow-lg`}
        >
          {product.image && (
            <Image
              src={imageUrl(product.image).url()}
              alt={product.name ?? "Product Image"}
              fill
              className="object-contain transition-transform duratoin-300 hover:scale-105"
            />
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex item-center justify-center bg-black bg--opacity-50">
              <span className="text-white font-bold text-xl">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="text-xl font-semibold mb-4">
              {product.price?.toFixed(2)} EGP
            </div>
            <div className="prose max-w-none mb-6">
              <h4>{product.description}</h4>
            </div>
          </div>
          {/* Add To Basket Function */}
          <div className="mt-6">
            <AddToBasketButton product={product} disabled={isOutOfStock} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
