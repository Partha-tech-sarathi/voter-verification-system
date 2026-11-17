
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

function OTPFallback() {
  const navigate = useNavigate();
  const location = useLocation();

  const verificationId = location.state?.verification_id;
  const voterId = location.state?.voter_id;

  const [otp, setOtp] = useState("");
  const [testOtp, setTestOtp] = useState("");
  const [identityReference, setIdentityReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!verificationId || !voterId) {
      setMessage("Verification details missing. Please start again.");
    }
  }, [verificationId, voterId]);

  // Generate OTP through Django
  const generateOtp = async () => {
    if (!identityReference.trim()) {
      setMessage("Please enter your identity reference.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/fallback/request-otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verification_id: verificationId,
            identity_reference: identityReference.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "OTP generation failed."
        );
      }

      setTestOtp(data.test_otp);
      setOtp("");
      setMessage("Test OTP generated successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP through Django
  const handleVerify = async () => {
    if (otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/fallback/verify-otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verification_id: verificationId,
            otp: otp,
            behavioral_features: {
              login_success: 1,
              asn: 12345,
              browser_version: 120,
              country_info: 1,
              attack_ip_flag: 0,
              login_time: 12,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "OTP verification failed."
        );
      }

      if (data.final_decision === "VERIFIED") {
        setMessage("OTP verified successfully.");

        // Fetch the updated verification record
        const detailResponse = await fetch(
          `http://127.0.0.1:8000/api/verifications/${encodeURIComponent(
            verificationId
          )}/`
        );

        if (!detailResponse.ok) {
          throw new Error(
            "OTP verified, but could not load verification details."
          );
        }

        const updatedResult = await detailResponse.json();

        navigate("/user/verification-result", {
          state: {
            verificationResult: updatedResult,
          },
        });
      } else {
        navigate("/user/manual-review", {
          state: {
            verificationResult: data,
          },
        });
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">

        <button
          className="verification-back"
          onClick={() => navigate("/user/verify")}
        >
          <ArrowLeft size={16} />
          Back to Verification
        </button>

        <div className="otp-icon">
          <KeyRound size={36} />
        </div>

        <p className="small-label">FALLBACK AUTHENTICATION</p>

        <h1>Additional Verification Required</h1>

        <p className="otp-description">
          Complete test OTP authentication to continue.
        </p>

        <div className="otp-warning">
          <AlertTriangle size={18} />
          <div>
            <strong>Fingerprint mismatch detected</strong>
            <p>
              Your verification requires fallback authentication.
            </p>
          </div>
        </div>

        <div className="otp-reference">
          <div>
            <span>Verification ID</span>
            <strong>{verificationId || "Not available"}</strong>
          </div>

          <div>
            <span>Voter ID</span>
            <strong>{voterId || "Not available"}</strong>
          </div>

          <div>
            <span>Method</span>
            <strong>TEST_OTP</strong>
          </div>
        </div>

        <label className="otp-label">
          Identity Reference
        </label>

        <input
          className="otp-input"
          type="text"
          placeholder="Enter identity reference"
          value={identityReference}
          onChange={(e) => setIdentityReference(e.target.value)}
        />

        <button
          className="btn-primary otp-verify-button"
          onClick={generateOtp}
          disabled={loading || !verificationId || !voterId}
        >
          <RefreshCw size={17} />
          {loading ? "Generating..." : "Generate Test OTP"}
        </button>

        {testOtp && (
          <>
            <div className="test-otp-box">
              <span>DJANGO GENERATED TEST OTP</span>
              <strong>{testOtp}</strong>
              <small>
                Prototype only — no real SMS is sent.
              </small>
            </div>

            <label className="otp-label">
              Enter 6-digit OTP
            </label>

            <input
              className="otp-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
            />

            <button
              className="btn-primary otp-verify-button"
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
            >
              <ShieldCheck size={18} />
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {message && <p role="status">{message}</p>}

      </div>
    </div>
  );
}

export default OTPFallback;
