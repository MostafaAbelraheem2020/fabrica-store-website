"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import { auth } from "@/app/_utilties/firebaseConfig";
export default function ProductImagesSlider({
  product,
  imageWidth = 400,
  imageHeight = 400,
}) {
  const images =
    Array.isArray(product?.images) && product?.images.length > 0
      ? product.images.map((img, idx) =>
          typeof img === "string"
            ? {
                url: img,
                width: imageWidth,
                height: imageHeight,
                isPrimary: idx === 0,
              }
            : img
        )
      : [
          {
            url: "/imgs/3d-white-polo-t-shirt-mockup-scaled.jpg",
            width: imageWidth,
            height: imageHeight,
            isPrimary: true,
          },
        ];

  // Filter out images with empty or falsy URLs
  const validImages = images.filter((img) => !!img.url);

  const [selectedImage, setSelectedImage] = useState(
    (product?.images &&
      product?.images.length > 0 &&
      validImages.find((img) => img.isPrimary)) ||
      validImages[0]
  );

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
      <div className="product-gallery w-full">
        {/* الصورة الرئيسية الكبيرة */}
        <div className="main-image mb-2 relative flex items-center justify-center">
          {selectedImage?.url && (
            <Image
              src={selectedImage.url}
              width={imageWidth}
              height={imageHeight}
              alt={"ddsfds"}
              className="rounded-lg shadow-md object-cover transition-all duration-300 group-hover:scale-105"
              priority
              style={{ objectFit: "cover" }}
            />
          )}
        </div>

        {/* الصور المصغرة */}
        {validImages.length > 1 && (
          <div className="thumbnails flex gap-2 w-full  justify-center">
            {validImages.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedImage(image);
                  console.log(product);
                }}
                className={`flex-shrink-0 border-2 h-[20px] w-[20px] rounded-md overflow-hidden transition
                    ${
                      selectedImage.url === image.url
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                aria-label={`عرض صورة رقم ${index + 1}`}
              >
                {image.url && (
                  <Image
                    src={image.url}
                    width={100}
                    height={100}
                    alt={`${product?.title} - ${index + 1}`}
                    className="h-full w-full object-cover"
                    priority
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
