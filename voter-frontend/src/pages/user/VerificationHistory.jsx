import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Fingerprint,
  History,
  User,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Search,
} from "lucide-react";

function VerificationHistory() {
  const navigate = useNavigate();

  // Temporary frontend demo data.
  // Later this will come from Django.
  const records = [
    {
      id: "VER_4948B195",
      voterId: "V001",
      fingerprint: "68.63%",
      risk: "LOW",
      decision: "VERIFIED",
      date: "22 Sep 2026",
    },
    {
      id: "VER_942ADFD4",
      voterId: "V001",
      fingerprint: "6.90%",
      risk: "LOW",
      decision: "VERIFIED",
      date: "22 Sep 2026",
    },
    {
      id: "VER_4895823E",
      voterId: "V001",
      fingerprint: "6.90%",
      risk: "LOW",
      decision: "MANUAL_REVIEW",
      date: "22 Sep 2026",
    },
  ];

  return (
    <div className="user-layout">

      {/* SIDEBAR */}
      <aside className="user-sidebar">

        <div className="sidebar-brand">
          <ShieldCheck size={30} />
          <span>SecureVote AI</span>
        </div>

        <p className="sidebar-label">
          VOTER PORTAL
        </p>

        <nav className="sidebar-menu">

          <button
            className="sidebar-item"
            onClick={() => navigate("/user/dashboard")}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/user/verify")}
          >
            <Fingerprint size={19} />
            Start Verification
          </button>

          <button className="sidebar-item active">
            <History size={19} />
            Verification History
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/user/profile")}
          >
            <User size={19} />
            Profile
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-user">
            <div className="sidebar-avatar">
              PS
            </div>

            <div>
              <strong>Voter User</strong>
              <span>V001</span>
            </div>
          </div>

          <button
            className="sidebar-item logout-item"
            onClick={() => navigate("/login")}
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="user-main">

        <header className="dashboard-header">

          <div>
            <p className="dashboard-eyebrow">
              VERIFICATION RECORDS
            </p>

            <h1>Verification History</h1>

            <p>
              Review your previous identity verification attempts.
            </p>
          </div>

          <div className="header-security">
            <ShieldCheck size={18} />
            Secure Records
          </div>

        </header>

        {/* SUMMARY */}
        <section className="history-summary-grid">

          <HistorySummary
            title="Total Attempts"
            value="3"
            icon={<History />}
          />

          <HistorySummary
            title="Verified"
            value="2"
            icon={<CheckCircle2 />}
          />

          <HistorySummary
            title="Manual Review"
            value="1"
            icon={<AlertTriangle />}
          />

        </section>

        {/* HISTORY TABLE */}
        <section className="history-section">

          <div className="history-section-header">

            <div>
              <p className="small-label">
                ACTIVITY
              </p>

              <h2>Recent Verification Attempts</h2>
            </div>

            <div className="history-search">
              <Search size={16} />
              <input
                placeholder="Search verification ID"
              />
            </div>

          </div>

          <div className="history-table-wrapper">

            <table className="history-table">

              <thead>
                <tr>
                  <th>Verification ID</th>
                  <th>Date</th>
                  <th>Fingerprint</th>
                  <th>Risk</th>
                  <th>Decision</th>
                </tr>
              </thead>

              <tbody>

                {records.map((record) => (
                  <tr key={record.id}>

                    <td>
                      <div className="history-id">
                        <Clock3 size={15} />
                        {record.id}
                      </div>
                    </td>

                    <td>{record.date}</td>

                    <td>
                      {record.fingerprint}
                    </td>

                    <td>
                      <span className="risk-low">
                        {record.risk}
                      </span>
                    </td>

                    <td>
                      <DecisionBadge
                        decision={record.decision}
                      />
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

function HistorySummary({ title, value, icon }) {
  return (
    <div className="history-summary-card">

      <div className="history-summary-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

function DecisionBadge({ decision }) {
  if (decision === "VERIFIED") {
    return (
      <span className="decision-badge decision-verified">
        <CheckCircle2 size={13} />
        VERIFIED
      </span>
    );
  }

  return (
    <span className="decision-badge decision-review">
      <AlertTriangle size={13} />
      MANUAL REVIEW
    </span>
  );
}

export default VerificationHistory;