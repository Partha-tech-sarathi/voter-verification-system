import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ShieldCheck,
  Clock3,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

function ManualReview() {
  const navigate = useNavigate();

  return (
    <div className="manual-review-page">

      <div className="manual-review-card">

        <div className="manual-review-icon">
          <AlertTriangle size={42} />
        </div>

        <p className="small-label">
          VERIFICATION ESCALATED
        </p>

        <h1>Manual Review Required</h1>

        <p className="manual-review-description">
          Automated verification could not confirm your identity.
          This verification attempt has been escalated for manual review.
        </p>

        <div className="manual-review-status">

          <Clock3 size={21} />

          <div>
            <span>FINAL DECISION</span>
            <strong>MANUAL_REVIEW</strong>
          </div>

        </div>

        <div className="manual-review-details">

          <div>
            <span>Voter ID</span>
            <strong>V001</strong>
          </div>

          <div>
            <span>Authentication Method</span>
            <strong>TEST_OTP</strong>
          </div>

          <div>
            <span>OTP Verified</span>
            <strong>FALSE</strong>
          </div>

          <div>
            <span>Audit Status</span>
            <strong>RECORDED</strong>
          </div>

        </div>

        <div className="manual-review-note">

          <ShieldCheck size={20} />

          <div>
            <strong>Audit trail preserved</strong>

            <p>
              The fingerprint failure and fallback authentication
              result are recorded in the tamper-evident audit chain.
            </p>
          </div>

        </div>

        <div className="manual-review-actions">

          <button
            className="verification-secondary-button"
            onClick={() => navigate("/user/dashboard")}
          >
            <LayoutDashboard size={17} />
            Dashboard
          </button>

          <button
            className="btn-primary verification-next-button"
            onClick={() => navigate("/user/history")}
          >
            Verification History
            <ArrowRight size={17} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default ManualReview;