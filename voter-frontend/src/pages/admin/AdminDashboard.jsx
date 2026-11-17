import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  AlertTriangle,
  BrainCircuit,
  Link2,
  LogOut,
  CheckCircle2,
  Fingerprint,
  Activity,
  Clock3,
  ShieldAlert,
  Database,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  // Temporary values from our tested backend.
  // Later these will come directly from Django APIs.
  const stats = {
    total_voters: 1,
    total_verifications: 10,
    verified: 6,
    fallback_required: 1,
    manual_review: 2,
    high_risk: 2,
    ml_risk_threshold: 0.37,
    total_audit_records: 13,
  };

  const blockchain = {
    valid: true,
    total_blocks: 13,
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-sidebar-brand">
          <ShieldCheck size={29} />
          <div>
            <strong>SecureVote AI</strong>
            <span>Administration</span>
          </div>
        </div>

        <p className="admin-sidebar-label">
          SYSTEM MANAGEMENT
        </p>

        <nav className="admin-sidebar-menu">

          <AdminNav
            icon={<LayoutDashboard />}
            text="Dashboard"
            active
          />

          <AdminNav
            icon={<Users />}
            text="Voters"
            onClick={() => navigate("/admin/voters")}
          />

          <AdminNav
            icon={<ClipboardCheck />}
            text="Verifications"
            onClick={() => navigate("/admin/verifications")}
          />

          <AdminNav
            icon={<AlertTriangle />}
            text="Manual Review"
            onClick={() => navigate("/admin/manual-review")}
          />

          <AdminNav
            icon={<BrainCircuit />}
            text="AI Risk Monitor"
            onClick={() => navigate("/admin/risk")}
          />

          <AdminNav
            icon={<Link2 />}
            text="Blockchain Audit"
            onClick={() => navigate("/admin/blockchain")}
          />

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-user-card">
            <div className="admin-avatar">
              AD
            </div>

            <div>
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>
          </div>

          <button
            className="admin-logout"
            onClick={() => navigate("/admin/login")}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <p className="dashboard-eyebrow">
              SYSTEM OVERVIEW
            </p>

            <h1>Admin Dashboard</h1>

            <p>
              Monitor identity verification, AI risk and
              tamper-evident audit activity.
            </p>
          </div>

          <div className="admin-system-status">
            <span className="status-dot"></span>
            System Operational
          </div>

        </header>

        {/* TOP STATISTICS */}
        <section className="admin-stat-grid">

          <StatCard
            icon={<Users />}
            label="Total Voters"
            value={stats.total_voters}
          />

          <StatCard
            icon={<Fingerprint />}
            label="Verifications"
            value={stats.total_verifications}
          />

          <StatCard
            icon={<CheckCircle2 />}
            label="Verified"
            value={stats.verified}
            type="success"
          />

          <StatCard
            icon={<AlertTriangle />}
            label="Manual Review"
            value={stats.manual_review}
            type="warning"
          />

        </section>

        {/* SECONDARY STATS */}
        <section className="admin-secondary-grid">

          <MiniStat
            label="Fallback Required"
            value={stats.fallback_required}
          />

          <MiniStat
            label="High Risk Attempts"
            value={stats.high_risk}
          />

          <MiniStat
            label="ML Risk Threshold"
            value={stats.ml_risk_threshold}
          />

          <MiniStat
            label="Audit Records"
            value={stats.total_audit_records}
          />

        </section>

        {/* SYSTEM PANELS */}
        <section className="admin-dashboard-grid">

          {/* VERIFICATION OVERVIEW */}
          <div className="admin-panel">

            <div className="admin-panel-header">
              <div>
                <p className="small-label">
                  VERIFICATION
                </p>
                <h2>Decision Overview</h2>
              </div>

              <Activity size={20} />
            </div>

            <div className="decision-overview">

              <DecisionRow
                label="Verified"
                value={stats.verified}
                total={stats.total_verifications}
                type="verified"
              />

              <DecisionRow
                label="Fallback Required"
                value={stats.fallback_required}
                total={stats.total_verifications}
                type="fallback"
              />

              <DecisionRow
                label="Manual Review"
                value={stats.manual_review}
                total={stats.total_verifications}
                type="review"
              />

              <DecisionRow
                label="High Risk"
                value={stats.high_risk}
                total={stats.total_verifications}
                type="risk"
              />

            </div>

          </div>

          {/* BLOCKCHAIN */}
          <div className="admin-panel">

            <div className="admin-panel-header">
              <div>
                <p className="small-label">
                  AUDIT INTEGRITY
                </p>
                <h2>Blockchain Status</h2>
              </div>

              <Link2 size={20} />
            </div>

            <div className="blockchain-health">

              <div className="blockchain-health-icon">
                <ShieldCheck size={38} />
              </div>

              <h3>
                {blockchain.valid
                  ? "Hash Chain Valid"
                  : "Integrity Warning"}
              </h3>

              <p>
                Blockchain hash-chain linkage has been
                validated successfully.
              </p>

              <div className="blockchain-health-stats">

                <div>
                  <span>Total Blocks</span>
                  <strong>
                    {blockchain.total_blocks}
                  </strong>
                </div>

                <div>
                  <span>Chain Status</span>
                  <strong className="chain-valid">
                    VALID
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* MONITORING */}
        <section className="admin-panel admin-monitoring-panel">

          <div className="admin-panel-header">

            <div>
              <p className="small-label">
                SECURITY MONITORING
              </p>
              <h2>System Components</h2>
            </div>

            <Database size={20} />

          </div>

          <div className="system-component-grid">

            <SystemComponent
              icon={<Fingerprint />}
              title="Fingerprint Matching"
              detail="Biometric verification engine"
            />

            <SystemComponent
              icon={<BrainCircuit />}
              title="AI Risk Model"
              detail={`Risk threshold: ${stats.ml_risk_threshold}`}
            />

            <SystemComponent
              icon={<ShieldAlert />}
              title="Fallback Authentication"
              detail="Test OTP escalation"
            />

            <SystemComponent
              icon={<Link2 />}
              title="Blockchain Audit"
              detail={`${stats.total_audit_records} audit records`}
            />

          </div>

        </section>

        {/* FOOTER */}
        <div className="admin-dashboard-footer">
          <Clock3 size={14} />
          SecureVote AI Research Prototype
        </div>

      </main>

    </div>
  );
}

function AdminNav({
  icon,
  text,
  active = false,
  onClick,
}) {
  return (
    <button
      className={`admin-nav-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  type = "",
}) {
  return (
    <div className={`admin-stat-card ${type}`}>

      <div className="admin-stat-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="admin-mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DecisionRow({
  label,
  value,
  total,
  type,
}) {
  const percentage =
    total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="decision-row">

      <div className="decision-row-header">
        <span>{label}</span>
        <strong>
          {value} / {total}
        </strong>
      </div>

      <div className="decision-progress">
        <div
          className={`decision-progress-fill ${type}`}
          style={{
            width: `${Math.min(
              percentage,
              100
            )}%`,
          }}
        />
      </div>

    </div>
  );
}

function SystemComponent({
  icon,
  title,
  detail,
}) {
  return (
    <div className="system-component">

      <div className="system-component-icon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>

      <div className="component-status">
        ACTIVE
      </div>

    </div>
  );
}

export default AdminDashboard;