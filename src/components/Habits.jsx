

import React from "react";
import streakCalculator from "./StreakCalculator";
import { deleteHabit, doSignOut, gethabitsOfUser, updateHabitHistory } from "../../firebaseFunction.js";
import { useAuth } from "../Context/authcontext";
import { Card } from "./Card.jsx";
import { useNavigate } from "react-router-dom";

export default function Habits() {
  const navigate = useNavigate()

  const [habits, setHabits] = React.useState([]);
  const [clicked, setClicked] = React.useState([]);
  const [checked, setChecked] = React.useState([])
  const [streak, setStreak] = React.useState([])
  const [isLoadingHabits, setIsLoadingHabits] = React.useState(false)
  const [isSigningOut, setIsSigningOut] = React.useState(false)
  const [pageError, setPageError] = React.useState("")
  const [actionError, setActionError] = React.useState("")
  const { userLoggedIn, currentUser, loading } = useAuth();

  const toDateValue = React.useCallback((value) => {
    if (value instanceof Date) {
      return value
    }

    if (value && typeof value.toDate === "function") {
      return value.toDate()
    }

    if (typeof value === "string" || typeof value === "number") {
      const parsedDate = new Date(value)
      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate
      }
    }

    return null
  }, [])

  const normalizeDayKey = React.useCallback((date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized.toDateString();
  }, []);

  const deriveHabitUiState = React.useCallback((habitsData) => {
    const todayKey = normalizeDayKey(new Date());

    const nextChecked = habitsData.map(([habit]) => {
      const historyDates = Array.isArray(habit.history)
        ? habit.history.map(toDateValue).filter(Boolean)
        : []
      return historyDates.some((historyDate) => normalizeDayKey(historyDate) === todayKey)
    })

    const nextStreak = habitsData.map(([habit]) => {
      const historyDates = Array.isArray(habit.history)
        ? habit.history.map(toDateValue).filter(Boolean)
        : []
      const dateAdded = toDateValue(habit.dateAdded) || historyDates[0] || new Date()
      const schedule = Array.isArray(habit.schedule) ? habit.schedule : []

      return streakCalculator(schedule, historyDates, dateAdded)
    })

    return { nextChecked, nextStreak };
  }, [normalizeDayKey, toDateValue]);

  const applyHabitsData = React.useCallback((habitsData, preserveExpandedCards = false) => {
    const { nextChecked, nextStreak } = deriveHabitUiState(habitsData);
    setHabits(habitsData);
    if (preserveExpandedCards) {
      setClicked((prevClicked) => habitsData.map((_, i) => !!prevClicked[i]));
    } else {
      setClicked(Array(habitsData.length).fill(false));
    }
    setChecked(nextChecked);
    setStreak(nextStreak);
  }, [deriveHabitUiState]);

  React.useEffect(() => {
    async function getHabits() {
      if (!userLoggedIn || !currentUser) {
        return
      }

      setPageError("")
      setIsLoadingHabits(true)
      try {
        const habitsData = await gethabitsOfUser(currentUser.uid);
        applyHabitsData(habitsData);
      } catch (error) {
        setPageError(error?.message || "Unable to load habits right now.")
      } finally {
        setIsLoadingHabits(false)
      }
    }

    getHabits();
  }, [userLoggedIn, currentUser, applyHabitsData]);

  async function handleCheck(event, index, id, date) {
    if (loading || !currentUser) {
      return
    }

    const isChecked = event.target.checked;
    setActionError("")

    // Update UI state immediately so the checkbox responds on click.
    setChecked((prevChecked) =>
      prevChecked.map((check, i) => {
        if (i === index) {
          return isChecked;
        }
        return check;
      }),
    )

    try {
      await updateHabitHistory(id, currentUser.uid, isChecked, date)
    } catch (error) {
      setChecked((prevChecked) =>
        prevChecked.map((check, i) => {
          if (i === index) {
            return !isChecked
          }
          return check
        }),
      )
      setActionError(error?.message || "Unable to update habit progress right now.")
      return
    }

    try {
      const habitsData = await gethabitsOfUser(currentUser.uid);
      applyHabitsData(habitsData, true)
    } catch (error) {
      setActionError(error?.message || "Unable to refresh habits right now.")
    }
  }

  async function handleDelete(id) {
    if (loading || !currentUser) {
      return
    }

    setActionError("")
    try {
      await deleteHabit(id, currentUser.uid)
      const habitsData = await gethabitsOfUser(currentUser.uid);
      applyHabitsData(habitsData, true)
    } catch (error) {
      setActionError(error?.message || "Unable to delete habit right now.")
    }
  }

  async function handleSignOut() {
    if (isSigningOut) {
      return
    }

    setActionError("")
    setIsSigningOut(true)
    try {
      await doSignOut()
    } catch (error) {
      setActionError(error?.message || "Unable to sign out right now.")
    } finally {
      setIsSigningOut(false)
    }
  }

  const habitsArrayJSX = habits.map((item, index) => {
    return (
      <Card
        item={item[0]}
        setClicked={setClicked}
        clicked={clicked}
        key={item[1]}
        index={index}
        id={item[1]}
        handleDelete={handleDelete}
        handleCheck={handleCheck}
        checked={checked}
        streak={streak}
      />
    );
  });

  return (
    <main className="habits-page">
      <section className="habits-layout">
        <button className="btn btn--danger habits-action habits-action--left" onClick={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? "Logging Out..." : "LogOut"}
        </button>
        <section className="habits-list">
          {pageError ? <p className="status-message status-message--error" role="alert">{pageError}</p> : null}
          {actionError ? <p className="status-message status-message--error" role="alert">{actionError}</p> : null}
          {isLoadingHabits ? <p className="status-message status-message--info">Loading habits...</p> : null}
          {!isLoadingHabits && !pageError && habitsArrayJSX.length === 0 ? <p className="status-message status-message--info">No habits yet. Add one to get started.</p> : null}
          {!isLoadingHabits && !pageError ? habitsArrayJSX : null}
        </section>
        <button className="btn btn--primary habits-action habits-action--right" onClick={() => navigate("/habit/new")}>
          Add Habit
        </button>
      </section>
    </main>
  );
}
