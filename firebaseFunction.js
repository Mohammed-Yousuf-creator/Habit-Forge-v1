import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import {doc, deleteDoc,addDoc, collection, getDocs, serverTimestamp, updateDoc, getDoc, Timestamp, arrayUnion, arrayRemove} from "firebase/firestore"
import {db, auth} from "./firebaseConfig.js"

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]

const firebaseErrorMessages = {
  "auth/email-already-in-use": "An account already exists with this email.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/popup-closed-by-user": "Google sign-in was canceled before completion.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your internet connection and try again.",
  "permission-denied": "You do not have permission to perform this action.",
  unavailable: "Service is temporarily unavailable. Please try again shortly.",
}

function buildAppError(error, fallbackMessage) {
  const appError = new Error(
    firebaseErrorMessages[error?.code] || fallbackMessage || "Something went wrong. Please try again.",
  )
  appError.code = error?.code || "app/unknown"
  appError.originalMessage = error?.message || ""
  return appError
}

function throwAppError(error, fallbackMessage) {
  throw buildAppError(error, fallbackMessage)
}

function throwValidationError(message) {
  const validationError = new Error(message)
  validationError.code = "app/validation"
  throw validationError
}

function normalizeSchedule(schedule) {
  if (!Array.isArray(schedule)) {
    return []
  }

  const normalizedSchedule = schedule
    .filter((day) => typeof day === "string")
    .map((day) => day.toLowerCase())
    .filter((day) => days.includes(day))

  return [...new Set(normalizedSchedule)].sort((dayA, dayB) => days.indexOf(dayA) - days.indexOf(dayB))
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return []
  }
  return history.filter((entry) => entry != null)
}

function normalizeHabitData(habitData) {
  return {
    ...habitData,
    title: typeof habitData?.title === "string" ? habitData.title : "",
    description: typeof habitData?.description === "string" ? habitData.description : "",
    schedule: normalizeSchedule(habitData?.schedule),
    history: normalizeHistory(habitData?.history),
  }
}


export async function SignUp(email, password) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password)
  } catch (error) {
    throwAppError(error, "Unable to create your account right now.")
  }
} 
export async function logIn(email, password) {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    throwAppError(error, "Unable to log in right now.")
  }
}
export async function logInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result
  } catch (error) {
    throwAppError(error, "Google sign-in failed. Please try again.")
  }
}
export function doSignOut() {
  return auth.signOut().catch((error) => {
    throwAppError(error, "Unable to sign out right now.")
  })
}
export async function gethabitsOfUser(userId) {
  try {
    const userHabitsRef = collection(db, `users`, userId, "habits")
    const userHabits = await getDocs(userHabitsRef)
    const userHabitsArray = []
    userHabits.forEach(item => userHabitsArray.push([normalizeHabitData(item.data()), item.id]))
    return userHabitsArray
  } catch (error) {
    throwAppError(error, "Unable to load habits right now.")
  }
}
export async function addHabit(userId, item) {
  const schedule = normalizeSchedule(item?.schedule)
  if (schedule.length === 0) {
    throwValidationError("Please select at least one day for the habit schedule.")
  }

  try {
    const userHabitsRef = collection(db, 'users', userId, 'habits')
    const docRef = await addDoc(userHabitsRef, {
      dateAdded: serverTimestamp(),
      title: typeof item?.title === "string" ? item.title.trim() : "",
      description: typeof item?.description === "string" ? item.description.trim() : "",
      schedule,
      history: [],
      LastUpdated: serverTimestamp(),
    })
    return docRef
  } catch (error) {
    throwAppError(error, "Unable to create habit right now.")
  }
}
export async function deleteHabit(habitId, userId) {
  try {
    await deleteDoc(doc(db, "users", userId, "habits", habitId))
  } catch (error) {
    throwAppError(error, "Unable to delete habit right now.")
  }
}
export async function updateHabit(habitId, userId, habit) {
  const schedule = normalizeSchedule(habit?.schedule)
  if (schedule.length === 0) {
    throwValidationError("Please select at least one day for the habit schedule.")
  }

  try {
    const habitref = doc(db, "users", userId, "habits", habitId)
    await updateDoc(habitref, {
      title: typeof habit?.title === "string" ? habit.title.trim() : "",
      description: typeof habit?.description === "string" ? habit.description.trim() : "",
      schedule,
      history: normalizeHistory(habit?.history),
      LastUpdated: serverTimestamp()
    })
  } catch (error) {
    throwAppError(error, "Unable to update habit right now.")
  }
}
export async function getHabit(habitId, userId) {
  try {
    const docRef = doc(db, "users", userId, "habits", habitId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return normalizeHabitData(docSnap.data())
    }

    const notFoundError = new Error("Habit not found.")
    notFoundError.code = "app/not-found"
    throw notFoundError
  } catch (error) {
    if (error?.code === "app/not-found") {
      throw error
    }
    throwAppError(error, "Unable to load this habit right now.")
  }
}
export async function updateHabitHistory(habitId, userId, checked, date) {
  try {
    const habitRef = doc(db, "users", userId, "habits", habitId)
    const date1 = new Date(date)
    if (Number.isNaN(date1.getTime())) {
      throwValidationError("Invalid date provided for habit update.")
    }
    date1.setHours(0, 0, 0, 0)

    if (checked) {
      await updateDoc(habitRef, {
        history: arrayUnion(Timestamp.fromDate(date1))
      })
    } else {
      await updateDoc(habitRef, {
        history: arrayRemove(Timestamp.fromDate(date1))
      })
    }
  } catch (error) {
    if (error?.code === "app/validation") {
      throw error
    }
    throwAppError(error, "Unable to update habit progress right now.")
  }
}
