import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import app from '../config/firebase';

// Fetch all products from Firestore
export async function fetchProducts() {
  const db = getFirestore(app);
  const productsCollection = collection(db, 'kioscoProducts');
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Update product price in Firestore
export async function updateProductPrice(productId, newPrice) {
  const db = getFirestore(app);
  const productRef = doc(db, 'kioscoProducts', productId);
  await updateDoc(productRef, { price: newPrice });
}

// Update product cost in Firestore
export async function updateProductCost(productId, newCost) {
  const db = getFirestore(app);
  const productRef = doc(db, 'kioscoProducts', productId);
  await updateDoc(productRef, { cost: newCost });
}

// Create a new product in Firestore
export async function createProduct(productData) {
  const db = getFirestore(app);
  const productsCollection = collection(db, 'kioscoProducts');
  const docRef = await addDoc(productsCollection, productData);
  return docRef.id;
}

// Delete a product from Firestore
export async function deleteProduct(productId) {
  const db = getFirestore(app);
  const productRef = doc(db, 'kioscoProducts', productId);
  await deleteDoc(productRef);
}