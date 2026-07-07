import "./DashboardLayout.css"
import { useNavigate } from "react-router-dom"
function DashboardLayout({ eyebrow, title, subtitle, activeNav, children }) {

    const navigate = useNavigate()

    function getNavStyle(label) {
        if (activeNav === label) {
            return { ...styles.navItem, ...styles.navItemActive, cursor: "not-allowed"}
        }
        return styles.navItem
    }
    return (
        <main className="dashboard-page">
            <aside className="dashboard-sidebar">
                <div className="logo-section">
                    <div className="logo-mark">GA</div>
                    <div>
                    <h2 className="logo-text">GroupAvail</h2>
                    <p className="logo-subtext">Scheduler</p>
                    </div>
                </div>

                <nav className="dashboard-nav">
                    <button
                        className={`nav-item ${
                            activeNav === "Overview" ? "nav-item-active" : "nav-hover"
                        }`}
                        disabled={activeNav === "Overview"}
                        onClick={() => navigate("/dashboard")}
                    >
                        <span className="nav-icon">▦</span>
                        Overview
                    </button>

                    <button
                        className={`nav-item ${
                            activeNav === "Schedule" ? "nav-item-active" : "nav-hover"
                        }`}
                        disabled={activeNav === "Schedule"}
                        onClick={() => navigate("/dashboard/schedule")}
                        >
                        <span className="nav-icon">□</span>
                        Schedule
                    </button>

                    <button
                        className={`nav-item ${
                            activeNav === "Groups" ? "nav-item-active" : "nav-hover"
                        }`}
                        disabled={activeNav === "Groups"}
                        onClick={() => navigate("/dashboard/groups")}
                    >
                        <span className="nav-icon">◉</span>
                        Groups
                    </button>

                    <button
                        className={`nav-item ${
                            activeNav === "Invites" ? "nav-item-active" : "nav-hover"
                        }`}
                        disabled={activeNav === "Invites"}
                        onClick={() => navigate("/dashboard/invites")}
                    >
                        <span className="nav-icon">✉</span>
                        Invites
                    </button>

                    <button
                        className={`nav-item ${
                            activeNav === "Overlap" ? "nav-item-active" : "nav-hover"
                        }`}
                        disabled={activeNav === "Overlap"}
                        onClick={() => navigate("/dashboard/overlap")}
                    >
                        <span className="nav-icon">⇄</span>
                        Overlap
                    </button>

                    <button
                        className={`nav-item ${
                            activeNav === "Settings" ? "nav-item-active" : "nav-hover"
                        }`}
                        disabled={activeNav === "Settings"}
                        onClick={() => navigate("/dashboard/settings")}
                    >
                        <span className="nav-icon">⚙</span>
                        Settings
                    </button>
                </nav>

                <div className="sidebar-card">
                    <p className="sidebar-card-label">Current Week</p>
                    <h3 className="sidebar-card-title">Availability</h3>

                    <div className="mini-progress-outer">
                    <div className="mini-progress-inner"></div>
                    </div>

                    <p className="sidebar-card-text">
                    Your schedule setup is partially complete.
                    </p>
                </div>
            </aside>

            <section className="dashboard-main-content">
                <header className="dashboard-header">
                    <div>
                    <p className="dashboard-eyebrow">{eyebrow}</p>
                    <h1 className="dashboard-title">{title}</h1>
                    <p className="dashboard-subtitle">{subtitle}</p>
                    </div>

                    <div className="header-actions">
                    <button type="button" className="icon-button">
                        ⌕
                    </button>
                    <button type="button" className="logout-button">
                        Log Out
                    </button>
                    </div>
                </header>

                <div className="dashboard-body">
                    {children}
                </div>
            </section>
        </main>
    )
}


export default DashboardLayout