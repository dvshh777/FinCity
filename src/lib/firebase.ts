import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "absolute-episode-kghtt",
  appId: "1:839330886716:web:a058fa2d5dd1e7f10c3f39",
  apiKey: "AIzaSyCI_WIeB7SRP_W3eWV9ttHuPv7oXnVD_lI",
  authDomain: "absolute-episode-kghtt.firebaseapp.com",
  storageBucket: "absolute-episode-kghtt.firebasestorage.app",
  messagingSenderId: "839330886716"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-fincitysavetoday-5b2ae877-2661-4254-8dfe-50f82b97947b");

