import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../layouts/DashboardLayout"
import "./Overlaps.css"

const GROUPS_API_URL = "http://localhost:3000/groups"

function Overlaps() {
  const navigate = useNavigate()

  const [mutualMembers, setMutualMembers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [overlapBlocks, setOverlapBlocks] = useState([])

  const [loadingMembers, setLoadingMembers] = useState(true)
  const [loadingOverlap, setLoadingOverlap] = useState(false)
  const [error, setError] = useState("")

  const baseTimeZone = -4
  const [timeOffset, setTimeOffset] = useState(0)

  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]

  const fullDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
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

  useEffect(() => {
    async function loadMutualMembers() {
      setLoadingMembers(true)
      setError("")

      try {
        const members = await fetchMutualMembers()

        setMutualMembers(members)

        if (members.length > 0) {
          setSelectedUserId(String(members[0].user_id))
        }
      } catch (apiError) {
        handleApiError(apiError)
      } finally {
        setLoadingMembers(false)
      }
    }

    loadMutualMembers()
  }, [])

  useEffect(() => {
    if (!selectedUserId) {
      setOverlapBlocks([])
      return
    }

    fetchOverlap(selectedUserId)
  }, [selectedUserId])

  async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("You are not logged in")
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    let responseData = null

    try {
      responseData = await response.json()
    } catch {
      responseData = null
    }

    if (!response.ok) {
      throw new Error(
        responseData?.message ||
          responseData?.error ||
          `Request failed with status ${response.status}`
      )
    }

    return responseData
  }

  function getResponseData(responseData) {
    if (!responseData) {
      return null
    }

    if (responseData.data !== undefined) {
      return responseData.data
    }

    return responseData
  }

  function handleApiError(apiError) {
    setError(apiError.message)
    console.error(apiError)

    if (
      apiError.message === "Invalid or expired token" ||
      apiError.message === "You are not logged in"
    ) {
      localStorage.removeItem("token")
      navigate("/login")
    }
  }

  async function fetchMutualMembers() {
    const responseData = await apiRequest(
      `${GROUPS_API_URL}/mutualMembers`
    )

    const memberData = getResponseData(responseData)

    return Array.isArray(memberData) ? memberData : []
  }

  async function fetchOverlap(userId) {
    if (!userId) {
      setOverlapBlocks([])
      return
    }

    setLoadingOverlap(true)
    setError("")

    try {
      const responseData = await apiRequest(
        `${GROUPS_API_URL}/${userId}/overlap`
      )

      const overlapData = getResponseData(responseData)

      setOverlapBlocks(
        Array.isArray(overlapData) ? overlapData : []
      )
    } catch (apiError) {
      setOverlapBlocks([])
      handleApiError(apiError)
    } finally {
      setLoadingOverlap(false)
    }
  }

  function getSelectedMember() {
    return mutualMembers.find(
      (member) =>
        String(member.user_id) === String(selectedUserId)
    )
  }

  function getMemberName(member) {
    if (!member) {
      return "Unknown user"
    }

    return member.username || `User #${member.user_id}`
  }

  function timeToMinutes(time) {
    if (!time) {
      return null
    }

    const match = String(time)
      .trim()
      .match(/^(\d{1,2}):(\d{2})/)

    if (!match) {
      return null
    }

    const hour = Number(match[1])
    const minute = Number(match[2])

    if (
      !Number.isInteger(hour) ||
      !Number.isInteger(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return null
    }

    return hour * 60 + minute
  }

  function getBlockHours(block) {
    const startMinutes = timeToMinutes(block.start)
    const endMinutes = timeToMinutes(block.end)

    if (
      startMinutes === null ||
      endMinutes === null
    ) {
      return 0
    }

    let durationMinutes = endMinutes - startMinutes

    if (durationMinutes <= 0) {
      durationMinutes += 24 * 60
    }

    return durationMinutes / 60
  }

  function calculateOverlapStats(blocks) {
    let sharedFreeHours = 0
    const dailyHours = Array(7).fill(0)

    for (const block of blocks) {
      const blockHours = getBlockHours(block)
      const dayIndex = Number(block.dow) - 1

      sharedFreeHours += blockHours

      if (dayIndex >= 0 && dayIndex <= 6) {
        dailyHours[dayIndex] += blockHours
      }
    }

    const bestDayHours = Math.max(...dailyHours)

    const bestDayIndex =
      bestDayHours > 0
        ? dailyHours.indexOf(bestDayHours)
        : null

    return {
      sharedFreeHours,
      blockCount: blocks.length,
      bestDayHours,
      bestDayIndex,
    }
  }

  function getBlockStyle(block) {
    const dayIndex = Number(block.dow) - 1
    const startMinutes = timeToMinutes(block.start)
    const endMinutes = timeToMinutes(block.end)

    if (
      !Number.isInteger(dayIndex) ||
      dayIndex < 0 ||
      dayIndex > 6 ||
      startMinutes === null ||
      endMinutes === null
    ) {
      console.error("Invalid overlap block:", block)
      return null
    }

    const calendarStartMinutes = 8 * 60
    const minutesPerDay = 24 * 60
    const headerHeight = 48
    const hourHeight = 48

    let adjustedStartMinutes = startMinutes
    let adjustedEndMinutes = endMinutes

    /*
      The calendar begins at 8 AM and continues through 7 AM.

      Therefore:
      8 AM stays at 480 minutes.
      Midnight becomes 1440 minutes.
      1 AM becomes 1500 minutes.
    */
    if (adjustedStartMinutes < calendarStartMinutes) {
      adjustedStartMinutes += minutesPerDay
    }

    if (adjustedEndMinutes < calendarStartMinutes) {
      adjustedEndMinutes += minutesPerDay
    }

    if (adjustedEndMinutes <= adjustedStartMinutes) {
      adjustedEndMinutes += minutesPerDay
    }

    const startOffsetMinutes =
      adjustedStartMinutes - calendarStartMinutes

    const durationMinutes =
      adjustedEndMinutes - adjustedStartMinutes

    const top =
      headerHeight +
      (startOffsetMinutes / 60) * hourHeight +
      6

    const height =
      (durationMinutes / 60) * hourHeight - 12

    return {
      left: `calc(70px + ((100% - 70px) / 7) * ${dayIndex} + 8px)`,
      top: `${top}px`,
      width: "calc((100% - 70px) / 7 - 16px)",
      height: `${Math.max(height, 24)}px`,
    }
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
    const normalizedHour =
      ((hourNumber % 24) + 24) % 24

    const suffix =
      normalizedHour >= 12 ? "PM" : "AM"

    const displayHour =
      normalizedHour % 12 || 12

    return `${displayHour} ${suffix}`
  }

  function getShiftedHourLabel(hourLabel) {
    const hourNumber = labelToHourNumber(hourLabel)

    return formatHourLabel(
      hourNumber + timeOffset
    )
  }

  function shiftTimeString(time) {
    const timeMinutes = timeToMinutes(time)

    if (timeMinutes === null) {
      return ""
    }

    const originalHour = Math.floor(timeMinutes / 60)
    const minute = timeMinutes % 60

    const shiftedHour =
      ((originalHour + timeOffset) % 24 + 24) % 24

    const suffix =
      shiftedHour >= 12 ? "PM" : "AM"

    const displayHour =
      shiftedHour % 12 || 12

    return `${displayHour}:${String(minute).padStart(
      2,
      "0"
    )} ${suffix}`
  }

  function shiftTimeLeft() {
    setTimeOffset(
      (previousOffset) => previousOffset - 1
    )
  }

  function shiftTimeRight() {
    setTimeOffset(
      (previousOffset) => previousOffset + 1
    )
  }

  function getTimeZoneLabel() {
    const shownTimeZone =
      baseTimeZone + timeOffset

    return `TZ${
      shownTimeZone >= 0 ? "+" : ""
    }${shownTimeZone}`
  }

  function formatHours(hoursValue) {
    return Number(hoursValue || 0).toFixed(1)
  }

  const selectedMember = getSelectedMember()
  const stats = calculateOverlapStats(overlapBlocks)
  const sharedFreeHours = stats.sharedFreeHours

  return (
    <DashboardLayout
      activeNav="Overlap"
      eyebrow="Overlap"
      title="Schedule Overlap"
      subtitle="Compare your availability with another group member."
    >
      <section className="overlaps-page">
        {error && (
          <p className="overlaps-error">
            {error}
          </p>
        )}

        <section className="overlaps-stats-row">
          <article className="overlaps-stat-card">
            <p className="overlaps-stat-label">
              Shared Free Hours
            </p>

            <h2 className="overlaps-stat-value">
              {loadingOverlap
                ? "..."
                : formatHours(sharedFreeHours)}
            </h2>

            <p className="overlaps-stat-text">
              Total weekly overlap
            </p>
          </article>

          <article className="overlaps-stat-card">
            <p className="overlaps-stat-label">
              Overlap Blocks
            </p>

            <h2 className="overlaps-stat-value">
              {loadingOverlap
                ? "..."
                : stats.blockCount}
            </h2>

            <p className="overlaps-stat-text">
              Separate matching periods
            </p>
          </article>

          <article className="overlaps-stat-card">
            <p className="overlaps-stat-label">
              Best Day
            </p>

            <h2 className="overlaps-stat-value">
              {loadingOverlap
                ? "..."
                : stats.bestDayIndex === null
                  ? "None"
                  : fullDays[stats.bestDayIndex]}
            </h2>

            <p className="overlaps-stat-text">
              {loadingOverlap
                ? "..."
                : `${formatHours(
                    stats.bestDayHours
                  )} shared hours`}
            </p>
          </article>

          <article className="overlaps-stat-card">
            <p className="overlaps-stat-label">
              Comparing With
            </p>

            <h2 className="overlaps-stat-value overlaps-users-value">
              {selectedMember
                ? getMemberName(selectedMember)
                : "Select a user"}
            </h2>

            <p className="overlaps-stat-text">
              Your schedule plus theirs
            </p>
          </article>
        </section>

        <section className="overlaps-main-grid">
          <section className="overlaps-calendar-panel">
            <div className="overlaps-toolbar">
              <div className="overlaps-week-controls">
                <button
                  type="button"
                  className="overlaps-small-button"
                  onClick={shiftTimeLeft}
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="overlaps-small-button overlaps-timezone-button"
                >
                  {getTimeZoneLabel()}
                </button>

                <button
                  type="button"
                  className="overlaps-small-button"
                  onClick={shiftTimeRight}
                >
                  ›
                </button>

                <h2 className="overlaps-range">
                  This Week
                </h2>
              </div>

              <button
                type="button"
                className="overlaps-small-button"
                onClick={() =>
                  fetchOverlap(selectedUserId)
                }
                disabled={
                  loadingOverlap ||
                  !selectedUserId
                }
              >
                {loadingOverlap
                  ? "Loading..."
                  : "Refresh"}
              </button>
            </div>

            <div className="overlaps-calendar-scroll">
              <div className="overlaps-calendar">
                <div className="overlaps-corner" />

                {days.map((day) => (
                  <div
                    key={day}
                    className="overlaps-day-header"
                  >
                    <p>{day}</p>
                    <span>Current week</span>
                  </div>
                ))}

                {hours.map((hour) => (
                  <Fragment key={hour}>
                    <div className="overlaps-hour-label">
                      {getShiftedHourLabel(hour)}
                    </div>

                    {days.map((day) => (
                      <div
                        key={`${day}-${hour}`}
                        className="overlaps-cell"
                      />
                    ))}
                  </Fragment>
                ))}

                {!loadingOverlap &&
                  overlapBlocks.map((block, index) => {
                    const blockStyle =
                      getBlockStyle(block)

                    if (!blockStyle) {
                      return null
                    }

                    return (
                      <div
                        key={`${block.dow}-${block.start}-${block.end}-${index}`}
                        className="overlap-block"
                        style={blockStyle}
                      >
                        <span>
                          {shiftTimeString(block.start)}
                          {" – "}
                          {shiftTimeString(block.end)}
                        </span>

                        <strong>Both Free</strong>
                      </div>
                    )
                  })}
              </div>
            </div>

            {!loadingOverlap &&
              selectedUserId &&
              overlapBlocks.length === 0 && (
                <div className="overlaps-calendar-message">
                  No shared availability was found with
                  this user.
                </div>
              )}
          </section>

          <aside className="overlaps-selector-panel">
            <div className="overlaps-selector-header">
              <span className="overlaps-selector-pill">
                Compare Schedules
              </span>

              <h2>Select a User</h2>
            </div>

            {loadingMembers ? (
              <div className="overlaps-selector-empty">
                <p>Loading mutual members...</p>
              </div>
            ) : mutualMembers.length === 0 ? (
              <div className="overlaps-selector-empty">
                <p>
                  You do not share a group with any
                  other users.
                </p>
              </div>
            ) : (
              <>
                <label className="overlaps-selector-field">
                  <span>
                    Compare your schedule with
                  </span>

                  <select
                    value={selectedUserId}
                    onChange={(event) =>
                      setSelectedUserId(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Select a user
                    </option>

                    {mutualMembers.map((member) => (
                      <option
                        key={member.user_id}
                        value={member.user_id}
                      >
                        {member.username}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="overlaps-selection-summary">
                  <div>
                    <span>First Schedule</span>
                    <strong>You</strong>
                  </div>

                  <div>
                    <span>Compared With</span>

                    <strong>
                      {selectedMember
                        ? selectedMember.username
                        : "Not selected"}
                    </strong>
                  </div>

                  <div>
                    <span>Shared Hours</span>

                    <strong>
                      {loadingOverlap
                        ? "Loading..."
                        : formatHours(
                            sharedFreeHours
                          )}
                    </strong>
                  </div>
                </div>

                <div className="overlaps-legend">
                  <h3>Legend</h3>

                  <p>
                    <span className="overlaps-legend-dot" />
                    You and the selected user are both
                    free
                  </p>
                </div>
              </>
            )}
          </aside>
        </section>
      </section>
    </DashboardLayout>
  )
}

export default Overlaps