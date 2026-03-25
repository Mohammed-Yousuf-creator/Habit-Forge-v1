

import React from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { addHabit } from "../../firebaseFunction";
import { useAuth } from "../Context/authcontext";
export default function MakeHabit() {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayOptions = days.map(item => ({value: item, label: item}))
    const [selected, setSelected] = React.useState([])
    const {currentUser, loading} = useAuth()
    const navigate = useNavigate()
    async function handleFormSubmit(formData) {
        if (formData.get("Create")) {
            const habit = {
            title: formData.get("title"),
            description: formData.get("description"),
            schedule: selected,
        }
        if (!loading) {
            await addHabit(currentUser.uid, habit)
            navigate("/habits")
        }
        } else {
            navigate("/habits")
        }
        
       
    }
    function sortInsert(day1, day2) {
        if (days.indexOf(day1) > days.indexOf(day2)) {
            return 1
        }
        else if (days.indexOf(day1) < days.indexOf(day2)) {
            return -1
        }
        return 0
    }
    return (
        <form action={handleFormSubmit}>
            <label htmlFor="title">Title</label>
            <input type="text" required name="title" id="title" placeholder="playing football" />
            <label htmlFor="description">Description</label>
            <textarea name="description" id="description" />
            <label htmlFor="schedule">Schedule</label>
            <Select options={dayOptions} isMulti name="schedule" onChange={s =>  setSelected(s ? s.map(i => i.value).sort(sortInsert) : []) } id="schedule" />
            <button name="Create">Create Habit</button>
            <button name="Cancel">Cancel</button>
        </form>
    );
}
