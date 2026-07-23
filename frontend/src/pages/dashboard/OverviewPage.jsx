import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from '../../layouts/DashboardLayout'
import apiRequest from "../../services/api"
function DashboardPage() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [user, setUser] = useState(null)

  const [schedule, setSchedule] = useState(null)
  const [freeHours, setFreeHours] = useState(null)
  const [dailyFreeHours, setDailyFreeHours] = useState(null)
  const [bestDay, setBestDay] = useState(null)

  const [groups, setGroups] = useState(null)  

  const [invites, setInvites] = useState(null)

  function intToDay(dayIndex) {
    const conversion = [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ]
    return conversion[dayIndex]
  }

  function getDayWidth(dayIndex) {
    if (!freeHours || freeHours <= 0) return "0%"

    return `${((dailyFreeHours[dayIndex] / 24) * 100).toFixed(0)}%`
  }

  function getCircleDegrees(dayIndex) {
    if (!freeHours || freeHours <= 0 || dayIndex == null) return 0

    return (dailyFreeHours[dayIndex] / 24) * 360
  }

  const degrees = getCircleDegrees(bestDay)
  
  useEffect(() => {
    async function fetchData(url, setCallback) {

      const data = await apiRequest(url)

      setCallback(data.data)
      return data.data
    }

    function countFreeHours(scheduleData) {
      
      let totalHours = 0
      const dailyHours = Array(7).fill(0)
      for (const block of scheduleData) {
        if (block.block_type !== "free") continue

        const start = block.start_time.split(":").map(Number)
        const end = block.end_time.split(":").map(Number)

        const blockHours = (end[0] - start[0]) + ((end[1] - start[1]) / 60)
        totalHours += blockHours

        const dow = Number(block.day_of_week) - 1
        dailyHours[dow] += blockHours
        
      }
      setFreeHours(totalHours)
      setDailyFreeHours(dailyHours)

      const maxFreeHours = Math.max(...dailyHours)
      const maxHoursIndex = dailyHours.indexOf(maxFreeHours)
      setBestDay(maxHoursIndex)
    }

    async function loadDashboardData() {
      try {
        await fetchData("/users/me", setUser)
        const scheduleData = await fetchData("/schedule", setSchedule)
        await fetchData("/groups/list", setGroups)
        await fetchData("/invites/list", setInvites)

        countFreeHours(scheduleData)
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
    loadDashboardData()
  }, [])


  return (
    <DashboardLayout
      eyebrow="Overview"
      title={loading || !user ? "Loading Dashboard..." : `${user.username}'s Dashboard`}
      subtitle="Manage your availability, groups, invites, and shared free time."
      activeNav="Overview"
    >
      <section style={styles.statsGrid}>
        <article style={styles.statCard}>
          <div style={styles.cardTopRow}>
            <p style={styles.cardLabel}>Schedule Blocks</p>
            <span style={styles.cardBadge}>This week</span>
          </div>

          <h2 style={styles.statValue}>
            {loading || !schedule ? "..." : schedule.length}
          </h2>
          <p style={styles.statText}>Free, busy, tentative, and private blocks</p>

          <button type="button" style={styles.cardButton}>
            View Schedule
          </button>
        </article>

        <article style={styles.statCard}>
          <div style={styles.cardTopRow}>
            <p style={styles.cardLabel}>Groups</p>
            <span style={styles.cardBadge}>Active</span>
          </div>

          <h2 style={styles.statValue}>
            {loading || !groups ? "..." : groups.length}
          </h2>
          <p style={styles.statText}>Groups you own or belong to</p>

          <button type="button" style={styles.cardButton}>
            View Groups
          </button>
        </article>

        <article style={styles.statCard}>
          <div style={styles.cardTopRow}>
            <p style={styles.cardLabel}>Pending Invites</p>
            { invites?.length > 0 ? (
              <span style={styles.cardBadgeRed}>Needs review</span>
            ) : (
              <span style={styles.cardBadge}>None!</span>
            )}
          </div>

          <h2 style={styles.statValue}>
            {loading || !invites ? "..." : invites.length}
          </h2>
          <p style={styles.statText}>Invitations waiting for your response</p>

          <button type="button" style={styles.cardButton}>
            View Invites
          </button>
        </article>

        <article style={styles.statCard}>
          <div style={styles.cardTopRow}>
            <p style={styles.cardLabel}>Your free time</p>
            <span style={styles.cardBadge}>Total</span>
          </div>

          <h2 style={styles.statValue}>
            { loading || freeHours == null ? "..." : freeHours}
          </h2>
          <p style={styles.statText}>Your availability this week</p>

          <button type="button" style={styles.cardButton}>
            Check Overlap
          </button>
        </article>
      </section>

      <section style={styles.contentGrid}>
            <article style={styles.largePanel}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelLabel}>Your Schedule</p>
                  <h2 style={styles.panelTitle}>Free Time Preview</h2>
                </div>

                <button type="button" style={styles.smallPanelButton}>
                  Edit
                </button>
              </div>

              <div style={styles.weekList}>
                <div style={styles.dayRow}>
                  <span style={styles.dayLabel}>Mon</span>
                  <div style={styles.dayTrack}>
                    <div style={{ ...styles.dayFill, width: getDayWidth(0) }}></div>
                  </div>
                  <span style={styles.dayText}>
                    { loading || !dailyFreeHours ? "..." : dailyFreeHours[0] + " hours" }
                  </span>
                </div>

                <div style={styles.dayRow}>
                  <span style={styles.dayLabel}>Tue</span>
                  <div style={styles.dayTrack}>
                    <div style={{ ...styles.dayFill, width: getDayWidth(1) }}></div>
                  </div>
                  <span style={styles.dayText}>
                    { loading || !dailyFreeHours ? "..." : dailyFreeHours[1] + " hours" }
                  </span>
                </div>

                <div style={styles.dayRow}>
                  <span style={styles.dayLabel}>Wed</span>
                  <div style={styles.dayTrack}>
                    <div style={{ ...styles.dayFill, width: getDayWidth(2) }}></div>
                  </div>
                  <span style={styles.dayText}>
                    { loading || !dailyFreeHours ? "..." : dailyFreeHours[2] + " hours" }
                  </span>
                </div>

                <div style={styles.dayRow}>
                  <span style={styles.dayLabel}>Thu</span>
                  <div style={styles.dayTrack}>
                    <div style={{ ...styles.dayFill, width: getDayWidth(3) }}></div>
                  </div>
                  <span style={styles.dayText}>
                    { loading || !dailyFreeHours ? "..." : dailyFreeHours[3] + " hours" }
                  </span>
                </div>

                <div style={styles.dayRow}>
                  <span style={styles.dayLabel}>Fri</span>
                  <div style={styles.dayTrack}>
                    <div style={{ ...styles.dayFill, width: getDayWidth(4) }}></div>
                  </div>
                  <span style={styles.dayText}>
                    { loading || !dailyFreeHours ? "..." : dailyFreeHours[4] + " hours" }
                  </span>
                </div>

                <div style={styles.dayRow}>
                  <span style={styles.dayLabel}>Sat</span>
                  <div style={styles.dayTrack}>
                    <div style={{ ...styles.dayFill, width: getDayWidth(5) }}></div>
                  </div>
                  <span style={styles.dayText}>
                    { loading || !dailyFreeHours ? "..." : dailyFreeHours[5] + " hours" }
                  </span>
                </div>

                <div style={styles.dayRow}>
                  <span style={styles.dayLabel}>Sun</span>
                  <div style={styles.dayTrack}>
                    <div style={{ ...styles.dayFill, width: getDayWidth(6) }}></div>
                  </div>
                  <span style={styles.dayText}>
                    { loading || !dailyFreeHours ? "..." : dailyFreeHours[6] + " hours" }
                  </span>
                </div>
              </div>
            </article>

            <article style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelLabel}>Groups</p>
                  <h2 style={styles.panelTitle}>Recent Groups</h2>
                </div>
              </div>

              <div style={styles.groupList}>
                <div style={styles.listItem}>
                  <div style={styles.avatar}>V</div>
                  <div>
                    <p style={styles.listTitle}>Volleyball Friends</p>
                    <p style={styles.listText}>5 members</p>
                  </div>
                </div>

                <div style={styles.listItem}>
                  <div style={styles.avatar}>C</div>
                  <div>
                    <p style={styles.listTitle}>CS Project Team</p>
                    <p style={styles.listText}>3 members</p>
                  </div>
                </div>

                <div style={styles.listItem}>
                  <div style={styles.avatar}>W</div>
                  <div>
                    <p style={styles.listTitle}>Weekend Plans</p>
                    <p style={styles.listText}>4 members</p>
                  </div>
                </div>
              </div>
            </article>

            <article style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelLabel}>Best Day</p>
                  <h2 style={styles.panelTitle}>Most Free Time</h2>
                </div>
              </div>

              <div style={styles.overlapCard}>
                <div style={{
                  ...styles.circleOuter,
                  background: `conic-gradient(#dc2626 0deg ${degrees}deg, #2f3542 ${degrees}deg 360deg)`,
                  }}>
                  <div style={styles.circleInner}>
                    <span style={styles.circleValue}>{
                      loading || bestDay == null ? "0%" : getDayWidth(bestDay)}</span>
                    <span style={styles.circleLabel}>free</span>
                  </div>
                </div>

                <p style={styles.overlapText}>
                  {
                    loading || bestDay == null ? (
                      "Loading..."
                    ) : (
                      `Your freest day appears to be ${intToDay(bestDay)}.`
                    )
                  }
                </p>
              </div>
            </article>
      </section>
    </DashboardLayout>
  )
}

