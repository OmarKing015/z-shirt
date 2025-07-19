import { Category, Product } from "@/sanity.types";
import React from "react";
import ProductGrid from "./ProductGrid";
import { CatogerySelectorComponent } from "./ui/category-selector";

interface ProducstViewProps {
  products: Product[];
  categories: Category[];
}

const ProductsView = ({ products, categories }: ProducstViewProps) => {
  return (
    <div className="flex  flex-col">
      <div className="rounded h-3 my-2 w-full sm:w-[200px]">
        <CatogerySelectorComponent categories={categories} />
      </div>
      <div className="flex-1">
        <div>
          <ProductGrid products={products} />
          <hr className="w-1/2 sm:w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default ProductsView;
