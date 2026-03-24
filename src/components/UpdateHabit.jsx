
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { getHabit, updateHabit } from "../../firebaseFunction";
import { useAuth } from "../Context/authcontext";
export default function UpdateHabit() {
    const { id } = useParams()
    const { currentUser, loading } = useAuth()
    const [item, setItem] = React.useState(null)
    const [newItem, setNewItem] = React.useState(null)
    let navigate = useNavigate()

    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    const dayOptions = days.map((item) => ({ value: item, label: item }));
    React.useEffect(() => {
        async function getHabits() {
            let item
            if (!loading) {
                item = await getHabit(id, currentUser.uid)
            }
            setItem(item)
            setNewItem(item)
        }
        getHabits()
    }, [loading])
    async function handleFormSubmit(formData) {
        const newHabit = {
            title: formData.get("title"),
            description: formData.get("description"),
            schedule: newItem.schedule,
            history: item.history
        }
        
        if (!loading) {
            await updateHabit(id, currentUser.uid, newHabit)
        }

        navigate("/habits")
    }
    return (
        !item ? <h1>Loading...</h1> :
            <form action={handleFormSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    required
                    name="title"
                    id="title"
                    placeholder="playing football"
                    defaultValue={item.title}
                />
                <label htmlFor="description">Description</label>
                <textarea defaultValue={item.description} name="description" id="description" />
                <label htmlFor="schedule">Schedule</label>
                <Select
                    options={dayOptions}
                    isMulti
                    name="schedule"
                    id="schedule"
                    isSearchable={true}
                    isClearable={true}
                    onChange={(s) => setNewItem({ ...item, schedule: s ? s.map(i => {
                        if (i.value === "sunday") {
                            return i.value
                        } else if (i.value === "monday") {
                            return i.value
                        } else if (i.value === "tuesday") {
                            return i.value
                        } else if (i.value === "wednesday") {
                            return i.value
                        } else if (i.value === "thursday") {
                            return i.value
                        } else if (i.value === "friday") {
                            return i.value
                        } else {
                            return i.value
                        }
                    }) : [] })}
                    defaultValue={item.schedule.map(day => ({ value: day, label: day }))}
                />
                <button disabled={newItem == item}>update Habit</button>
                <button onClick={() => navigate("/habits")}>Cancel</button>
            </form>
    );
}
