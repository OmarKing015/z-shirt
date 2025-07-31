import { connectToDatabase } from "../mongodbConfig";

export async function getActiveSaleByCouponCode(couponCode: string) {
    const { db } = await connectToDatabase();
    const sale = await db.collection("sales").findOne({ couponCode, isActive: true });
    return sale;
}
