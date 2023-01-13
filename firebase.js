import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBm57xS28rovozzKJ-seR86tdxMjyTeda8",
  authDomain: "hypercomms-30a3a.firebaseapp.com",
  projectId: "hypercomms-30a3a",
  storageBucket: "hypercomms-30a3a.appspot.com",
  messagingSenderId: "27952047671",
  appId: "1:27952047671:web:16377ca69dc446f00601b2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
