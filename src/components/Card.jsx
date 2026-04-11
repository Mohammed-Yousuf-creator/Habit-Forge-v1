
import React from "react";
import { RiArrowDropUpLine } from "react-icons/ri";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export function Card({ clicked, setClicked, item, index, id, handleDelete, handleCheck, checked, streak}) {
    const date = new Date()
    const day = date.getDay()
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const schedule = Array.isArray(item.schedule) ? item.schedule : []

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
    return (
        !clicked[index] ? <article className="habit-card habit-card--collapsed">
            <h2 className="habit-card__title">{item.title}</h2>
            <div className="habit-card__controls">
                <input
                    className="habit-card__checkbox"
                    disabled={!schedule.includes(days[day])}
                    checked={!!checked[index]}
                    type="checkbox"
                    name="checked"
                    onChange={(e) => handleCheck(e, index, id, date)}
                />
                <span className="habit-card__toggle" onClick={toggle}>
                    <RiArrowDropDownLine />
                </span>
            </div>
        </article> :
            <article className="HabitCard habit-card habit-card--expanded">
                <div className="habit-card__header">
                    <div className="habit-card__heading">
                        <h2>Title</h2>
                        <h3 className="habit-card__value">{item.title}</h3>
                    </div>
                    <div className="habit-card__controls">
                        <input
                            className="habit-card__checkbox"
                            type="checkbox"
                            name="checked"
                            checked={!!checked[index]}
                            disabled={!schedule.includes(days[day])}
                            onChange={(e) => handleCheck(e, index, id, date)}
                        />
                        <span className="habit-card__toggle" onClick={toggle}><RiArrowDropUpLine /></span>
                    </div>
                </div>
                
                
                <h2>Description</h2>
                <h4>{item.description}</h4>
                <h2>Days</h2>
                <ol>
                    {schedule.map((day, index) => (
                        <li key={index}>{day}</li>
                    ))}
                </ol>
                <h2>Streak: {streak[index]}</h2>
                <div className="habit-card__actions">
                    <button type="button" className="btn btn--secondary" onClick={handleEdit}>Edit</button>
                    <button type="button" className="btn btn--danger" onClick={() => handleDelete(id, index)}>Delete</button>
                </div>
            </article>
    );
}
