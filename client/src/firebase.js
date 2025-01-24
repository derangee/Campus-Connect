import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmvqM2oO0aBw8N4HJw0TfbUOw8w0WInaM",
  authDomain: "srmap-campus-connect.firebaseapp.com",
  projectId: "srmap-campus-connect",
  messagingSenderId: "924558136316",
  appId: "1:924558136316:web:083ce64c33dfaf93235879",
  measurementId: "G-72GM469Q9P",
  storageBucket: "srmap-campus-connect.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
