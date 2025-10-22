import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../config/firebase';

export async function fetchProducts() {
  const db = getFirestore(app);
  const productsCollection = collection(db, 'kioscoProducts');
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateProductPrice(productId, newPrice) {
  const db = getFirestore(app);
  const productRef = doc(db, 'kioscoProducts', productId);
  await updateDoc(productRef, { price: newPrice });
}

export async function updateProductCost(productId, newCost) {
  const db = getFirestore(app);
  const productRef = doc(db, 'kioscoProducts', productId);
  await updateDoc(productRef, { cost: newCost });
}

// Puedes agregar más funciones CRUD aquí (createProduct, deleteProduct, updateProductCost, etc.)