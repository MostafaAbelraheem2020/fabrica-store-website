import ProductDetails from "@/app/_components/content/productDetails";
import { Suspense } from "react";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    next: {
      revalidate: 120, // revalidate this page every 120 seconds
    },
  });
  const data = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense>
        <ProductDetails id={id} product={data} />
      </Suspense>
    </div>
  );
}
