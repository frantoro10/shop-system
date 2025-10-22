import app from '../config/firebase'; 
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


export const auth = getAuth(app);

// Login function
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};
