/* eslint-disable no-unused-vars */
import React from "react";
import { RiArrowDropUpLine } from "react-icons/ri";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Navigate, useNavigate } from "react-router-dom";
import { deleteHabit } from "../../firebaseFunction";
import { useAuth } from "../Context/authcontext";
export function Card({ clicked, setClicked, item, options, index, id, handleDelete}) {
    function toggle() {
        setClicked(
            clicked.map((click, i) => {
                if (i == index) {
                    return !click;
                } else {
                    return click;
                }
            }),
        );
    }

    let navigate = useNavigate()
    function handleEdit() {
        navigate(`/habit/update/${id}`)
    }
    async function handle() {
        await handleDelete(id)
    }
    
    return (
        !clicked[index] ? <><h1>{item.title}</h1><span onClick={toggle}><RiArrowDropDownLine /></span></> :
            <div className="HabitCard">
                <label htmlFor="checked"><h1>Title: </h1></label>
                <span onClick={toggle}><RiArrowDropUpLine /></span>
                <input type="radio" name="checked"></input>
                <h3>{item.title}</h3>
                <h2>Description</h2>
                <h4>{item.description}</h4>
                <h2>Days</h2>
                <ol>
                    {item.schedule.map((day, index) => (
                        <li key={index}>{day}</li>
                    ))}
                </ol>
                <h2>Streak</h2>
                <ol>
                    {item.history.map((entry, index) => (
                        <li key={index}>
                            {entry.toDate().toLocaleDateString(undefined, options)}
                        </li>
                    ))}
                </ol>

                <button onClick={handleEdit}>Edit</button>
                <button onClick={handle}>Delete</button>
            </div>
    );
}
