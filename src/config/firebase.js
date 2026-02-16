import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyApfdO1bdXy37kSzAEigsZ5MnOj9iVqY5w',
  authDomain: 'praboard-project.firebaseapp.com',
  projectId: 'praboard-project',
  storageBucket: 'praboard-project.firebasestorage.app',
  messagingSenderId: '977023852188',
  appId: '1:977023852188:web:0d96c8cc37b693ca3a9759',
  measurementId: 'G-F35L3ZLVJ6',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
