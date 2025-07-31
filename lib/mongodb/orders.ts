import { Order } from "@/types/mongodb";
import { connectToDatabase } from "../mongodbConfig";
import { InsertOneResult } from "mongodb";

export async function createOrder(order: Omit<Order, "_id">): Promise<InsertOneResult> {
  const { db } = await connectToDatabase();
  const result = await db.collection("orders").insertOne(order);
  return result;
}

export async function getMyOrders(userId: string): Promise<Order[]> {
    const { db } = await connectToDatabase();
    const orders = await db.collection("orders").find({ clerkUserId: userId }).toArray();
    return orders as unknown as Order[];
}

export async function findOrderByPaymobId(paymobOrderId: string): Promise<{ success: boolean, order: Order | null }> {
    const { db } = await connectToDatabase();
    const order = await db.collection("orders").findOne({ paymobOrderId });
    return { success: !!order, order: order as unknown as Order | null };
}

export async function updateOrderStatus(paymobOrderId: string, orderStatus: string, paymentStatus: string, transactionId: string) {
    const { db } = await connectToDatabase();
    const result = await db.collection("orders").updateOne(
        { paymobOrderId },
        { $set: { orderStatus, paymentStatus, transactionId } }
    );
    return { success: result.modifiedCount > 0 };
}
