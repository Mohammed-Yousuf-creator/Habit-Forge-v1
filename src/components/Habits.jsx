/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { doSignOut, gethabitsOfUser } from "../../firebaseFunction.js";
import { useAuth } from "../Context/authcontext";
import { Card } from "./Card.jsx";
import { useNavigate } from "react-router-dom";
import { deleteHabit } from "../../firebaseFunction.js";
export default function Habits() {
  const navigate = useNavigate()
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  let [habits, setHabits] = React.useState([]);
  const [clicked, setClicked] = React.useState([]);
  const { userLoggedIn, currentUser, loading } = useAuth();
  React.useEffect(() => {
    async function getHabits() {
      if (userLoggedIn) {
        const habits = await gethabitsOfUser(currentUser.uid);
        setHabits(habits);
        setClicked(Array(habits.length).fill(false));
      }
    }
    getHabits();
  }, []);
  async function handleDelete(id) {
    if (!loading) {
      await deleteHabit(id, currentUser.uid)
      setHabits(await gethabitsOfUser(currentUser.uid)) 
    }
  }
  const habitsArrayJSX = habits.map((item, index) => {
    return (
      <Card
        item={item[0]}
        setClicked={setClicked}
        clicked={clicked}
        options={options}
        key={item[1]}
        index={index}
        id={item[1]}
        handleDelete={handleDelete}
      />
    );
  });

  return (
    <>
      <button onClick={doSignOut}>LogOut</button>
      {habitsArrayJSX}
      <button onClick={() => navigate("/habit/new")}>Add Habit</button>
    </>
  );
}
