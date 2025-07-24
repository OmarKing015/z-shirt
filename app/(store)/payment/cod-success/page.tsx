"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowRight, Banknote, Clock } from "lucide-react"
import Link from "next/link"
import useBasketStore from "@/store/store"

export default function CODSuccessPage() {
  const searchParams = useSearchParams()
  const clearBasket = useBasketStore((state) => state.clearBasket)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderId = searchParams.get("order_id")

    if (orderId) {
      // Clear the basket since order was placed
      clearBasket()

      // Clear sessionStorage
      sessionStorage.removeItem("checkoutItems")
      sessionStorage.removeItem("checkoutTotal")

      setOrderDetails({
        orderId,
        status: "confirmed",
        paymentMethod: "cod",
      })
    }
    setLoading(false)
  }, [searchParams, clearBasket])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">Your Cash on Delivery order has been placed successfully</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Confirmation</CardTitle>
            <CardDescription>Your COD order is being prepared for delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderDetails && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-medium">{orderDetails.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-green-600" />
                      <p className="font-medium">Cash on Delivery</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <p className="font-medium capitalize text-blue-600">{orderDetails.status}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Banknote className="h-5 w-5 text-amber-600" />
                <p className="font-medium text-amber-900">Cash on Delivery Instructions</p>
              </div>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Please have the exact amount ready when the delivery arrives</li>
                <li>• Our delivery agent will collect the payment upon delivery</li>
                <li>• You can inspect the items before making payment</li>
                <li>• Keep this order confirmation for your records</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-blue-600" />
                <p className="font-medium text-blue-900">What's Next?</p>
              </div>
              <p className="text-sm text-blue-700">
                You'll receive an email confirmation shortly. Your order will be processed and delivered within 3-5
                business days. Our team will contact you before delivery.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button asChild className="flex-1">
                <Link href="/orders">
                  View Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
