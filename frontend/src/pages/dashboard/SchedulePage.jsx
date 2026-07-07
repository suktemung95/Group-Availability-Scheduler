import DashboardLayout from "../../layouts/DashboardLayout"
import "./Schedule.css"

function SchedulePage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const hours = [
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
  ]

  return (
    <DashboardLayout
      activeNav="Schedule"
      eyebrow="Schedule"
      title="Your Weekly Schedule"
      subtitle="View and manage your availability blocks for the week."
    >
      <section className="schedule-page">
        <section className="schedule-stats-row">
          <article className="schedule-stat-card">
            <p className="schedule-stat-label">Total Free Hours</p>
            <h2 className="schedule-stat-value">21.5</h2>
            <p className="schedule-stat-text">30% of week</p>
          </article>

          <article className="schedule-stat-card">
            <p className="schedule-stat-label">Busy Hours</p>
            <h2 className="schedule-stat-value">28.0</h2>
            <p className="schedule-stat-text">39% of week</p>
          </article>

          <article className="schedule-stat-card">
            <p className="schedule-stat-label">Tentative Hours</p>
            <h2 className="schedule-stat-value">6.5</h2>
            <p className="schedule-stat-text">9% of week</p>
          </article>

          <article className="schedule-stat-card">
            <p className="schedule-stat-label">Best Day</p>
            <h2 className="schedule-stat-value">Thursday</h2>
            <p className="schedule-stat-text">5.5 free hours</p>
          </article>
        </section>

        <section className="schedule-main-grid">
          <section className="schedule-calendar-panel">
            <div className="schedule-toolbar">
              <div className="schedule-week-controls">
                <button type="button" className="schedule-small-button">‹</button>
                <button type="button" className="schedule-small-button">Today</button>
                <button type="button" className="schedule-small-button">›</button>
                <h2 className="schedule-range">May 12 - May 18, 2025</h2>
              </div>

              <div className="schedule-actions">
                <button type="button" className="schedule-small-button">Week</button>
                <button type="button" className="schedule-primary-button">+ Add Block</button>
              </div>
            </div>

            <div className="schedule-calendar">
              <div className="schedule-corner"></div>

              {days.map((day) => (
                <div key={day} className="schedule-day-header">
                  <p>{day}</p>
                  <span>May 12</span>
                </div>
              ))}

              {hours.map((hour) => (
                <>
                  <div key={`${hour}-label`} className="schedule-hour-label">
                    {hour}
                  </div>

                  {days.map((day) => (
                    <div key={`${day}-${hour}`} className="schedule-cell"></div>
                  ))}
                </>
              ))}

              {/* Temporary example blocks. Later these should be generated from backend data. */}
              <div className="schedule-block schedule-block-busy block-mon-8">
                <span>8:00 - 9:30</span>
                <strong>Team Standup</strong>
              </div>

              <div className="schedule-block schedule-block-free block-tue-9">
                <span>9:00 - 11:00</span>
                <strong>Free</strong>
              </div>

              <div className="schedule-block schedule-block-private block-wed-8">
                <span>8:00 - 10:00</span>
                <strong>Private</strong>
              </div>

              <div className="schedule-block schedule-block-free block-thu-8 selected-block">
                <span>8:00 - 10:30</span>
                <strong>Free</strong>
              </div>

              <div className="schedule-block schedule-block-tentative block-fri-11">
                <span>11:00 - 12:30</span>
                <strong>Focus Time?</strong>
              </div>
            </div>
          </section>

          <aside className="schedule-details-panel">
            <div className="details-header">
              <h2>Block Details</h2>
              <button type="button" className="details-close-button">×</button>
            </div>

            <span className="selected-pill">Selected Block</span>

            <div className="details-time">
              <h3>8:00 AM - 10:30 AM</h3>
              <p>Thursday, May 15</p>
            </div>

            <div className="details-list">
              <div>
                <span>Type</span>
                <strong>Free</strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>2h 30m</strong>
              </div>

              <div>
                <span>Repeats</span>
                <strong>Does not repeat</strong>
              </div>

              <div>
                <span>Notes</span>
                <strong>Morning availability before meetings.</strong>
              </div>
            </div>

            <button type="button" className="details-primary-button">
              Edit Block
            </button>

            <button type="button" className="details-secondary-button">
              Duplicate Block
            </button>

            <button type="button" className="details-secondary-button">
              Delete Block
            </button>

            <div className="schedule-legend">
              <h3>Legend</h3>

              <p><span className="legend-dot free"></span> Free</p>
              <p><span className="legend-dot busy"></span> Busy</p>
              <p><span className="legend-dot tentative"></span> Tentative</p>
              <p><span className="legend-dot private"></span> Private</p>
            </div>
          </aside>
        </section>
      </section>
    </DashboardLayout>
  )
}

export default SchedulePage