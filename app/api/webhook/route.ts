import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify webhook signature if HMAC secret is provided
    if (PAYMOB_HMAC_SECRET) {
      const receivedSignature = request.headers.get("x-paymob-signature")

      if (receivedSignature) {
        const expectedSignature = crypto
          .createHmac("sha512", PAYMOB_HMAC_SECRET)
          .update(JSON.stringify(body))
          .digest("hex")

        if (receivedSignature !== expectedSignature) {
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
        }
      }
    }

    // Process the webhook based on transaction status
    const { obj: transaction } = body

    switch (transaction.success) {
      case true:
        // Payment successful
        console.log("Payment successful:", transaction.order.id)
        // TODO: Update your database, send confirmation emails, etc.
        // You can clear the user's basket here
        break

      case false:
        // Payment failed
        console.log("Payment failed:", transaction.order.id)
        // TODO: Handle failed payment, notify user
        break

      default:
        console.log("Payment pending:", transaction.order.id)
      // TODO: Handle pending payment
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
