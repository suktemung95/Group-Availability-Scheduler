function DashboardPage() {
  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Group Availability Scheduler</p>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>
              Manage your weekly availability, groups, invites, and overlap checks.
            </p>
          </div>

          <button type="button" style={styles.logoutButton}>
            Log Out
          </button>
        </header>

        <section style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Schedule Blocks</p>
            <h2 style={styles.summaryValue}>--</h2>
            <p style={styles.summaryText}>Free, busy, tentative, and private blocks</p>
          </div>

          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Groups</p>
            <h2 style={styles.summaryValue}>--</h2>
            <p style={styles.summaryText}>Groups you own or belong to</p>
          </div>

          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Pending Invites</p>
            <h2 style={styles.summaryValue}>--</h2>
            <p style={styles.summaryText}>Invites waiting for a response</p>
          </div>
        </section>

        <section style={styles.contentGrid}>
          <article style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>Your Schedule</h2>
                <p style={styles.panelText}>
                  View and edit your availability blocks for the week.
                </p>
              </div>
            </div>

            <div style={styles.placeholderList}>
              <div style={styles.placeholderItem}>
                <span style={styles.dotFree}></span>
                <div>
                  <p style={styles.itemTitle}>Free blocks</p>
                  <p style={styles.itemText}>Times you are available to meet</p>
                </div>
              </div>

              <div style={styles.placeholderItem}>
                <span style={styles.dotBusy}></span>
                <div>
                  <p style={styles.itemTitle}>Busy blocks</p>
                  <p style={styles.itemText}>Times you are unavailable</p>
                </div>
              </div>

              <div style={styles.placeholderItem}>
                <span style={styles.dotTentative}></span>
                <div>
                  <p style={styles.itemTitle}>Tentative blocks</p>
                  <p style={styles.itemText}>Times that may or may not work</p>
                </div>
              </div>
            </div>

            <button type="button" style={styles.primaryButton}>
              View Schedule
            </button>
          </article>

          <article style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>Groups</h2>
                <p style={styles.panelText}>
                  Open a group to compare member availability.
                </p>
              </div>
            </div>

            <div style={styles.emptyBox}>
              <p style={styles.emptyTitle}>No groups loaded yet</p>
              <p style={styles.emptyText}>
                Later, this panel will show groups from your backend.
              </p>
            </div>

            <button type="button" style={styles.secondaryButton}>
              View Groups
            </button>
          </article>

          <article style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>Invites</h2>
                <p style={styles.panelText}>
                  Accept, decline, or review group invitations.
                </p>
              </div>
            </div>

            <div style={styles.emptyBox}>
              <p style={styles.emptyTitle}>No invites loaded yet</p>
              <p style={styles.emptyText}>
                This will eventually call your group invite endpoints.
              </p>
            </div>

            <button type="button" style={styles.secondaryButton}>
              View Invites
            </button>
          </article>

          <article style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>Overlap Finder</h2>
                <p style={styles.panelText}>
                  Find shared free time between two users or a whole group.
                </p>
              </div>
            </div>

            <div style={styles.overlapPreview}>
              <div style={styles.timeBlock}>
                <span style={styles.time}>Mon</span>
                <div style={styles.timeBar}></div>
              </div>

              <div style={styles.timeBlock}>
                <span style={styles.time}>Tue</span>
                <div style={styles.timeBarShort}></div>
              </div>

              <div style={styles.timeBlock}>
                <span style={styles.time}>Wed</span>
                <div style={styles.timeBarMedium}></div>
              </div>
            </div>

            <button type="button" style={styles.primaryButton}>
              Check Overlap
            </button>
          </article>
        </section>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
    padding: "32px 20px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "18px",
    marginBottom: "28px",
  },

  eyebrow: {
    margin: "0 0 8px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  title: {
    margin: "0 0 8px",
    fontSize: "36px",
    color: "#111827",
  },

  subtitle: {
    margin: "0 auto",
    maxWidth: "620px",
    color: "#6b7280",
    fontSize: "16px",
    lineHeight: "1.6",
  },

  logoutButton: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
    fontWeight: "600",
    cursor: "pointer",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },

  summaryCard: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "22px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e5e7eb",
    textAlign: "center",
  },

  summaryLabel: {
    margin: "0 0 10px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#6b7280",
  },

  summaryValue: {
    margin: "0 0 8px",
    fontSize: "32px",
    color: "#111827",
  },

  summaryText: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  panel: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "20px",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    width: "100%",
  },

  panelTitle: {
    margin: "0 0 6px",
    fontSize: "21px",
    color: "#111827",
  },

  panelText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  placeholderList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
  },

  placeholderItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "10px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  },

  dotFree: {
    width: "12px",
    height: "12px",
    borderRadius: "999px",
    background: "#22c55e",
    flexShrink: 0,
  },

  dotBusy: {
    width: "12px",
    height: "12px",
    borderRadius: "999px",
    background: "#ef4444",
    flexShrink: 0,
  },

  dotTentative: {
    width: "12px",
    height: "12px",
    borderRadius: "999px",
    background: "#f59e0b",
    flexShrink: 0,
  },

  itemTitle: {
    margin: "0 0 3px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },

  itemText: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
  },

  emptyBox: {
    padding: "24px",
    borderRadius: "12px",
    background: "#f9fafb",
    border: "1px dashed #cbd5e1",
    textAlign: "center",
  },

  emptyTitle: {
    margin: "0 0 6px",
    fontWeight: "700",
    color: "#374151",
  },

  emptyText: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  overlapPreview: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    padding: "16px",
    borderRadius: "12px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  },

  timeBlock: {
    display: "grid",
    gridTemplateColumns: "48px 1fr",
    alignItems: "center",
    gap: "12px",
  },

  time: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#374151",
  },

  timeBar: {
    height: "12px",
    borderRadius: "999px",
    background: "#bfdbfe",
    width: "85%",
  },

  timeBarShort: {
    height: "12px",
    borderRadius: "999px",
    background: "#bfdbfe",
    width: "45%",
  },

  timeBarMedium: {
    height: "12px",
    borderRadius: "999px",
    background: "#bfdbfe",
    width: "65%",
  },

  primaryButton: {
    marginTop: "auto",
    padding: "12px 14px",
    borderRadius: "9px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    width: "180px",
  },

  secondaryButton: {
    marginTop: "auto",
    padding: "12px 14px",
    borderRadius: "9px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
    fontWeight: "700",
    cursor: "pointer",
    width: "180px",
  },
}

export default DashboardPage