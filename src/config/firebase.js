import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDnLjYByKKsk7xChPQ0F7kZiik6p8ZbHxE",
    authDomain: "fir-2023-social-app.firebaseapp.com",
    projectId: "fir-2023-social-app",
    storageBucket: "fir-2023-social-app.appspot.com",
    messagingSenderId: "242545489318",
    appId: "1:242545489318:web:c843e213a662c71b290b67",
    measurementId: "G-L2P3RQTCRV"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
