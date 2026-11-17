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
  Fingerprint,
  CheckCircle2,
  Eye,
  Clock3,
} from "lucide-react";

function AdminVerifications() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // TEMPORARY FRONTEND DATA
  // Later this will come from the Django backend.
  const records = [
    {
      verificationId: "VER_4948B195",
      voterId: "V001",
      fingerprintSimilarity: 68.63,
      fingerprintDecision: "MATCH",
      riskScore: 0.04147,
      riskLevel: "LOW",
      finalDecision: "VERIFIED",
      auditId: "AUD_9CBA0264",
    },
    {
      verificationId: "VER_942ADFD4",
      voterId: "V001",
      fingerprintSimilarity: 6.9,
      fingerprintDecision: "NO MATCH",
      riskScore: 0.04147,
      riskLevel: "LOW",
      finalDecision: "VERIFIED",
      auditId: "AUD_AE588897",
    },
    {
      verificationId: "VER_4895823E",
      voterId: "V001",
      fingerprintSimilarity: 6.9,
      fingerprintDecision: "NO MATCH",
      riskScore: 0.04147,
      riskLevel: "LOW",
      finalDecision: "MANUAL_REVIEW",
      auditId: "AUD_C7A99EB9",
    },
  ];

  const filteredRecords = records.filter((record) => {
    const value = search.toLowerCase();

    return (
      record.verificationId.toLowerCase().includes(value) ||
      record.voterId.toLowerCase().includes(value) ||
      record.finalDecision.toLowerCase().includes(value) ||
      record.auditId.toLowerCase().includes(value)
    );
  });

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
            active
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
              VERIFICATION MONITORING
            </p>

            <h1>Verification Records</h1>

            <p>
              Monitor fingerprint results, AI risk scores
              and final verification decisions.
            </p>
          </div>

          <div className="admin-system-status">
            <span className="status-dot"></span>
            Monitoring Active
          </div>

        </header>

        {/* SUMMARY */}
        <section className="admin-verification-summary">

          <VerificationSummary
            icon={<ClipboardCheck />}
            title="Displayed Records"
            value={records.length}
          />

          <VerificationSummary
            icon={<CheckCircle2 />}
            title="Verified"
            value={
              records.filter(
                (r) => r.finalDecision === "VERIFIED"
              ).length
            }
            type="success"
          />

          <VerificationSummary
            icon={<AlertTriangle />}
            title="Manual Review"
            value={
              records.filter(
                (r) => r.finalDecision === "MANUAL_REVIEW"
              ).length
            }
            type="warning"
          />

          <VerificationSummary
            icon={<Fingerprint />}
            title="Fingerprint Mismatch"
            value={
              records.filter(
                (r) => r.fingerprintDecision === "NO MATCH"
              ).length
            }
          />

        </section>

        {/* RECORDS */}
        <section className="admin-verification-panel">

          <div className="admin-verification-header">

            <div>
              <p className="small-label">
                VERIFICATION DATABASE
              </p>

              <h2>Verification Attempts</h2>
            </div>

            <div className="admin-verification-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search ID, voter, decision..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>

          <div className="admin-verification-table-wrapper">

            <table className="admin-verification-table">

              <thead>
                <tr>
                  <th>Verification ID</th>
                  <th>Voter</th>
                  <th>Fingerprint</th>
                  <th>ML Risk</th>
                  <th>Risk Level</th>
                  <th>Decision</th>
                  <th>Audit ID</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredRecords.map((record) => (

                  <tr key={record.verificationId}>

                    <td>
                      <div className="verification-record-id">
                        <Clock3 size={14} />
                        <strong>
                          {record.verificationId}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <span className="verification-voter-id">
                        {record.voterId}
                      </span>
                    </td>

                    <td>
                      <div className="fingerprint-result-cell">

                        <strong>
                          {record.fingerprintSimilarity}%
                        </strong>

                        <span
                          className={
                            record.fingerprintDecision === "MATCH"
                              ? "fp-match"
                              : "fp-no-match"
                          }
                        >
                          {record.fingerprintDecision}
                        </span>

                      </div>
                    </td>

                    <td>
                      <div className="risk-score-cell">

                        <strong>
                          {(record.riskScore * 100).toFixed(2)}%
                        </strong>

                        <div className="risk-score-bar">
                          <div
                            className="risk-score-fill"
                            style={{
                              width: `${Math.min(
                                record.riskScore * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>

                      </div>
                    </td>

                    <td>
                      <span
                        className={`admin-risk-badge ${
                          record.riskLevel.toLowerCase()
                        }`}
                      >
                        {record.riskLevel}
                      </span>
                    </td>

                    <td>
                      <DecisionBadge
                        decision={record.finalDecision}
                      />
                    </td>

                    <td>
                      <span className="audit-id-cell">
                        {record.auditId}
                      </span>
                    </td>

                    <td>
                      <button
                        className="admin-view-button"
                        onClick={() =>
                          alert(
                            `Verification: ${record.verificationId}`
                          )
                        }
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>

                  </tr>

                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="admin-empty-table"
                    >
                      No verification records found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

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

function VerificationSummary({
  icon,
  title,
  value,
  type = "",
}) {
  return (
    <div className="admin-verification-summary-card">

      <div
        className={`admin-verification-summary-icon ${type}`}
      >
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
      <span className="admin-decision verified">
        <CheckCircle2 size={12} />
        VERIFIED
      </span>
    );
  }

  if (decision === "FALLBACK_REQUIRED") {
    return (
      <span className="admin-decision fallback">
        <Fingerprint size={12} />
        FALLBACK
      </span>
    );
  }

  return (
    <span className="admin-decision review">
      <AlertTriangle size={12} />
      MANUAL REVIEW
    </span>
  );
}

export default AdminVerifications;