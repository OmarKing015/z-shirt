"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderId = searchParams.get("order_id")
    const transactionId = searchParams.get("id")

    if (orderId) {
      // In a real app, fetch order details from your database
      setOrderDetails({
        orderId,
        transactionId,
        amount: "$699.98",
        status: "confirmed",
      })
    }
    setLoading(false)
  }, [searchParams])

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
          <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">Thank you for your purchase</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Confirmation</CardTitle>
            <CardDescription>Your payment has been processed successfully</CardDescription>
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
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="font-medium">{orderDetails.transactionId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="font-medium text-green-600">{orderDetails.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium capitalize">{orderDetails.status}</p>
                  </div>
                </div>
              </>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-blue-600" />
                <p className="font-medium text-blue-900">What's Next?</p>
              </div>
              <p className="text-sm text-blue-700">
                You'll receive an email confirmation shortly. Your order will be processed and shipped within 2-3
                business days.
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
