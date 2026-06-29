import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD3t_FGDxTXf9ywyrVBZZNg1aM_iA6eidg",
  authDomain: "career-os-1476d.firebaseapp.com",
  projectId: "career-os-1476d",

  // 🔥 Changed this line
  storageBucket: "career-os-1476d.appspot.com",

  messagingSenderId: "490377583456",
  appId: "1:490377583456:web:c375ad88df67c08e99dc05",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;