import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../_utilties/firebaseConfig";

export default async function fetchProducts() {
  const snapshot = await getDocs(collection(db, "products"));
  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("Fetched products:", products);
  return products;
}

export async function fetchProductById(id) {
  const productDoc = await getDoc(doc(db, "products", id));
  if (productDoc.exists()) {
    console.log(`Fetched product with ID ${id}:`, productDoc.data());
    return {
      id: productDoc.id,
      ...productDoc.data(),
    };
  } else {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error("Product not found");
  }
}
