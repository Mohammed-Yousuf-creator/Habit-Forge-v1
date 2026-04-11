
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
    const [isLoadingItem, setIsLoadingItem] = React.useState(true)
    const [loadError, setLoadError] = React.useState("")
    const [formError, setFormError] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
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
            if (loading) {
                return
            }

            if (!currentUser) {
                setLoadError("You need to be logged in before editing a habit.")
                setIsLoadingItem(false)
                return
            }

            setLoadError("")
            setIsLoadingItem(true)
            try {
                const habit = await getHabit(id, currentUser.uid)
                setItem(habit)
                setNewItem(habit)
            } catch (error) {
                setLoadError(error?.message || "Unable to load this habit right now.")
                setItem(null)
                setNewItem(null)
            } finally {
                setIsLoadingItem(false)
            }
        }
        getHabits()
    }, [loading, currentUser, id])

    async function handleFormSubmit(formData) {
        const intent = formData.get("intent")
        if (intent !== "update") {
            navigate("/habits")
            return
        }

        if (isSubmitting) {
            return
        }

        if (loading || !currentUser || !item || !newItem) {
            setFormError("Unable to update this habit right now.")
            return
        }

        if (!Array.isArray(newItem.schedule) || newItem.schedule.length === 0) {
            setFormError("Please select at least one day for the habit schedule.")
            return
        }

        setFormError("")
        setIsSubmitting(true)
        const newHabit = {
            title: formData.get("title"),
            description: formData.get("description"),
            schedule: newItem.schedule,
            history: item.history
        }

        try {
            await updateHabit(id, currentUser.uid, newHabit)
            navigate("/habits")
        } catch (error) {
            setFormError(error?.message || "Unable to update this habit right now.")
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

    if (isLoadingItem) {
        return <h1>Loading...</h1>
    }

    if (loadError || !item || !newItem) {
        return (
            <main className="habit-editor-page">
                <section className="status-card" role="alert">
                    <h1>Unable to edit habit</h1>
                    <p>{loadError || "This habit could not be loaded."}</p>
                    <button className="btn btn--primary" type="button" onClick={() => navigate("/habits")}>Back to Habits</button>
                </section>
            </main>
        )
    }

    const isUnchanged = newItem.title === item.title
        && newItem.description === item.description
        && JSON.stringify(newItem.schedule) === JSON.stringify(item.schedule)

    return (
        <main className="habit-editor-page">
            <form action={handleFormSubmit} className="habit-form habit-form--update">
                <h1 className="habit-form__title">Update Habit</h1>
                {formError ? <p className="status-message status-message--error" role="alert">{formError}</p> : null}
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    required
                    name="title"
                    id="title"
                    placeholder="playing football"
                    defaultValue={item.title}
                    onChange={(event) => setNewItem({...newItem, title: event.target.value})}
                />
                <label htmlFor="description">Description</label>
                <textarea defaultValue={item.description} name="description" id="description" onChange={(event) => setNewItem({...newItem, description: event.target.value})}/>
                <label htmlFor="schedule">Schedule</label>
                <Select
                    options={dayOptions}
                    isMulti
                    name="schedule"
                    id="schedule"
                    className="habit-form__select"
                    classNamePrefix="habit-select"
                    isSearchable={true}
                    isClearable={true}
                    onChange={(s) => setNewItem({ ...newItem, schedule: s ? s.map(i => i.value).sort(sortInsert) : [] })}
                    defaultValue={(item.schedule || []).map(day => ({ value: day, label: day }))}
                />
                <div className="habit-form__actions">
                    <button className="btn btn--primary" disabled={isSubmitting || isUnchanged} name="intent" value="update" type="submit">{isSubmitting ? "Updating..." : "Update Habit"}</button>
                    <button className="btn btn--danger" name="intent" value="cancel" type="submit" disabled={isSubmitting}>Cancel</button>
                </div>
            </form>
        </main>
    );
}
