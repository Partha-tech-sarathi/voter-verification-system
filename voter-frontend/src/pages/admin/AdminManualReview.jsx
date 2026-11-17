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
  Clock3,
  Eye,
  ShieldAlert,
} from "lucide-react";

function AdminManualReview() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Temporary frontend data.
  // Later this will come from the backend.
  const reviewCases = [
    {
      verificationId: "VER_4895823E",
      voterId: "V001",
      fingerprintSimilarity: 6.9,
      fingerprintDecision: "NO MATCH",
      otpVerified: false,
      authenticationMethod: "TEST_OTP",
      riskScore: 0.04147,
      riskLevel: "LOW",
      decision: "MANUAL_REVIEW",
      auditId: "AUD_C7A99EB9",
    },
  ];

  const filteredCases = reviewCases.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.verificationId.toLowerCase().includes(value) ||
      item.voterId.toLowerCase().includes(value) ||
      item.auditId.toLowerCase().includes(value)
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
            onClick={() => navigate("/admin/verifications")}
          />

          <AdminNav
            icon={<AlertTriangle />}
            text="Manual Review"
            active
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

        <header className="admin-header">

          <div>
            <p className="dashboard-eyebrow">
              ESCALATED CASES
            </p>

            <h1>Manual Review</h1>

            <p>
              Review verification attempts that could not
              be completed through automated authentication.
            </p>
          </div>

          <div className="manual-review-admin-status">
            <AlertTriangle size={15} />
            {reviewCases.length} Case Pending
          </div>

        </header>

        {/* SUMMARY */}

        <section className="admin-review-summary">

          <ReviewSummary
            icon={<AlertTriangle />}
            label="Manual Review Cases"
            value={reviewCases.length}
            type="warning"
          />

          <ReviewSummary
            icon={<Fingerprint />}
            label="Fingerprint Failed"
            value={
              reviewCases.filter(
                (item) =>
                  item.fingerprintDecision === "NO MATCH"
              ).length
            }
          />

          <ReviewSummary
            icon={<ShieldAlert />}
            label="OTP Failed"
            value={
              reviewCases.filter(
                (item) => item.otpVerified === false
              ).length
            }
            type="danger"
          />

        </section>

        {/* REVIEW PANEL */}

        <section className="admin-review-panel">

          <div className="admin-review-header">

            <div>
              <p className="small-label">
                REVIEW QUEUE
              </p>

              <h2>Cases Requiring Attention</h2>
            </div>

            <div className="admin-review-search">

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

          {/* CASES */}

          <div className="admin-review-list">

            {filteredCases.map((item) => (

              <div
                className="admin-review-case"
                key={item.verificationId}
              >

                <div className="review-case-top">

                  <div className="review-case-title">

                    <div className="review-warning-icon">
                      <AlertTriangle size={20} />
                    </div>

                    <div>
                      <span>
                        VERIFICATION ID
                      </span>

                      <strong>
                        {item.verificationId}
                      </strong>

                      <small>
                        Voter {item.voterId}
                      </small>
                    </div>

                  </div>

                  <span className="review-status-badge">
                    MANUAL REVIEW
                  </span>

                </div>

                {/* DETAILS */}

                <div className="review-case-grid">

                  <ReviewDetail
                    label="Fingerprint Similarity"
                    value={`${item.fingerprintSimilarity}%`}
                  />

                  <ReviewDetail
                    label="Fingerprint Decision"
                    value={item.fingerprintDecision}
                    warning
                  />

                  <ReviewDetail
                    label="Fallback Method"
                    value={item.authenticationMethod}
                  />

                  <ReviewDetail
                    label="OTP Verified"
                    value={
                      item.otpVerified
                        ? "TRUE"
                        : "FALSE"
                    }
                    warning={!item.otpVerified}
                  />

                  <ReviewDetail
                    label="Behavioral Risk"
                    value={`${(
                      item.riskScore * 100
                    ).toFixed(2)}%`}
                  />

                  <ReviewDetail
                    label="Risk Level"
                    value={item.riskLevel}
                  />

                </div>

                {/* REASON */}

                <div className="review-reason">

                  <ShieldAlert size={18} />

                  <div>
                    <strong>
                      Escalation Reason
                    </strong>

                    <p>
                      Fingerprint verification failed and
                      fallback OTP authentication was not
                      successfully verified.
                    </p>
                  </div>

                </div>

                {/* FOOTER */}

                <div className="review-case-footer">

                  <div className="review-audit">

                    <Link2 size={14} />

                    <span>
                      Audit ID:
                    </span>

                    <strong>
                      {item.auditId}
                    </strong>

                  </div>

                  <button
                    className="review-details-button"
                    onClick={() =>
                      alert(
                        `Review case: ${item.verificationId}`
                      )
                    }
                  >
                    <Eye size={15} />
                    View Case
                  </button>

                </div>

              </div>

            ))}

            {filteredCases.length === 0 && (

              <div className="review-empty-state">
                <Clock3 size={30} />

                <strong>
                  No review cases found
                </strong>

                <p>
                  There are no matching manual review
                  cases.
                </p>
              </div>

            )}

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

function ReviewSummary({
  icon,
  label,
  value,
  type = "",
}) {
  return (
    <div className="admin-review-summary-card">

      <div
        className={`admin-review-summary-icon ${type}`}
      >
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

function ReviewDetail({
  label,
  value,
  warning = false,
}) {
  return (
    <div className="review-detail">

      <span>{label}</span>

      <strong
        className={
          warning ? "review-warning-value" : ""
        }
      >
        {value}
      </strong>

    </div>
  );
}

export default AdminManualReview;