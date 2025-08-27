"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../_utilties/firebaseConfig";
import { uploadImageToCloudinary } from "../_utilties/cloudinaryUpload";
import dummyProductsjson from "./defaultProducts1.json";

// إنشاء الكونتكست
export const MyContext = createContext();

export function MyContextProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // مرجع دائم للمنتجات (للوصول السريع بدون إعادة رندر)
  const prevProducts = useRef([]);

  // جلب المنتجات من Firestore أو من الكاش
  const fetchProducts = async (force = false) => {
    setLoading(true);
    try {
      // جلب من localStorage أولاً (إلا إذا طلبنا force تحديث)
      if (!force) {
        const cached = localStorage.getItem("productsList");
        if (cached) {
          const parsed = JSON.parse(cached);
          setProducts(parsed);
          prevProducts.current = parsed;
          setLoading(false);
          return;
        }
      }
      // جلب من Firestore
      const snapshot = await getDocs(collection(db, "products"));
      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
      prevProducts.current = productsList;
      localStorage.setItem("productsList", JSON.stringify(productsList));
    } catch (error) {
      console.error("❌ خطأ في جلب البيانات:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // جلب المنتجات عند أول تحميل
  useEffect(() => {
    fetchProducts();
  }, []);

  // إضافة منتجات dummy إلى قاعدة البيانات
  async function fetchDummy() {
    setLoading(true);
    const dummyList = dummyProductsjson.map((product, idx) => ({
      id: product.id || idx + 1,
      title: product.title,
      category: product.category,
      description: product.description,
      price: parseFloat(product.price),
      images: Array.isArray(product.images)
        ? product.images.map((img, i) => ({
            url: img.url,
            width: img.width || 500,
            height: img.height || 500,
            isPrimary: img.isPrimary || false,
          }))
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    localStorage.setItem("productsList", JSON.stringify(dummyList));
    for (const product of dummyList) {
      const { id, ...productData } = product;
      await addDoc(collection(db, "products"), productData);
    }
    setProducts((prev) => [...prev, ...dummyList]);
    prevProducts.current = [...prevProducts.current, ...dummyList];
    setLoading(false);
  }

  // إضافة منتج جديد
  const addProduct = async (productData, imageFile) => {
    setLoading(true);
    try {
      let imageInfo = null;
      if (imageFile) {
        imageInfo = await uploadImageToCloudinary(imageFile, "products");
      }
      const productToSave = {
        title: productData.title,
        category: productData.category,
        description: productData.description,
        price: parseFloat(productData.price),
        image: imageInfo
          ? {
              url: imageInfo.url,
              publicId: imageInfo.publicId,
              width: imageInfo.width,
              height: imageInfo.height,
            }
          : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "products"), productToSave);
      const newProduct = { id: docRef.id, ...productToSave };
      setProducts((prev) => {
        const updated = [...prev, newProduct];
        localStorage.setItem("productsList", JSON.stringify(updated));
        prevProducts.current = updated;
        return updated;
      });
      return { success: true, productId: docRef.id };
    } catch (error) {
      console.error("❌ خطأ في إضافة المنتج:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // حذف منتج
  const deleteProduct = async (productId, imagePublicId) => {
    try {
      if (imagePublicId) {
        // حذف صورة Cloudinary (يمكنك إضافة API خاص)
        console.log("تم تحديد صورة للحذف:", imagePublicId);
      }
      await deleteDoc(doc(db, "products", productId));
      setProducts((prev) => {
        const updated = prev.filter((product) => product.id !== productId);
        localStorage.setItem("productsList", JSON.stringify(updated));
        prevProducts.current = updated;
        return updated;
      });
      return { success: true };
    } catch (error) {
      console.error("❌ خطأ في حذف المنتج:", error);
      return { success: false, error: error.message };
    }
  };

  // تحديث المنتجات يدويًا (مثلاً عند الضغط على زر تحديث)
  const refreshProducts = () => fetchProducts(true);

  return (
    <MyContext.Provider
      value={{
        products,
        setProducts,
        loading,
        addProduct,
        deleteProduct,
        fetchDummy,
        prevProducts,
        fetchProducts,
        refreshProducts,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

// Hook للاستخدام
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
}
