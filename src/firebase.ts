// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-ehzKw5hK8jSSih2NWlIO-GdFbFDeymo",
  authDomain: "next-example-47722.firebaseapp.com",
  projectId: "next-example-47722",
  storageBucket: "next-example-47722.appspot.com",
  messagingSenderId: "942324087012",
  appId: "1:942324087012:web:868c0ab1d7bf9fcc08d4f1",
  measurementId: "G-X9HF4F3GTL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
