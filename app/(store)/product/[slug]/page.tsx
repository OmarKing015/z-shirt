import AddToBasketButton from "@/components/AddToBasketButton"
import { imageUrl } from "@/lib/imageUrl"
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Package, Star, Shield, Truck } from "lucide-react"

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product.price) {
    return notFound()
  }

  const isOutOfStock = product.stock != null && product.stock <= 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div
                className={`${
                  isOutOfStock ? "opacity-50" : ""
                } relative aspect-square overflow-hidden rounded-lg shadow-lg bg-gray-100`}
              >
                {product.image && (
                  <Image
                    src={imageUrl(product.image).url() || "/placeholder.svg"}
                    alt={product.name ?? "Product Image"}
                    fill
                    className="object-contain transition-transform duration-300 hover:scale-105"
                  />
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <span className="text-white font-bold text-xl">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.8 out of 5)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">{product.price?.toFixed(2)} EGP</div>
                  {product.stock != null && (
                    <p className="text-sm text-gray-600">
                      {isOutOfStock ? (
                        <span className="text-red-600 font-medium">Out of Stock</span>
                      ) : (
                        <span className="text-green-600 font-medium">{product.stock} items in stock</span>
                      )}
                    </p>
                  )}
                </div>

                {product.description && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                    <div className="prose max-w-none text-gray-600">
                      <p>{product.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Add To Basket Function */}
              <div className="space-y-4">
                <AddToBasketButton product={product} disabled={isOutOfStock} />

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex flex-col items-center text-center">
                    <Shield className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-xs text-gray-600">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Truck className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-xs text-gray-600">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Package className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-xs text-gray-600">Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Product Info */}
          <div className="border-t bg-gray-50 p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">High Quality</h4>
                <p className="text-sm text-gray-600">The Highest Quality you will see</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-2">14-Day Returns</h4>
                <p className="text-sm text-gray-600">Easy returns within 14 days of purchase</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-2">Warranty</h4>
                <p className="text-sm text-gray-600">1/2-year manufacturer warranty included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
