import { Suspense } from "react";
import ProductsPage from "./products/page";
import ProductsGridSkeleton from "./_components/content/productsListSkeleton";

export default async function Home() {
  return (
    <div>
      {" "}
      <Suspense fallback={<ProductsGridSkeleton />}>
        <ProductsPage />
      </Suspense>
    </div>
  );
}
