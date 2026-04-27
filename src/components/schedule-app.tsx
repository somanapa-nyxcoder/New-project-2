"use client";

import { useMemo, useState } from "react";
import { DaySchedule, EventType } from "@/lib/types";

type ViewMode = "today" | "week" | "month";

const EVENT_CLASS: Record<EventType, string> = {
  Cooking: "tag cooking",
  Groceries: "tag groceries",
  "No Cook": "tag no-cook",
  Carryover: "tag carryover",
};

interface ScheduleAppProps {
  today: DaySchedule;
  week: DaySchedule[];
  month: DaySchedule[];
}

export default function ScheduleApp({ today, week, month }: ScheduleAppProps) {
  const [view, setView] = useState<ViewMode>("today");
  const [selectedDate, setSelectedDate] = useState(today.dateKey);

  const selectedMonthDay = useMemo(
    () => month.find((day) => day.dateKey === selectedDate) ?? month[0],
    [month, selectedDate],
  );

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Roommate Meal Planner</p>
        <h1>Kitchen Rhythm, Simplified</h1>
        <p className="subtitle">Cooking on Mon/Wed/Fri. Groceries on Sun/Tue/Thu evenings.</p>
      </header>

      <nav className="tabs" aria-label="Views">
        <button className={view === "today" ? "tab active" : "tab"} onClick={() => setView("today")}>
          Today
        </button>
        <button className={view === "week" ? "tab active" : "tab"} onClick={() => setView("week")}>
          Week
        </button>
        <button className={view === "month" ? "tab active" : "tab"} onClick={() => setView("month")}>
          Month
        </button>
      </nav>

      {view === "today" ? <TodayView day={today} /> : null}
      {view === "week" ? <WeekView days={week} /> : null}
      {view === "month" ? <MonthView days={month} selectedDay={selectedMonthDay} onSelectDate={setSelectedDate} /> : null}
    </div>
  );
}

function TodayView({ day }: { day: DaySchedule }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>{day.fullDateLabel}</h2>
        <p>Cycle Week {day.cycleWeek}</p>
      </div>

      <div className="event-list">
        {day.events.length > 0 ? (
          day.events.map((event, index) => <EventCard key={`${event.type}-${index}`} event={event} />)
        ) : (
          <p className="empty">Nothing planned today.</p>
        )}
      </div>
    </section>
  );
}

function WeekView({ days }: { days: DaySchedule[] }) {
  return (
    <section className="panel week-grid">
      {days.map((day) => (
        <article className="mini-day" key={day.dateKey}>
          <p className="mini-date">{day.shortDateLabel}</p>
          <h3>{day.weekday}</h3>
          <div className="mini-events">
            {day.events.length > 0 ? (
              day.events.map((event, index) => (
                <div key={`${event.type}-${index}`} className="mini-event">
                  <span className={EVENT_CLASS[event.type]}>{event.type}</span>
                  <p>{event.title}</p>
                  {event.summary ? <p className="mini-summary">{event.summary}</p> : null}
                </div>
              ))
            ) : (
              <p className="empty">Not planned</p>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}

function MonthView({
  days,
  selectedDay,
  onSelectDate,
}: {
  days: DaySchedule[];
  selectedDay: DaySchedule;
  onSelectDate: (dateKey: string) => void;
}) {
  return (
    <section className="month-layout">
      <div className="month-grid">
        {days.map((day) => (
          <button
            className={selectedDay.dateKey === day.dateKey ? "month-cell active" : "month-cell"}
            key={day.dateKey}
            onClick={() => onSelectDate(day.dateKey)}
          >
            <div className="month-cell-top">
              <span>{day.shortDateLabel}</span>
            </div>
            <div className="month-cell-body">
              {day.events.slice(0, 2).map((event, index) => (
                <p key={`${event.type}-${index}`} className="month-line">
                  <span className={EVENT_CLASS[event.type]}>{event.type}</span>
                  {event.title}
                </p>
              ))}
              {day.events[0]?.summary ? <p className="month-summary">{day.events[0].summary}</p> : null}
              {day.events.length > 2 ? <p className="more-line">+{day.events.length - 2} more</p> : null}
            </div>
          </button>
        ))}
      </div>

      <aside className="detail-drawer">
        <h3>{selectedDay.fullDateLabel}</h3>
        <p className="cycle-pill">Cycle Week {selectedDay.cycleWeek}</p>
        {selectedDay.events.length > 0 ? (
          selectedDay.events.map((event, index) => <EventCard key={`${event.type}-${index}`} event={event} />)
        ) : (
          <p className="empty">Not planned</p>
        )}
      </aside>
    </section>
  );
}

function EventCard({ event }: { event: DaySchedule["events"][number] }) {
  return (
    <article className="event-card">
      <div className="event-meta">
        <span className={EVENT_CLASS[event.type]}>{event.type}</span>
        {event.timeLabel ? <span className="time-chip">{event.timeLabel}</span> : null}
      </div>
      <h4>{event.title}</h4>
      {event.summary ? <p className="event-summary">{event.summary}</p> : null}
      <ul>
        {event.details.map((detail, index) => (
          <li key={`${detail}-${index}`}>{detail}</li>
        ))}
      </ul>
      {event.notes ? <p className="note">Note: {event.notes}</p> : null}
    </article>
  );
}
