// pages/products.js
"use client";
import React, { useContext } from "react";
import Product from "./productCard";
import ProductsGridSkeleton from "./productsListSkeleton";

import Link from "next/link";
import ProductCard from "./productCard";

export default function ProductsList({ products }) {
  return (
    <div className="container mx-auto p-4 ">
      <h1>Products</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products !== null ? (
          products?.map((item) => {
            return (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            );
          })
        ) : (
          <li>
            <p>No products available</p>
          </li>
        )}
      </ul>
    </div>
  );
}
