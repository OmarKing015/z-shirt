import BlackFirdayBanner from "@/components/BlackFirdayBanner";
import ProductsView from "@/components/ProductsView";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/lib/mongodb/categories";
import { getAllProducts } from "@/lib/mongodb/products";
import Image from "next/image";

export default async function Home() {
  const products: any[] = await getAllProducts();
  const categories = await getAllCategories();
  
  return (
    <div>
      <BlackFirdayBanner/>
      <div className="flex flex-col item-center justify-top min-h-screen bg-gray-100 p-4">
        <ProductsView products={products.filter((product) => product?.slug?.current != "custom-tshirt")} categories={categories} />
      </div>
    </div>
  );
}
