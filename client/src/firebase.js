/* eslint-disable no-dupe-keys */
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmvqM2oO0aBw8N4HJw0TfbUOw8w0WInaM",
  authDomain: "srmap-campus-connect.firebaseapp.com",
  projectId: "srmap-campus-connect",
  storageBucket: "srmap-campus-connect.appspot.com", 
  messagingSenderId: "924558136316",
  appId: "1:924558136316:web:083ce64c33dfaf93235879",
  measurementId: "G-72GM469Q9P",
  storageBucket: "srmap-campus-connect.appspot.com"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
