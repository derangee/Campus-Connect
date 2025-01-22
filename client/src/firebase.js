// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmvqM2oO0aBw8N4HJw0TfbUOw8w0WInaM",
  authDomain: "srmap-campus-connect.firebaseapp.com",
  projectId: "srmap-campus-connect",
  storageBucket: "srmap-campus-connect.appspot.com", // Fix storage URL typo
  messagingSenderId: "924558136316",
  appId: "1:924558136316:web:083ce64c33dfaf93235879",
  measurementId: "G-72GM469Q9P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
