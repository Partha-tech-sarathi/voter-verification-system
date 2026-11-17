import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Fingerprint,
  History,
  User,
  LogOut,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Shield,
} from "lucide-react";

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="user-layout">

      {/* SIDEBAR */}
      <aside className="user-sidebar">

        <div className="sidebar-brand">
          <ShieldCheck size={30} />
          <span>SecureVote AI</span>
        </div>

        <p className="sidebar-label">VOTER PORTAL</p>

        <nav className="sidebar-menu">

          <button className="sidebar-item active">
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

          <button
            className="sidebar-item"
            onClick={() => navigate("/user/history")}
          >
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
            <div className="sidebar-avatar">PS</div>

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

      {/* MAIN AREA */}
      <main className="user-main">

        {/* HEADER */}
        <header className="dashboard-header">

          <div>
            <p className="dashboard-eyebrow">
              VOTER DASHBOARD
            </p>

            <h1>Welcome back</h1>

            <p>
              Manage your identity verification securely.
            </p>
          </div>

          <div className="header-security">
            <ShieldCheck size={18} />
            Secure Session
          </div>

        </header>

        {/* STATUS */}
        <section className="verification-status-card">

          <div className="status-left">

            <div className="status-icon">
              <Shield size={30} />
            </div>

            <div>
              <p className="small-label">
                CURRENT VERIFICATION STATUS
              </p>

              <h2>Ready for Verification</h2>

              <p>
                Complete biometric and AI-assisted verification
                to confirm your identity.
              </p>
            </div>

          </div>

          <button
            className="btn-primary dashboard-start-button"
            onClick={() => navigate("/user/verify")}
          >
            Start Verification
            <ArrowRight size={18} />
          </button>

        </section>

        {/* QUICK INFORMATION */}
        <section className="dashboard-info-grid">

          <DashboardCard
            icon={<Fingerprint />}
            title="Biometric Verification"
            value="Fingerprint"
            text="Primary identity verification"
          />

          <DashboardCard
            icon={<ShieldCheck />}
            title="AI Risk Analysis"
            value="XGBoost"
            text="Behavioral security assessment"
          />

          <DashboardCard
            icon={<CheckCircle2 />}
            title="Audit Security"
            value="SHA-256"
            text="Tamper-evident verification log"
          />

        </section>

        {/* PROCESS */}
        <section className="dashboard-section">

          <div className="dashboard-section-heading">
            <div>
              <p className="small-label">
                VERIFICATION WORKFLOW
              </p>

              <h2>How your verification works</h2>
            </div>
          </div>

          <div className="dashboard-process">

            <ProcessItem
              number="01"
              title="Identity"
              text="Confirm your voter identity."
            />

            <ProcessArrow />

            <ProcessItem
              number="02"
              title="Fingerprint"
              text="Perform biometric matching."
            />

            <ProcessArrow />

            <ProcessItem
              number="03"
              title="AI Risk"
              text="Analyze behavioral context."
            />

            <ProcessArrow />

            <ProcessItem
              number="04"
              title="Decision"
              text="Generate verification outcome."
            />

            <ProcessArrow />

            <ProcessItem
              number="05"
              title="Audit"
              text="Securely record the event."
            />

          </div>

        </section>

        {/* RECENT ACTIVITY */}
        <section className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>
              <p className="small-label">
                RECENT ACTIVITY
              </p>

              <h2>Verification History</h2>
            </div>

            <button
              className="dashboard-text-button"
              onClick={() => navigate("/user/history")}
            >
              View All
              <ArrowRight size={16} />
            </button>

          </div>

          <div className="empty-activity">

            <div className="empty-activity-icon">
              <Clock3 size={25} />
            </div>

            <div>
              <strong>No recent verification activity</strong>

              <p>
                Your completed verification attempts will
                appear here.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

function DashboardCard({ icon, title, value, text }) {
  return (
    <div className="dashboard-info-card">

      <div className="dashboard-card-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <p>{text}</p>
      </div>

    </div>
  );
}

function ProcessItem({ number, title, text }) {
  return (
    <div className="process-item">

      <div className="process-number">
        {number}
      </div>

      <strong>{title}</strong>

      <span>{text}</span>

    </div>
  );
}

function ProcessArrow() {
  return (
    <ArrowRight
      className="process-arrow"
      size={20}
    />
  );
}

export default UserDashboard;