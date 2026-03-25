/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged, validatePassword, signOut, signInWithPopup} from "firebase/auth";
import {doc, deleteDoc,addDoc, collection, getDocs, getFirestore, serverTimestamp, updateDoc, getDoc} from "firebase/firestore"
import {db, auth} from "./firebaseConfig.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


// Initialize Firebase


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
export async function gethabitsOfUser(userId) {
  const userHabitsRef = collection(db, `users`, userId, "habits")
  const userHabits = await getDocs(userHabitsRef)
  const userHabitsArray = []
  userHabits.forEach(item => userHabitsArray.push([item.data(), item.id]))
  return userHabitsArray
}
export async function addHabit(userId, item) {
  const userHabitsRef = collection(db, 'users', userId, 'habits')
  const docRef = await addDoc(userHabitsRef, {
    dateAdded: serverTimestamp(),
    title: item.title,
    description: item.description,
    schedule: item.schedule,
    history: [],
    LastUpdated: serverTimestamp(),
  })
}
export async function deleteHabit(habitId, userId) {
  await deleteDoc(doc(db, "users", userId, "habits", habitId))
}
export async function updateHabit(habitId, userId, habit) {
  const habitref = doc(db, "users", userId, "habits", habitId)
  await updateDoc(habitref, {
    title: habit.title,
    description: habit.description,
    schedule: habit.schedule,
    history: habit.history,
    LastUpdated: serverTimestamp()
  })
}
export async function getHabit(habitId, userId) {
  const docRef = doc(db, "users", userId, "habits", habitId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return false
  }
}
export async function checkHabit(habitId, userId) {

}
export async function streakBreak(habitId, userId) {}
export async function unCheckHabit(habitId, userId) {}
