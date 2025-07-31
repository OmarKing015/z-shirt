import { MongoClient } from "mongodb";
import { Product, Category } from "../types/mongodb";

const uri = process.env.MONGODB_API_KEY || "mongodb+srv://ADMINZSHIRTS:ADMINZSHIRTS@zshirt.d7b7qol.mongodb.net/?retryWrites=true&w=majority&appName=ZSHIRT";
const dbName = "z-shirt";

const products: Omit<Product, "_id">[] = [
    {
        name: "Classic Black T-Shirt",
        description: "A classic black t-shirt made from 100% cotton.",
        price: 250,
        image: "/images/black-t-shirt.jpg",
        stock: 100,
        size: ["S", "M", "L", "XL"],
        slug: { current: "classic-black-t-shirt" },
        category: { name: "T-Shirts", slug: { current: "t-shirts" } },
    },
    {
        name: "White Graphic Tee",
        description: "A white t-shirt with a cool graphic print.",
        price: 300,
        image: "/images/white-graphic-tee.jpg",
        stock: 50,
        size: ["M", "L"],
        slug: { current: "white-graphic-tee" },
        category: { name: "T-Shirts", slug: { current: "t-shirts" } },
    },
    {
        name: "Blue Hoodie",
        description: "A comfortable blue hoodie for chilly days.",
        price: 600,
        image: "/images/blue-hoodie.jpg",
        stock: 30,
        size: ["L", "XL"],
        slug: { current: "blue-hoodie" },
        category: { name: "Hoodies", slug: { current: "hoodies" } },
    },
];

const categories: Omit<Category, "_id">[] = [
    { name: "T-Shirts", slug: { current: "t-shirts" } },
    { name: "Hoodies", slug: { current: "hoodies" } },
];

async function seedDatabase() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);

        // Clear existing data
        await db.collection("products").deleteMany({});
        await db.collection("categories").deleteMany({});

        // Insert new data
        await db.collection("products").insertMany(products as any);
        await db.collection("categories").insertMany(categories as any);

        console.log("Database seeded successfully!");
    } finally {
        await client.close();
    }
}

seedDatabase().catch(console.dir);
