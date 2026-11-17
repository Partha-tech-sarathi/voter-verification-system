import { useState } from "react";
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
  Search,
  Activity,
  Gauge,
  CheckCircle2,
  ShieldAlert,
  Eye,
} from "lucide-react";

function AdminRiskMonitor() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // ML threshold currently used by our backend
  const mlThreshold = 0.37;

  // Temporary frontend data.
  // Later this will come from the Django backend.
  const riskRecords = [
    {
      verificationId: "VER_942ADFD4",
      voterId: "V001",
      riskScore: 0.04147,
      confidence: 0.9585,
      uncertainty: 0.0415,
      highRisk: false,
      target: "Is Account Takeover",
      decision: "FALLBACK_REQUIRED",
    },
    {
      verificationId: "VER_4895823E",
      voterId: "V001",
      riskScore: 0.04147,
      confidence: 0.9585,
      uncertainty: 0.0415,
      highRisk: false,
      target: "Is Account Takeover",
      decision: "MANUAL_REVIEW",
    },
    {
      verificationId: "VER_HIGH_TEST",
      voterId: "V001",
      riskScore: 0.78,
      confidence: 0.88,
      uncertainty: 0.12,
      highRisk: true,
      target: "Is Account Takeover",
      decision: "MANUAL_REVIEW",
    },
  ];

  const filteredRecords = riskRecords.filter((record) => {
    const value = search.toLowerCase();

    return (
      record.verificationId.toLowerCase().includes(value) ||
      record.voterId.toLowerCase().includes(value) ||
      record.decision.toLowerCase().includes(value)
    );
  });

  const highRiskCount = riskRecords.filter(
    (record) => record.highRisk
  ).length;

  const lowRiskCount = riskRecords.filter(
    (record) => !record.highRisk
  ).length;

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
            onClick={() => navigate("/admin/dashboard")}
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
            active
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
              MACHINE LEARNING SECURITY
            </p>

            <h1>AI Risk Monitor</h1>

            <p>
              Monitor behavioral risk predictions,
              confidence and uncertainty.
            </p>
          </div>

          <div className="risk-model-status">
            <BrainCircuit size={15} />
            ML Model Active
          </div>

        </header>

        {/* SUMMARY */}
        <section className="risk-summary-grid">

          <RiskSummary
            icon={<Activity />}
            label="Analyzed Records"
            value={riskRecords.length}
          />

          <RiskSummary
            icon={<Gauge />}
            label="Risk Threshold"
            value={mlThreshold}
          />

          <RiskSummary
            icon={<CheckCircle2 />}
            label="Low Risk"
            value={lowRiskCount}
            type="success"
          />

          <RiskSummary
            icon={<ShieldAlert />}
            label="High Risk"
            value={highRiskCount}
            type="danger"
          />

        </section>

        {/* MODEL INFORMATION */}
        <section className="risk-model-panel">

          <div className="risk-model-icon">
            <BrainCircuit size={27} />
          </div>

          <div className="risk-model-content">
            <span>ACTIVE ML RISK MODEL</span>

            <h2>Behavioral Risk Analysis</h2>

            <p>
              The model evaluates verification context and
              predicts the probability of the target:
              <strong> Is Account Takeover</strong>.
            </p>
          </div>

          <div className="risk-threshold-box">
            <span>DECISION THRESHOLD</span>
            <strong>{mlThreshold}</strong>
            <small>
              Score ≥ {mlThreshold} → HIGH RISK
            </small>
          </div>

        </section>

        {/* RECORD TABLE */}
        <section className="admin-risk-panel">

          <div className="admin-risk-header">

            <div>
              <p className="small-label">
                ML PREDICTIONS
              </p>

              <h2>Risk Analysis Records</h2>
            </div>

            <div className="admin-risk-search">

              <Search size={16} />

              <input
                type="text"
                placeholder="Search verification..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

          <div className="admin-risk-table-wrapper">

            <table className="admin-risk-table">

              <thead>
                <tr>
                  <th>Verification ID</th>
                  <th>Voter</th>
                  <th>Risk Score</th>
                  <th>Threshold</th>
                  <th>Classification</th>
                  <th>Confidence</th>
                  <th>Uncertainty</th>
                  <th>Decision</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredRecords.map((record) => (

                  <tr key={record.verificationId}>

                    <td>
                      <strong className="risk-verification-id">
                        {record.verificationId}
                      </strong>
                    </td>

                    <td>
                      <span className="risk-voter-badge">
                        {record.voterId}
                      </span>
                    </td>

                    <td>
                      <RiskScore
                        score={record.riskScore}
                        highRisk={record.highRisk}
                      />
                    </td>

                    <td>
                      <span className="threshold-value">
                        {mlThreshold}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          record.highRisk
                            ? "risk-classification high"
                            : "risk-classification low"
                        }
                      >
                        {record.highRisk
                          ? "HIGH RISK"
                          : "LOW RISK"}
                      </span>
                    </td>

                    <td>
                      <strong className="confidence-value">
                        {(record.confidence * 100).toFixed(2)}%
                      </strong>
                    </td>

                    <td>
                      <span className="uncertainty-value">
                        {(record.uncertainty * 100).toFixed(2)}%
                      </span>
                    </td>

                    <td>
                      <DecisionBadge
                        decision={record.decision}
                      />
                    </td>

                    <td>
                      <button
                        className="admin-view-button"
                        onClick={() =>
                          alert(
                            `ML analysis: ${record.verificationId}`
                          )
                        }
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

        {/* EXPLANATION */}
        <section className="risk-explanation">

          <BrainCircuit size={20} />

          <div>
            <strong>
              How risk classification works
            </strong>

            <p>
              If the behavioral risk score is below
              {` ${mlThreshold}`}, the attempt is classified
              as LOW RISK. A score equal to or above
              {` ${mlThreshold}`} is classified as HIGH RISK.
              Risk analysis supports the verification
              decision but is not the fingerprint match
              itself.
            </p>
          </div>

        </section>

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

function RiskSummary({
  icon,
  label,
  value,
  type = "",
}) {
  return (
    <div className="risk-summary-card">

      <div className={`risk-summary-icon ${type}`}>
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

function RiskScore({ score, highRisk }) {
  const percentage = Math.min(score * 100, 100);

  return (
    <div className="admin-risk-score">

      <strong>
        {score.toFixed(5)}
      </strong>

      <div className="admin-risk-score-track">
        <div
          className={`admin-risk-score-fill ${
            highRisk ? "high" : "low"
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

    </div>
  );
}

function DecisionBadge({ decision }) {
  if (decision === "MANUAL_REVIEW") {
    return (
      <span className="risk-decision review">
        MANUAL REVIEW
      </span>
    );
  }

  if (decision === "FALLBACK_REQUIRED") {
    return (
      <span className="risk-decision fallback">
        FALLBACK
      </span>
    );
  }

  return (
    <span className="risk-decision verified">
      VERIFIED
    </span>
  );
}

export default AdminRiskMonitor;