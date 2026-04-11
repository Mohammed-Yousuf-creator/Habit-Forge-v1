

import React from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { addHabit } from "../../firebaseFunction";
import { useAuth } from "../Context/authcontext";
export default function MakeHabit() {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayOptions = days.map(item => ({value: item, label: item}))
    const [selected, setSelected] = React.useState([])
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [formError, setFormError] = React.useState("")
    const {currentUser, loading} = useAuth()
    const navigate = useNavigate()

    async function handleFormSubmit(formData) {
        if (isSubmitting) {
            return
        }

        if (loading || !currentUser) {
            setFormError("You need to be logged in before creating a habit.")
            return
        }

        if (selected.length === 0) {
            setFormError("Please select at least one day for the habit schedule.")
            return
        }

        setFormError("")
        setIsSubmitting(true)
        const habit = {
            title: formData.get("title"),
            description: formData.get("description"),
            schedule: selected,
        }

        try {
            await addHabit(currentUser.uid, habit)
            navigate("/habits")
        } catch (error) {
            setFormError(error?.message || "Unable to create habit right now.")
        } finally {
            setIsSubmitting(false)
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
        <main className="habit-editor-page">
            <form action={handleFormSubmit} className="habit-form habit-form--create">
                <h1 className="habit-form__title">Create Habit</h1>
                {formError ? <p className="status-message status-message--error" role="alert">{formError}</p> : null}
                <label htmlFor="title">Title</label>
                <input type="text" required name="title" id="title" placeholder="playing football" />
                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" />
                <label htmlFor="schedule">Schedule</label>
                <Select
                    options={dayOptions}
                    isMulti
                    name="schedule"
                    className="habit-form__select"
                    classNamePrefix="habit-select"
                    onChange={s =>  setSelected(s ? s.map(i => i.value).sort(sortInsert) : []) }
                    id="schedule"
                />
                <div className="habit-form__actions">
                    <button className="btn btn--primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Habit"}</button>
                    <button className="btn btn--danger" type="button" onClick={() => navigate("/habits")} disabled={isSubmitting}>Cancel</button>
                </div>
            </form>
        </main>
    );
}
