import { useEffect, useState } from "react"
function DashboardPage() {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [user, setUser] = useState(null)
  const [schedule, setSchedule] = useState(null)
  const [groups, setGroups] = useState(null)  
  const [invites, setInvites] = useState(null)

  useEffect(() => {
    async function fetchData(url, setCallback) {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("You are not logged in")
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to load user")
      }

      console.log("Url:", url, "\nReturned:", data.data)
      setCallback(data.data)
    }

    async function loadDashboardData() {
      try {
        await fetchData("http://localhost:3000/users/me", setUser)
        await fetchData("http://localhost:3000/schedule/", setSchedule)
        await fetchData("http://localhost:3000/groups/list", setGroups)
        await fetchData("http://localhost:3000/invites/list", setInvites)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}>
          <div style={styles.logoMark}>GA</div>
          <div>
            <h2 style={styles.logoText}>GroupAvail</h2>
            <p style={styles.logoSubtext}>Scheduler</p>
          </div>
        </div>

        <nav style={styles.nav}>
          <button style={{ ...styles.navItem, ...styles.navItemActive }}>
            <span style={styles.navIcon}>▦</span>
            Overview
          </button>

          <button style={styles.navItem}>
            <span style={styles.navIcon}>□</span>
            Schedule
          </button>

          <button style={styles.navItem}>
            <span style={styles.navIcon}>◉</span>
            Groups
          </button>

          <button style={styles.navItem}>
            <span style={styles.navIcon}>✉</span>
            Invites
          </button>

          <button style={styles.navItem}>
            <span style={styles.navIcon}>⇄</span>
            Overlap
          </button>

          <button style={styles.navItem}>
            <span style={styles.navIcon}>⚙</span>
            Settings
          </button>
        </nav>

        <div style={styles.sidebarCard}>
          <p style={styles.sidebarCardLabel}>Current Week</p>
          <h3 style={styles.sidebarCardTitle}>Availability</h3>

          <div style={styles.miniProgressOuter}>
            <div style={styles.miniProgressInner}></div>
          </div>

          <p style={styles.sidebarCardText}>
            Your schedule setup is partially complete.
          </p>
        </div>
      </aside>

      <section style={styles.mainContent}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Overview</p>
            <h1 style={styles.title}>
              {loading || !user ? "Dashboard" : `${user.username}'s Dashboard`}
            </h1>
            <p style={styles.subtitle}>
              Manage your availability, groups, invites, and shared free time.
            </p>
          </div>

          <div style={styles.headerActions}>
            <button type="button" style={styles.iconButton}>
              ⌕
            </button>
            <button type="button" style={styles.logoutButton}>
              Log Out
            </button>
          </div>
        </header>

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
              <p style={styles.cardLabel}>Shared Free Time</p>
              <span style={styles.cardBadge}>Overlap</span>
            </div>

            <h2 style={styles.statValue}>6h</h2>
            <p style={styles.statText}>Estimated shared availability this week</p>

            <button type="button" style={styles.cardButton}>
              Check Overlap
            </button>
          </article>
        </section>

        <section style={styles.contentGrid}>
          <article style={styles.largePanel}>
            <div style={styles.panelHeader}>
              <div>
                <p style={styles.panelLabel}>Schedule Preview</p>
                <h2 style={styles.panelTitle}>This Week</h2>
              </div>

              <button type="button" style={styles.smallPanelButton}>
                Edit
              </button>
            </div>

            <div style={styles.weekList}>
              <div style={styles.dayRow}>
                <span style={styles.dayLabel}>Mon</span>
                <div style={styles.dayTrack}>
                  <div style={{ ...styles.dayFill, width: "65%" }}></div>
                </div>
                <span style={styles.dayText}>3 blocks</span>
              </div>

              <div style={styles.dayRow}>
                <span style={styles.dayLabel}>Tue</span>
                <div style={styles.dayTrack}>
                  <div style={{ ...styles.dayFill, width: "40%" }}></div>
                </div>
                <span style={styles.dayText}>2 blocks</span>
              </div>

              <div style={styles.dayRow}>
                <span style={styles.dayLabel}>Wed</span>
                <div style={styles.dayTrack}>
                  <div style={{ ...styles.dayFill, width: "75%" }}></div>
                </div>
                <span style={styles.dayText}>4 blocks</span>
              </div>

              <div style={styles.dayRow}>
                <span style={styles.dayLabel}>Thu</span>
                <div style={styles.dayTrack}>
                  <div style={{ ...styles.dayFill, width: "55%" }}></div>
                </div>
                <span style={styles.dayText}>2 blocks</span>
              </div>

              <div style={styles.dayRow}>
                <span style={styles.dayLabel}>Fri</span>
                <div style={styles.dayTrack}>
                  <div style={{ ...styles.dayFill, width: "30%" }}></div>
                </div>
                <span style={styles.dayText}>1 block</span>
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
                <p style={styles.panelLabel}>Invites</p>
                <h2 style={styles.panelTitle}>Pending</h2>
              </div>
            </div>

            <div style={styles.inviteBox}>
              <p style={styles.inviteTitle}>2 invites waiting</p>
              <p style={styles.inviteText}>
                Later, this card will use your group invite endpoints.
              </p>

              <button type="button" style={styles.dangerButton}>
                Review Invites
              </button>
            </div>
          </article>

          <article style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <p style={styles.panelLabel}>Overlap Finder</p>
                <h2 style={styles.panelTitle}>Best Match</h2>
              </div>
            </div>

            <div style={styles.overlapCard}>
              <div style={styles.circleOuter}>
                <div style={styles.circleInner}>
                  <span style={styles.circleValue}>72%</span>
                  <span style={styles.circleLabel}>match</span>
                </div>
              </div>

              <p style={styles.overlapText}>
                Best shared window appears to be Thursday evening.
              </p>
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    display: "grid",
    gridTemplateColumns: "260px minmax(0, 1fr)",
    background: "#111318",
    color: "#f9fafb",
    fontFamily: "Arial, sans-serif",
    overflow: "hidden",
},
  sidebar: {
    background: "#171a21",
    borderRight: "1px solid #2a2f3a",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logoMark: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  },

  logoText: {
    margin: 0,
    fontSize: "18px",
    color: "#ffffff",
  },

  logoSubtext: {
    margin: "3px 0 0",
    fontSize: "12px",
    color: "#8b93a7",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  navItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    border: "none",
    borderRadius: "10px",
    background: "transparent",
    color: "#a4acbd",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    textAlign: "left",
  },

  navItemActive: {
    background: "#dc2626",
    color: "#ffffff",
  },

  navIcon: {
    width: "20px",
    textAlign: "center",
    fontSize: "15px",
  },

  sidebarCard: {
    marginTop: "auto",
    background: "#f9fafb",
    color: "#111827",
    borderRadius: "18px",
    padding: "18px",
  },

  sidebarCardLabel: {
    margin: "0 0 6px",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  sidebarCardTitle: {
    margin: "0 0 16px",
    fontSize: "18px",
  },

  miniProgressOuter: {
    width: "100%",
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "12px",
  },

  miniProgressInner: {
    width: "68%",
    height: "100%",
    background: "#dc2626",
    borderRadius: "999px",
  },

  sidebarCardText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  mainContent: {
    width: "100%",
    minWidth: 0,
    padding: "28px",
    overflowY: "auto",
},

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    marginBottom: "26px",
  },

  eyebrow: {
    margin: "0 0 8px",
    color: "#ef4444",
    fontSize: "13px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  title: {
    margin: "0 0 8px",
    fontSize: "34px",
    color: "#ffffff",
  },

  subtitle: {
    margin: 0,
    color: "#9ca3af",
    fontSize: "15px",
    lineHeight: "1.6",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  iconButton: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border: "1px solid #2f3542",
    background: "#1f232c",
    color: "#ffffff",
    fontSize: "18px",
    cursor: "pointer",
  },

  logoutButton: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #7f1d1d",
    background: "#1f232c",
    color: "#fecaca",
    fontWeight: "800",
    cursor: "pointer",
  },

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
    gridTemplateColumns: "1.5fr 1fr 1fr",
    gap: "20px",
    width: "100%",
},

  largePanel: {
    background: "#20242d",
    border: "1px solid #2f3542",
    borderRadius: "20px",
    padding: "22px",
    minHeight: "320px",
    boxShadow: "0 18px 35px rgba(0, 0, 0, 0.22)",
    gridColumn: "span 2",
},

  panel: {
    background: "#20242d",
    border: "1px solid #2f3542",
    borderRadius: "20px",
    padding: "22px",
    minHeight: "260px",
    boxShadow: "0 18px 35px rgba(0, 0, 0, 0.22)",
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
    gridTemplateColumns: "48px 1fr 76px",
    alignItems: "center",
    gap: "14px",
  },

  dayLabel: {
    color: "#d1d5db",
    fontWeight: "800",
    fontSize: "13px",
  },

  dayTrack: {
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