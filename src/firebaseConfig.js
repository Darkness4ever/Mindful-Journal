// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABxf-bX4ZH8vVlV5O_Q1_PT-QAbX4byHQ",
  authDomain: "mindful-journal-bfa48.firebaseapp.com",
  projectId: "mindful-journal-bfa48",
  storageBucket: "mindful-journal-bfa48.firebasestorage.app",
  messagingSenderId: "1068010329464",
  appId: "1:1068010329464:web:8f0c26d371ffde2bada48d",
  measurementId: "G-Z71W47DVNQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app); // Firebase Authentication service
export const db = getFirestore(app);
