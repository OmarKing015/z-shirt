export interface Product {
    _id: string;
    name:string;
    description: string;
    price: number;
    image: string;
    stock: number;
    size: string[];
    slug: {
        current: string;
    };
    category: {
        name: string;
        slug: {
            current: string;
        };
    };
}

export interface Category {
    _id: string;
    name: string;
    slug: {
        current: string;
    };
}

export interface Order {
    _id: string;
    orderId: string;
    clerkUserId?: string;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: {
        street: string;
        city: string;
        country: string;
        postalCode: string;
    };
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    paymentStatus: "pending" | "completed" | "failed" | "cod_pending";
    paymentMethod: "cod" | "paymob";
    paymobOrderId?: string;
    fileUrl?: string;
    orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: string;
    transactionId?: string;
}
