// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAt1kGxFyNWBH2YJUs_CBTgR9G9j1fh44o",
  authDomain: "scrap-to-savor-app.firebaseapp.com",
  projectId: "scrap-to-savor-app",
  storageBucket: "scrap-to-savor-app.appspot.com",
  messagingSenderId: "695459624156",
  appId: "1:695459624156:web:cff3b9c86b3bb02d06f019"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

