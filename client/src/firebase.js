// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-stack-project-4eb3d.firebaseapp.com",
  projectId: "mern-stack-project-4eb3d",
  storageBucket: "mern-stack-project-4eb3d.firebasestorage.app",
  messagingSenderId: "950272834292",
  appId: "1:950272834292:web:2079939302324eb3003ca1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);