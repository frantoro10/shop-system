import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../firebase';

export async function fetchProducts() {
  const db = getFirestore(app);
  const productsCollection = collection(db, 'kioscoProducts');
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Aquí puedes agregar más funciones: createProduct, updateProduct, deleteProduct, etc.