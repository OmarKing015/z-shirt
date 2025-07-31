"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import useBasketStore from "@/store/store"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const clearBasket = useBasketStore((state) => state.clearBasket)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderId = searchParams.get("order_id")
    const transactionId = searchParams.get("id")

    if (orderId) {
      // Clear the basket since payment was successful
      clearBasket()

      // Clear sessionStorage
      sessionStorage.removeItem("checkoutItems")
      sessionStorage.removeItem("checkoutTotal")

      setOrderDetails({
        orderId,
        transactionId,
        status: "confirmed",
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
    <div>
      <h1>Payment Successful!</h1>
    </div>
  )
}
