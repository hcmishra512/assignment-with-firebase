import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByZs_yXIrnBJmcefz6OvXNrzNqwd8ZFyw",
  authDomain: "react-assignment-581aa.firebaseapp.com",
  projectId: "react-assignment-581aa",
  storageBucket: "react-assignment-581aa.appspot.com",
  messagingSenderId: "563354081590",
  appId: "1:563354081590:web:78d92a61f8343645073b97",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
