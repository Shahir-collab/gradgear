// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Replace with your own Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmvr1pY8MqDpcnNq-6X6v7Y-YfCyp0l6s",
    authDomain: "gradegear-8dd00.firebaseapp.com",
    projectId: "gradegear-8dd00",
    storageBucket: "gradegear-8dd00.firebasestorage.app",
    messagingSenderId: "302043886869",
    appId: "1:302043886869:web:8b212816273a4e74f6e51c",
    measurementId: "G-8T3GHT9WT1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };