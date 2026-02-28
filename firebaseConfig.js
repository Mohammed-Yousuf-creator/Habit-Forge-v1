/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import React from "react"
import { initializeApp } from "firebase/app";
import {getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged, validatePassword, signOut, signInWithPopup} from "firebase/auth";
import {addDoc, collection, getDocs, getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw1hSMHHGh5uzV17rRGeq4KcdnBjSt8eY",
  authDomain: "habit-forge-bbb22.firebaseapp.com",
  projectId: "habit-forge-bbb22",
  storageBucket: "habit-forge-bbb22.firebasestorage.app",
  messagingSenderId: "942384763264",
  appId: "1:942384763264:web:e50d742b0006d3be0c7165"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export async function SignUp(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password)
} 
export function logIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}
export async function logInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result
}
export function doSignOut() {
  return auth.signOut()
}
export {app, auth}