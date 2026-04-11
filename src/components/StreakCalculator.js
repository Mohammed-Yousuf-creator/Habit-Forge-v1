export default function streakCalculator(schedule, history, startDate) {
    if (!Array.isArray(schedule) || !Array.isArray(history) || schedule.length === 0 || history.length === 0) {
        return 0;
    }

    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const normalizedSchedule = schedule
        .filter((day) => typeof day === "string")
        .map((day) => day.toLowerCase())
        .filter((day) => days.includes(day));

    if (normalizedSchedule.length === 0) {
        return 0;
    }

    function normalizeDate(dateValue) {
        const date = dateValue instanceof Date ? new Date(dateValue) : new Date(dateValue);
        if (Number.isNaN(date.getTime())) {
            return null;
        }
        date.setHours(0, 0, 0, 0);
        return date;
    }

    const today = normalizeDate(new Date());
    if (!today) {
        return 0;
    }

    const normalizedHistoryDates = history
        .map((date) => normalizeDate(date))
        .filter(Boolean);

    if (normalizedHistoryDates.length === 0) {
        return 0;
    }

    const startFromInput = normalizeDate(startDate);
    const earliestHistoryDate = normalizedHistoryDates.reduce((currentEarliest, date) =>
        date < currentEarliest ? date : currentEarliest,
    normalizedHistoryDates[0]);

    let start = startFromInput || earliestHistoryDate;
    if (start > today) {
        start = today;
    }

    const historyDayKeys = new Set(
        normalizedHistoryDates.map((date) => date.toDateString()),
    );
    const todayKey = today.toDateString();

    let count = 0;
    for (let d = new Date(today); d >= start; d.setDate(d.getDate() - 1)) {
        const dayKey = d.toDateString();

        if (!normalizedSchedule.includes(days[d.getDay()])) {
            continue;
        }

        if (historyDayKeys.has(dayKey)) {
            count += 1;
            continue;
        }

        // Keep today's scheduled slot "in progress" until it is checked,
        // so yesterday's streak is preserved during the day.
        if (dayKey === todayKey) {
            continue;
        }

        break;
    }

    return count;
}