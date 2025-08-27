import { Suspense } from "react";
import ProductsList from "../_components/content/productesList";
import ProductsGridSkeleton from "../_components/content/productsListSkeleton";

export default async function ProductsPage() {
  const res = await fetch("https://dummyjson.com/products", {
    next: {
      revalidate: 120, // revalidate this page every 120 seconds
    },
  });
  const data = await res.json();

  const productsData = data.products;
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductsGridSkeleton />}>
        <ProductsList products={productsData} />
      </Suspense>
    </div>
  );
}