const styles = {
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "20px",
    width: "100%",
  },

  statCard: {
    background: "#20242d",
    border: "1px solid #2f3542",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 18px 35px rgba(0, 0, 0, 0.25)",
  },

  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },

  cardLabel: {
    margin: 0,
    color: "#d1d5db",
    fontSize: "14px",
    fontWeight: "800",
  },

  cardBadge: {
    padding: "5px 8px",
    borderRadius: "999px",
    background: "#2f3542",
    color: "#cbd5e1",
    fontSize: "11px",
    fontWeight: "800",
  },

  cardBadgeRed: {
    padding: "5px 8px",
    borderRadius: "999px",
    background: "#7f1d1d",
    color: "#fecaca",
    fontSize: "11px",
    fontWeight: "800",
  },

  statValue: {
    margin: "0 0 8px",
    color: "#ffffff",
    fontSize: "38px",
    lineHeight: 1,
  },

  statText: {
    minHeight: "42px",
    margin: "0 0 18px",
    color: "#9ca3af",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  cardButton: {
    width: "100%",
    padding: "11px 12px",
    borderRadius: "999px",
    border: "none",
    background: "#ffffff",
    color: "#111827",
    fontWeight: "800",
    cursor: "pointer",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.75fr .75fr 0.5fr",
    gap: "20px",
    width: "100%",
    alignItems: "stretch",
  },

  largePanel: {
    background: "#20242d",
    border: "1px solid #2f3542",
    borderRadius: "20px",
    padding: "22px",
    minHeight: "360px",
    boxShadow: "0 18px 35px rgba(0, 0, 0, 0.22)",
  },

  panel: {
    background: "#20242d",
    border: "1px solid #2f3542",
    borderRadius: "20px",
    padding: "22px",
    minHeight: "360px",
    boxShadow: "0 18px 35px rgba(0, 0, 0, 0.22)",
    display: "flex",
    flexDirection: "column",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "22px",
  },

  panelLabel: {
    margin: "0 0 6px",
    color: "#ef4444",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  panelTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "22px",
  },

  smallPanelButton: {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid #2f3542",
    background: "#171a21",
    color: "#d1d5db",
    fontWeight: "800",
    cursor: "pointer",
  },

  weekList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  dayRow: {
    display: "grid",
    gridTemplateColumns: "40px minmax(0, 1fr) max-content",
    alignItems: "center",
    gap: "10px",
  },

  dayLabel: {
    color: "#d1d5db",
    fontWeight: "800",
    fontSize: "13px",
  },

  dayTrack: {
    minWidth: 0,
    height: "14px",
    background: "#111318",
    borderRadius: "999px",
    overflow: "hidden",
    border: "1px solid #2f3542",
  },

  dayFill: {
    height: "100%",
    background: "#dc2626",
    borderRadius: "999px",
  },

  dayText: {
    color: "#9ca3af",
    fontSize: "13px",
    textAlign: "right",
    whiteSpace: "nowrap",
  },

  groupList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  listItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "14px",
    background: "#171a21",
    border: "1px solid #2f3542",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    background: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  listTitle: {
    margin: "0 0 4px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "800",
  },

  listText: {
    margin: 0,
    color: "#9ca3af",
    fontSize: "13px",
  },

  inviteBox: {
    background: "#171a21",
    border: "1px solid #2f3542",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
  },

  inviteTitle: {
    margin: "0 0 8px",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "900",
  },

  inviteText: {
    margin: "0 0 18px",
    color: "#9ca3af",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  dangerButton: {
    padding: "11px 14px",
    borderRadius: "999px",
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    fontWeight: "900",
    cursor: "pointer",
  },

  overlapCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "18px",
  },

  circleOuter: {
    width: "150px",
    height: "150px",
    borderRadius: "999px",
    background:
      "conic-gradient(#dc2626 0deg 260deg, #2f3542 260deg 360deg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  circleInner: {
    width: "108px",
    height: "108px",
    borderRadius: "999px",
    background: "#20242d",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  circleValue: {
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: "900",
    lineHeight: 1,
  },

  circleLabel: {
    color: "#9ca3af",
    fontSize: "12px",
    marginTop: "6px",
    textTransform: "uppercase",
    fontWeight: "800",
  },

  overlapText: {
    margin: 0,
    color: "#9ca3af",
    fontSize: "14px",
    lineHeight: "1.5",
    textAlign: "center",
  },
}

export default DashboardPage