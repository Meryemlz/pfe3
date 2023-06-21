import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  /**
   * * For security purposes
   */
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: 'bottin-37-37.firebaseapp.com',
  projectId: 'bottin-37-37',
  storageBucket: 'bottin-37-37.appspot.com',
  messagingSenderId: '187214003713',
  appId: '1:187214003713:web:b8618d33d074c66f72ca00'
};

const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
