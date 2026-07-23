import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../layouts/DashboardLayout"
import "./Schedule.css"
import apiRequest from "../../services/api"

const SCHEDULE_API_URL = `/schedule`

function SchedulePage() {
  const navigate = useNavigate()

  const [schedule, setSchedule] = useState([])
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const baseTimeZone = -4
  const [timeOffset, setTimeOffset] = useState(0)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const blockTypes = ["free", "busy", "tentative", "private"]
  const [editType, setEditType] = useState("free")
  const [editStartTime, setEditStartTime] = useState("")
  const [editEndTime, setEditEndTime] = useState("")
  const [editLabel, setEditLabel] = useState("")

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addDay, setAddDay] = useState("1")
  const [addType, setAddType] = useState("free")
  const [addStartTime, setAddStartTime] = useState("08:00")
  const [addEndTime, setAddEndTime] = useState("09:00")
  const [addLabel, setAddLabel] = useState("")

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const timeOptions = [
    "00:00", "00:30",
    "01:00", "01:30",
    "02:00", "02:30",
    "03:00", "03:30",
    "04:00", "04:30",
    "05:00", "05:30",
    "06:00", "06:30",
    "07:00", "07:30",
    "08:00", "08:30",
    "09:00", "09:30",
    "10:00", "10:30",
    "11:00", "11:30",
    "12:00", "12:30",
    "13:00", "13:30",
    "14:00", "14:30",
    "15:00", "15:30",
    "16:00", "16:30",
    "17:00", "17:30",
    "18:00", "18:30",
    "19:00", "19:30",
    "20:00", "20:30",
    "21:00", "21:30",
    "22:00", "22:30",
    "23:00", "23:30",
  ]

  const hours = [
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
  "11 PM",
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  ]

  const stats = calculateScheduleStats(schedule)

  async function fetchSchedule() {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("You are not logged in")
    }

    const data = await apiRequest(SCHEDULE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setSchedule(data.data)

    return data.data
  }

  useEffect(() => {
    async function loadSchedule() {
      try {
        await fetchSchedule()
      } catch (error) {
        setError(error.message)
        console.log(error)

        if (
          error.message === "Invalid or expired token" ||
          error.message === "You are not logged in"
        ) {
          localStorage.removeItem("token")
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    loadSchedule()
  }, [navigate])

  function calculateScheduleStats(scheduleData) {
    let freeHours = 0
    let busyHours = 0
    let tentativeHours = 0
    let privateHours = 0

    const dailyFreeHours = Array(7).fill(0)

    for (const block of scheduleData) {
      const blockHours = getBlockHours(block)

      if (block.block_type === "free") {
        freeHours += blockHours

        const dayIndex = Number(block.day_of_week) - 1
        dailyFreeHours[dayIndex] += blockHours
      }

      if (block.block_type === "busy") {
        busyHours += blockHours
      }

      if (block.block_type === "tentative") {
        tentativeHours += blockHours
      }

      if (block.block_type === "private") {
        privateHours += blockHours
      }
    }

    const bestDayFreeHours = Math.max(...dailyFreeHours)
    const bestDayIndex = bestDayFreeHours > 0 ? dailyFreeHours.indexOf(bestDayFreeHours) : null

    return {
      freeHours,
      busyHours,
      tentativeHours,
      privateHours,
      bestDayIndex,
      bestDayFreeHours,
    }
  }

  function getBlockHours(block) {
    const [startHour, startMinute] = block.start_time.split(":").map(Number)
    const [endHour, endMinute] = block.end_time.split(":").map(Number)

    return (endHour - startHour) + ((endMinute - startMinute) / 60)
  }

  function getWeekPercent(hours) {
    return `${((hours / 168) * 100).toFixed(0)}% of week`
  }

  function formatHours(hours) {
    return hours.toFixed(1)
  }

  function formatTime(time) {
    if (!time) return ""

    const [hourRaw, minuteRaw] = time.split(":").map(Number)
    const suffix = hourRaw >= 12 ? "PM" : "AM"
    const hour = hourRaw % 12 || 12
    const minute = String(minuteRaw).padStart(2, "0")

    return `${hour}:${minute} ${suffix}`
  }

  function getBlockClass(block) {
    const typeClass = `schedule-block-${block.block_type}`
    const selectedClass = selectedBlock?.id === block.id ? "selected-block" : ""

    return `schedule-block ${typeClass} ${selectedClass}`
  }

  function getBlockStyle(block) {
    const dayIndex = Number(block.day_of_week) - 1

    const [startHour, startMinute] = block.start_time.split(":").map(Number)
    const [endHour, endMinute] = block.end_time.split(":").map(Number)

    const calendarStartHour = 8
    const hourHeight = 48

    const startOffsetHours = (startHour - calendarStartHour) + (startMinute / 60)
    const durationHours = (endHour - startHour) + ((endMinute - startMinute) / 60)

    return {
      left: `calc(70px + ((100% - 70px) / 7) * ${dayIndex} + 8px)`,
      top: `calc(48px + ${startOffsetHours * hourHeight}px + 6px)`,
      width: "calc((100% - 70px) / 7 - 16px)",
      height: `${durationHours * hourHeight - 12}px`,
    }
  }

  function shiftTimeLeft() {
    setTimeOffset((prevOffset) => prevOffset - 1)
  }

  function shiftTimeRight() {
    setTimeOffset((prevOffset) => prevOffset + 1)
  }

  function getTimeZoneLabel() {
    const shownTimeZone = baseTimeZone + timeOffset
    return `TZ${shownTimeZone >= 0 ? "+" : ""}${shownTimeZone}`
  }

  function labelToHourNumber(label) {
    const [hourText, suffix] = label.split(" ")
    let hour = Number(hourText)

    if (suffix === "PM" && hour !== 12) {
      hour += 12
    }

    if (suffix === "AM" && hour === 12) {
      hour = 0
    }

    return hour
  }

  function formatHourLabel(hourNumber) {
    const normalizedHour = ((hourNumber % 24) + 24) % 24
    const suffix = normalizedHour >= 12 ? "PM" : "AM"
    const displayHour = normalizedHour % 12 || 12

    return `${displayHour} ${suffix}`
  }

  function getShiftedHourLabel(hourLabel) {
    const hourNumber = labelToHourNumber(hourLabel)
    return formatHourLabel(hourNumber + timeOffset)
  }

  function shiftTimeString(time) {
    if (!time) return ""

    const [hourRaw, minuteRaw] = time.split(":").map(Number)

    const shiftedHour = ((hourRaw + timeOffset) % 24 + 24) % 24
    const suffix = shiftedHour >= 12 ? "PM" : "AM"
    const displayHour = shiftedHour % 12 || 12
    const minute = String(minuteRaw).padStart(2, "0")

    return `${displayHour}:${minute} ${suffix}`
  }

  function cycleEditType() {
    const currentIndex = blockTypes.indexOf(editType)
    const nextIndex = (currentIndex + 1) % blockTypes.length
    const nextType = blockTypes[nextIndex]

    setEditType(nextType)

    if (nextType === "private") {
      setEditLabel("")
    }
  }

  function isEditFormValid() {
    if (!editType || !editStartTime || !editEndTime) return false
    return editStartTime < editEndTime
  }

  async function handleEditSubmit(event) {
    event.preventDefault()

    if (!selectedBlock || !isEditFormValid()) return

    try {
      const response = await apiRequest(`${SCHEDULE_API_URL}/${selectedBlock.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dow: Number(selectedBlock.day_of_week),
          start: editStartTime,
          end: editEndTime,
          block_type: editType,
          label: editType === "private" ? "" : editLabel
        }),
      })

      await fetchSchedule()

      setIsEditModalOpen(false)
    } catch (error) {
      setError(error.message)
      console.log(error)

      if (
        error.message === "Invalid or expired token" ||
        error.message === "You are not logged in"
      ) {
        localStorage.removeItem("token")
        navigate("/login")
      }
    }
  }

  function isAddFormValid() {
    if (!addDay || !addType || !addStartTime || !addEndTime) {
      return false
    }

    return addStartTime < addEndTime
  }

  function cycleAddType() {
    const currentIndex = blockTypes.indexOf(addType)
    const nextIndex = (currentIndex + 1) % blockTypes.length
    const nextType = blockTypes[nextIndex]

    setAddType(nextType)

    if (nextType === "private") {
      setAddLabel("")
    }
  }

  async function handleAddSubmit(event) {
    event.preventDefault()

    if (!isAddFormValid()) return

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("You are not logged in")
      }

      const response = await apiRequest(SCHEDULE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dow: Number(addDay),
          start: addStartTime,
          end: addEndTime,
          block_type: addType,
          label: addType === "private" ? "" : addLabel,
        }),
      })

      await fetchSchedule()
      setIsAddModalOpen(false)
    } catch (error) {
      setError(error.message)
      console.log(error)

      if (
        error.message === "Invalid or expired token" ||
        error.message === "You are not logged in"
      ) {
        localStorage.removeItem("token")
        navigate("/login")
      }
    }
  }

  async function handleDeleteBlock() {
    if (!selectedBlock) return

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("You are not logged in")
      }

      const response = await apiRequest(
        `${SCHEDULE_API_URL}/${selectedBlock.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      await fetchSchedule()

      setIsDeleteModalOpen(false)
      setSelectedBlock(null)
    } catch (error) {
      setError(error.message)
      console.log(error)

      if (
        error.message === "Invalid or expired token" ||
        error.message === "You are not logged in"
      ) {
        localStorage.removeItem("token")
        navigate("/login")
      }
    }
  }

  return (
    <DashboardLayout
      activeNav="Schedule"
      eyebrow="Schedule"
      title="Your Weekly Schedule"
      subtitle="View and manage your availability blocks for the week."
    >
      <section className="schedule-page">
        {error && <p className="schedule-error">{error}</p>}

        <section className="schedule-stats-row">
          <article className="schedule-stat-card">
            <p className="schedule-stat-label">Total Free Hours</p>
            <h2 className="schedule-stat-value">
              {loading ? "..." : formatHours(stats.freeHours)}
            </h2>
            <p className="schedule-stat-text">
              {loading ? "..." : getWeekPercent(stats.freeHours)}
            </p>
          </article>

          <article className="schedule-stat-card">
            <p className="schedule-stat-label">Busy Hours</p>
            <h2 className="schedule-stat-value">
              {loading ? "..." : formatHours(stats.busyHours)}
            </h2>
            <p className="schedule-stat-text">
              {loading ? "..." : getWeekPercent(stats.busyHours)}
            </p>
          </article>

          <article className="schedule-stat-card">
            <p className="schedule-stat-label">Tentative Hours</p>
            <h2 className="schedule-stat-value">
              {loading ? "..." : formatHours(stats.tentativeHours)}
            </h2>
            <p className="schedule-stat-text">
              {loading ? "..." : getWeekPercent(stats.tentativeHours)}
            </p>
          </article>

          <article className="schedule-stat-card">
            <p className="schedule-stat-label">Best Day</p>
            <h2 className="schedule-stat-value">
              {loading
                ? "..."
                : stats.bestDayIndex == null
                  ? "None"
                  : fullDays[stats.bestDayIndex]}
            </h2>
            <p className="schedule-stat-text">
              {loading ? "..." : `${formatHours(stats.bestDayFreeHours)} free hours`}
            </p>
          </article>
        </section>

        <section className="schedule-main-grid">
          <section className="schedule-calendar-panel">
            <div className="schedule-toolbar">
              <div className="schedule-week-controls">
                <button
                  type="button"
                  className="schedule-small-button"
                  onClick={shiftTimeLeft}
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="schedule-small-button schedule-timezone-button"
                >
                  {getTimeZoneLabel()}
                </button>

                <button
                  type="button"
                  className="schedule-small-button"
                  onClick={shiftTimeRight}
                >
                  ›
                </button>
                <h2 className="schedule-range">This Week</h2>
              </div>

              <div className="schedule-actions">
                <button type="button" className="schedule-small-button">Week</button>
                <button
                  type="button"
                  className="schedule-primary-button"
                  onClick={() => {
                    setAddDay("1")
                    setAddType("free")
                    setAddStartTime("08:00")
                    setAddEndTime("09:00")
                    setAddLabel("")
                    setIsAddModalOpen(true)
                  }}
                >
                  + Add Block
                </button>
              </div>
            </div>
            <div className="schedule-calendar-scroll">
              <div className="schedule-calendar">
                <div className="schedule-corner"></div>

                {days.map((day) => (
                  <div key={day} className="schedule-day-header">
                    <p>{day}</p>
                    <span>Current week</span>
                  </div>
                ))}

                {hours.map((hour) => (
                  <Fragment key={hour}>
                    <div className="schedule-hour-label">
                      {getShiftedHourLabel(hour)}
                    </div>

                    {days.map((day) => (
                      <div key={`${day}-${hour}`} className="schedule-cell"></div>
                    ))}
                  </Fragment>
                ))}

                {schedule.map((block) => (
                  <button
                    key={block.id}
                    type="button"
                    className={getBlockClass(block)}
                    style={getBlockStyle(block)}
                    onClick={() => setSelectedBlock(block)}
                  >
                    <span>
                      {shiftTimeString(block.start_time)} - {shiftTimeString(block.end_time)}
                    </span>
                    <strong>{block.label || block.block_type}</strong>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="schedule-details-panel">
            <div className="details-header">
              <h2>Block Details</h2>
              <button
                type="button"
                className="details-close-button"
                onClick={() => setSelectedBlock(null)}
              >
                ×
              </button>
            </div>

            {!selectedBlock ? (
              <div className="details-empty">
                <p>Select a block to view its details.</p>
              </div>
            ) : (
              <>
                <span className="selected-pill">Selected Block</span>

                <div className="details-time">
                  <h3>
                    {shiftTimeString(selectedBlock.start_time)} - {shiftTimeString(selectedBlock.end_time)}
                  </h3>
                  <p>
                    {fullDays[Number(selectedBlock.day_of_week) - 1]}
                  </p>
                </div>

                <div className="details-list">
                  <div>
                    <span>Type</span>
                    <strong>{selectedBlock.block_type}</strong>
                  </div>

                  <div>
                    <span>Duration</span>
                    <strong>{formatHours(getBlockHours(selectedBlock))} hours</strong>
                  </div>

                  <div>
                    <span>Label</span>
                    <strong>{selectedBlock.label || "No label"}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="details-primary-button"
                  onClick={() => {
                    setEditType(selectedBlock.block_type)
                    setEditStartTime(selectedBlock.start_time.slice(0, 5))
                    setEditEndTime(selectedBlock.end_time.slice(0, 5))
                    setEditLabel(selectedBlock.label || "")
                    setIsEditModalOpen(true)
                  }}
                >
                  Edit Block
                </button>

                <button
                  type="button"
                  className="details-secondary-button"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete Block
                </button>
              </>
            )}

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
      {isAddModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsAddModalOpen(false)}
        >
          <form
            className="edit-block-modal"
            onSubmit={handleAddSubmit}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Add Block</h2>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setIsAddModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <label className="modal-field">
                <span>Day</span>

                <select
                  value={addDay}
                  onChange={(event) => setAddDay(event.target.value)}
                >
                  {fullDays.map((day, index) => (
                    <option key={day} value={index + 1}>
                      {day}
                    </option>
                  ))}
                </select>
              </label>

              <label className="modal-field">
                <span>Block Type</span>

                <button
                  type="button"
                  className={`type-cycle-button type-${addType}`}
                  onClick={cycleAddType}
                >
                  {addType}
                </button>
              </label>

              <div className="modal-time-row">
                <label className="modal-field">
                  <span>Start Time</span>

                  <select
                    value={addStartTime}
                    onChange={(event) => setAddStartTime(event.target.value)}
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="modal-field">
                  <span>End Time</span>

                  <select
                    value={addEndTime}
                    onChange={(event) => setAddEndTime(event.target.value)}
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="modal-field">
                <span>Label</span>

                <textarea
                  value={addType === "private" ? "" : addLabel}
                  onChange={(event) => setAddLabel(event.target.value)}
                  placeholder={
                    addType === "private"
                      ? "Private blocks cannot have labels"
                      : "Add a label..."
                  }
                  rows="2"
                  disabled={addType === "private"}
                />
              </label>

              {!isAddFormValid() && (
                <p className="modal-error">
                  Start time must be before end time.
                </p>
              )}

              <button
                type="submit"
                className="modal-submit-button"
                disabled={!isAddFormValid()}
              >
                Add Block
              </button>
            </div>
          </form>
        </div>
      )}
      {isEditModalOpen && selectedBlock && (
        <div
          className="modal-backdrop"
          onClick={() => setIsEditModalOpen(false)}
        >
          <form
            className="edit-block-modal"
            onSubmit={handleEditSubmit}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Edit Block</h2>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setIsEditModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <label className="modal-field">
                <span>Block Type</span>
                <button
                  type="button"
                  className={`type-cycle-button type-${editType}`}
                  onClick={cycleEditType}
                >
                  {editType}
                </button>
              </label>

              <div className="modal-time-row">
                <label className="modal-field">
                  <span>Start Time</span>
                  <select
                    value={editStartTime}
                    onChange={(event) => setEditStartTime(event.target.value)}
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="modal-field">
                  <span>End Time</span>
                  <select
                    value={editEndTime}
                    onChange={(event) => setEditEndTime(event.target.value)}
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="modal-field">
                <span>Label</span>
                <textarea
                  value={editType === "private" ? "" : editLabel}
                  onChange={(event) => setEditLabel(event.target.value)}
                  placeholder={
                    editType === "private"
                      ? "Private blocks cannot have labels"
                      : "Add a label..."
                  }
                  rows="2"
                  disabled={editType === "private"}
                />
              </label>

              {!isEditFormValid() && (
                <p className="modal-error">
                  Start time must be before end time.
                </p>
              )}

              <button
                type="submit"
                className="modal-submit-button"
                disabled={!isEditFormValid()}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      {isDeleteModalOpen && selectedBlock && (
        <div
          className="modal-backdrop"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="edit-block-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Delete Block</h2>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete this block?
              </p>

              <p>
                <strong>
                  {fullDays[Number(selectedBlock.day_of_week) - 1]}
                </strong>
                {" — "}
                {formatTime(selectedBlock.start_time)}
                {" to "}
                {formatTime(selectedBlock.end_time)}
              </p>

              <div className="delete-modal-actions">
                <button
                  type="button"
                  className="details-secondary-button"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="modal-delete-button"
                  onClick={handleDeleteBlock}
                >
                  Delete Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default SchedulePage