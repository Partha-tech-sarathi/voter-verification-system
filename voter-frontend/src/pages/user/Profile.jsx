import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Fingerprint,
  History,
  User,
  LogOut,
  Mail,
  BadgeCheck,
  LockKeyhole,
  Shield,
} from "lucide-react";

function Profile() {
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

          <button
            className="sidebar-item"
            onClick={() => navigate("/user/history")}
          >
            <History size={19} />
            Verification History
          </button>

          <button className="sidebar-item active">
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

      {/* MAIN */}
      <main className="user-main">

        <header className="dashboard-header">

          <div>
            <p className="dashboard-eyebrow">
              ACCOUNT
            </p>

            <h1>My Profile</h1>

            <p>
              View your SecureVote AI prototype account information.
            </p>
          </div>

          <div className="header-security">
            <ShieldCheck size={18} />
            Secure Account
          </div>

        </header>

        {/* PROFILE HERO */}
        <section className="profile-hero">

          <div className="profile-avatar">
            PS
          </div>

          <div className="profile-main-info">

            <div className="profile-name-row">
              <h2>Voter User</h2>

              <span className="profile-verified-badge">
                <BadgeCheck size={14} />
                Registered
              </span>
            </div>

            <p>SecureVote AI Voter Account</p>

            <span className="profile-voter-id">
              Voter ID: V001
            </span>

          </div>

        </section>

        {/* ACCOUNT INFORMATION */}
        <section className="profile-section">

          <div className="profile-section-heading">

            <div>
              <p className="small-label">
                PERSONAL INFORMATION
              </p>

              <h2>Account Details</h2>
            </div>

          </div>

          <div className="profile-info-grid">

            <ProfileItem
              icon={<User />}
              label="Full Name"
              value="Voter User"
            />

            <ProfileItem
              icon={<Mail />}
              label="Email Address"
              value="voter@example.com"
            />

            <ProfileItem
              icon={<BadgeCheck />}
              label="Voter ID"
              value="V001"
            />

            <ProfileItem
              icon={<Shield />}
              label="Account Status"
              value="ACTIVE"
            />

          </div>

        </section>

        {/* SECURITY */}
        <section className="profile-section">

          <div className="profile-section-heading">

            <div>
              <p className="small-label">
                SECURITY
              </p>

              <h2>Verification Security</h2>
            </div>

          </div>

          <div className="profile-security-grid">

            <SecurityItem
              icon={<Fingerprint />}
              title="Fingerprint Verification"
              text="Biometric verification is used as the primary identity check."
              status="Enabled"
            />

            <SecurityItem
              icon={<ShieldCheck />}
              title="AI Risk Analysis"
              text="Behavioral context is analyzed during verification."
              status="Enabled"
            />

            <SecurityItem
              icon={<LockKeyhole />}
              title="Fallback Authentication"
              text="Test OTP authentication is available when fingerprint verification fails."
              status="Enabled"
            />

          </div>

        </section>

        {/* PROTOTYPE NOTICE */}
        <section className="profile-prototype-note">

          <ShieldCheck size={21} />

          <div>
            <strong>Academic Research Prototype</strong>

            <p>
              Use synthetic or test identity information only.
              Real Aadhaar, PAN, phone numbers and raw biometric
              information must not be entered into this prototype.
            </p>
          </div>

        </section>

      </main>

    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="profile-info-item">

      <div className="profile-item-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

function SecurityItem({
  icon,
  title,
  text,
  status,
}) {
  return (
    <div className="profile-security-item">

      <div className="profile-security-icon">
        {icon}
      </div>

      <div className="profile-security-content">
        <strong>{title}</strong>
        <p>{text}</p>
      </div>

      <span className="profile-security-status">
        {status}
      </span>

    </div>
  );
}

export default Profile;