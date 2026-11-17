
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Fingerprint,
  History,
  User,
  LogOut,
  CheckCircle2,
  BrainCircuit,
  Link2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

function VerificationResult() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get actual verification result from Django API response
  const result = location.state?.verificationResult;

  if (!result) {
    return (
      <div className="user-layout">
        <main className="user-main">
          <h2>Verification result not found</h2>
          <p>Please start a new verification.</p>
          <button
            className="btn-primary"
            onClick={() => navigate("/user/verify")}
          >
            Start Verification
          </button>
        </main>
      </div>
    );
  }

  const isVerified = result.final_decision === "VERIFIED";
  const isFallback = result.final_decision === "FALLBACK_REQUIRED";
  const isManualReview = result.final_decision === "MANUAL_REVIEW";
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
            onClick={() =>
              navigate("/user/dashboard")
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className="sidebar-item active"
            onClick={() =>
              navigate("/user/verify")
            }
          >
            <Fingerprint size={19} />
            Start Verification
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/user/history")
            }
          >
            <History size={19} />
            Verification History
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/user/profile")
            }
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
            onClick={() =>
              navigate("/login")
            }
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="user-main result-main">

        {/* RESULT HERO */}

{/* RESULT HERO */}
<section
  className={`result-hero ${
    isVerified ? "verified-result" : "fallback-result"
  }`}
>
  <div className="result-main-icon">
    {isVerified ? (
      <CheckCircle2 size={48} />
    ) : (
      <ShieldCheck size={48} />
    )}
  </div>

  <p className="small-label">
    VERIFICATION COMPLETE
  </p>

  <h1>
    {isVerified
      ? "Identity Verified"
      : isFallback
      ? "Additional Authentication Required"
      : isManualReview
      ? "Manual Review Required"
      : "Verification Result"}
  </h1>

  <p>
    {isVerified
      ? "Fingerprint verification and behavioral risk analysis completed successfully."
      : isFallback
      ? "Fingerprint verification failed. Please complete fallback authentication."
      : isManualReview
      ? "Your verification requires additional manual review."
      : "Your verification result is available below."}
  </p>

  <div className="result-decision-badge">
    {result.final_decision}
  </div>
</section>


        {/* SUMMARY */}
        <section className="result-summary-grid">

          <ResultCard
            icon={<Fingerprint />}
            label="Fingerprint Match"
            value={
              result.fingerprint
                .similarity_percentage + "%"
            }
            detail={
              result.fingerprint
                .fingerprint_decision
            }
          />

          <ResultCard
            icon={<BrainCircuit />}
            label="Behavioral Risk"
            value={
              (
                result.behavioral_risk_score *
                100
              ).toFixed(2) + "%"
            }
            detail={result.risk_level + " RISK"}
          />

          <ResultCard
            icon={<ShieldCheck />}
            label="Confidence"
            value={
              (
                result.confidence_score *
                100
              ).toFixed(2) + "%"
            }
            detail="Decision confidence"
          />

        </section>

        {/* VERIFICATION DETAILS */}
        <section className="result-section">

          <div className="result-section-heading">

            <div>
              <p className="small-label">
                VERIFICATION DETAILS
              </p>

              <h2>Decision Analysis</h2>
            </div>

          </div>

          <div className="result-details-grid">

            <ResultDetail
              label="Verification ID"
              value={result.verification_id}
            />

            <ResultDetail
              label="Voter ID"
              value={result.voter_id}
            />

            <ResultDetail
              label="Fingerprint Threshold"
              value={
                result.fingerprint.threshold
              }
            />

            <ResultDetail
              label="Fingerprint Match"
              value={
                result.fingerprint
                  .fingerprint_match
                  ? "TRUE"
                  : "FALSE"
              }
            />

            <ResultDetail
              label="ML Risk Threshold"
              value={result.ml_risk.threshold}
            />

            <ResultDetail
              label="High Risk"
              value={
                result.ml_risk.high_risk
                  ? "TRUE"
                  : "FALSE"
              }
            />

            <ResultDetail
              label="Risk Level"
              value={result.risk_level}
            />

            <ResultDetail
              label="Uncertainty Score"
              value={
                (
                  result.uncertainty_score *
                  100
                ).toFixed(2) + "%"
              }
            />

          </div>

        </section>

        {/* BLOCKCHAIN */}
        <section className="result-section">

          <div className="result-section-heading">

            <div>
              <p className="small-label">
                TAMPER-EVIDENT AUDIT
              </p>

              <h2>
                Blockchain Audit Record
              </h2>
            </div>

            <div className="result-audit-status">
              <Link2 size={16} />
              Audit Recorded
            </div>

          </div>

          <div className="audit-result-grid">

            <ResultDetail
              label="Audit ID"
              value={result.audit_id}
            />

            <ResultDetail
              label="Previous Hash"
              value={
                result.blockchain.previous_hash
              }
              hash
            />

            <ResultDetail
              label="Current Hash"
              value={
                result.blockchain.current_hash
              }
              hash
            />

          </div>

        </section>

        {/* ACTIONS */}

{/* ACTIONS */}
<div className="result-actions">

  {isFallback && (
    <button
      className="btn-primary verification-next-button"
      onClick={() =>
        navigate("/user/fallback", {
          state: {
            verification_id: result.verification_id,
            voter_id: result.voter_id,
          },
        })
      }
    >
      <ShieldCheck size={17} />
      Continue to OTP Verification
      <ArrowRight size={17} />
    </button>
  )}

  <button
    className="verification-secondary-button"
    onClick={() => navigate("/user/verify")}
  >
    <RotateCcw size={17} />
    New Verification
  </button>

  <button
    className="btn-primary verification-next-button"
    onClick={() => navigate("/user/dashboard")}
  >
    Return to Dashboard
    <ArrowRight size={17} />
  </button>

</div>


      </main>

    </div>
  );
}

function ResultCard({
  icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="result-summary-card">

      <div className="result-card-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{detail}</p>
      </div>

    </div>
  );
}

function ResultDetail({
  label,
  value,
  hash = false,
}) {
  return (
    <div className="result-detail">

      <span>{label}</span>

      <strong
        className={
          hash ? "hash-value" : ""
        }
      >
        {value}
      </strong>

    </div>
  );
}

export default VerificationResult;
