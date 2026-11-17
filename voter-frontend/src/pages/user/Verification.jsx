import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Fingerprint,
  History,
  User,
  LogOut,
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  BrainCircuit,
  Shield,
} from "lucide-react";

function Verification() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    voterId: "V001",
    identityReference: "IDREF001",

    registeredFingerprint:
      "C:\\Users\\ps400\\OneDrive\\Desktop\\voter_verification_project\\fingerprint\\dataset\\Real\\1__M_Left_index_finger.BMP",

    presentedFingerprint:
  "C:\\Users\\ps400\\OneDrive\\Desktop\\voter_verification_project\\fingerprint\\dataset\\Real\\10__M_Left_index_finger.BMP",

    ipAddress: "192.168.1.10",
    deviceType: "Desktop",
    browser: "Chrome",
    operatingSystem: "Windows",
    loginHour: "11",
    failedAttempts: "0",
  });

  const updateField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleVerification = async () => {
  setLoading(true);
  setError("");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voter_id: form.voterId,
        real_fingerprint_path: form.registeredFingerprint,
        test_fingerprint_path: form.presentedFingerprint,
        behavioral_features: {
  Country: "IN",
  Region: "Tamil Nadu",
  City: "Chennai",
  ASN: 41164,
  "Browser Name and Version": "Chrome 37.0.2062",
  "OS Name and Version": "Windows 8",
  "Device Type": "desktop",
  "Login Successful": 1,
  "Is Attack IP": 0,
  "Login Timestamp": new Date().toISOString(),
},
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Verification failed");
    }

    navigate("/user/verification-result", {
      state: { verificationResult: data },
    });

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
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

          <button className="sidebar-item active">
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
            onClick={() => navigate("/login")}
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="user-main">

        <header className="verification-header">

          <div>

            <button
              className="verification-back"
              onClick={() =>
                navigate("/user/dashboard")
              }
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>

            <p className="dashboard-eyebrow">
              SECURE VERIFICATION
            </p>

            <h1>Identity Verification</h1>

            <p>
              Complete each step to verify your identity
              securely.
            </p>

          </div>

          <div className="header-security">
            <ShieldCheck size={18} />
            Secure Session
          </div>

        </header>

        {/* STEPPER */}
        <div className="verification-stepper">

          <StepItem
            number="1"
            title="Identity"
            active={step === 1}
            completed={step > 1}
          />

          <StepLine completed={step > 1} />

          <StepItem
            number="2"
            title="Fingerprint"
            active={step === 2}
            completed={step > 2}
          />

          <StepLine completed={step > 2} />

          <StepItem
            number="3"
            title="Behavioral Context"
            active={step === 3}
            completed={step > 3}
          />

          <StepLine completed={step > 3} />

          <StepItem
            number="4"
            title="Review"
            active={step === 4}
            completed={false}
          />

        </div>

        {/* FORM CARD */}
        <section className="verification-form-card">

          {step === 1 && (
            <IdentityStep
              form={form}
              updateField={updateField}
            />
          )}

          {step === 2 && (
            <FingerprintStep
              form={form}
              updateField={updateField}
            />
          )}

          {step === 3 && (
            <BehaviorStep
              form={form}
              updateField={updateField}
            />
          )}

          {step === 4 && (
            <ReviewStep form={form} />
          )}

          {/* BUTTONS */}
          <div className="verification-actions">

            <button
              className="verification-secondary-button"
              onClick={
                step === 1
                  ? () =>
                      navigate("/user/dashboard")
                  : previousStep
              }
            >
              <ArrowLeft size={17} />

              {step === 1
                ? "Cancel"
                : "Previous"}
            </button>

            {step < 4 ? (

              <button
                className="btn-primary verification-next-button"
                onClick={nextStep}
              >
                Continue
                <ArrowRight size={17} />
              </button>

            ) : (

              <button
                className="btn-primary verification-next-button"
                onClick={handleVerification}
              >
                <ShieldCheck size={17} />
                Verify Identity
              </button>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

/* ==============================
   STEP 1
============================== */

function IdentityStep({ form, updateField }) {
  return (
    <div>

      <StepHeader
        icon={<FileText />}
        title="Identity Information"
        text="Confirm the test voter identity used for verification."
      />

      <div className="verification-grid">

        <FormField
          label="Voter ID"
          value={form.voterId}
          placeholder="Example: V001"
          onChange={(value) =>
            updateField("voterId", value)
          }
        />

        <FormField
          label="Identity Reference"
          value={form.identityReference}
          placeholder="Example: IDREF001"
          onChange={(value) =>
            updateField(
              "identityReference",
              value
            )
          }
        />

      </div>

      <div className="verification-note">
        <Shield size={18} />

        <div>
          <strong>Test data only</strong>

          <p>
            This academic prototype must not use
            real Aadhaar, PAN, phone numbers or
            personal biometric information.
          </p>
        </div>
      </div>

    </div>
  );
}

/* ==============================
   STEP 2
============================== */

function FingerprintStep({
  form,
  updateField,
}) {
  return (
    <div>

      <StepHeader
        icon={<Fingerprint />}
        title="Fingerprint Verification"
        text="Provide the registered and presented test fingerprint paths."
      />

      <div className="fingerprint-display">

        <div className="fingerprint-visual">
          <Fingerprint size={85} />
        </div>

        <div>
          <h3>SOCOFing Test Fingerprint</h3>

          <p>
            The backend will compare the presented
            fingerprint against the registered
            fingerprint and calculate similarity.
          </p>
        </div>

      </div>

      <div className="verification-single-grid">

        <FormField
          label="Registered Fingerprint Path"
          value={form.registeredFingerprint}
          onChange={(value) =>
            updateField(
              "registeredFingerprint",
              value
            )
          }
        />

        <FormField
          label="Fingerprint for Verification"
          value={form.presentedFingerprint}
          onChange={(value) =>
            updateField(
              "presentedFingerprint",
              value
            )
          }
        />

      </div>

    </div>
  );
}

/* ==============================
   STEP 3
============================== */

function BehaviorStep({
  form,
  updateField,
}) {
  return (
    <div>

      <StepHeader
        icon={<BrainCircuit />}
        title="Behavioral Context"
        text="Provide contextual features used by the behavioral risk model."
      />

      <div className="verification-grid">

        <FormField
          label="IP Address"
          value={form.ipAddress}
          onChange={(value) =>
            updateField("ipAddress", value)
          }
        />

        <FormField
          label="Device Type"
          value={form.deviceType}
          onChange={(value) =>
            updateField("deviceType", value)
          }
        />

        <FormField
          label="Browser"
          value={form.browser}
          onChange={(value) =>
            updateField("browser", value)
          }
        />

        <FormField
          label="Operating System"
          value={form.operatingSystem}
          onChange={(value) =>
            updateField(
              "operatingSystem",
              value
            )
          }
        />

        <FormField
          label="Login Hour"
          value={form.loginHour}
          onChange={(value) =>
            updateField("loginHour", value)
          }
        />

        <FormField
          label="Failed Login Attempts"
          value={form.failedAttempts}
          onChange={(value) =>
            updateField(
              "failedAttempts",
              value
            )
          }
        />

      </div>

      <div className="verification-note">
        <BrainCircuit size={18} />

        <div>
          <strong>
            XGBoost Behavioral Risk Model
          </strong>

          <p>
            These features will later be sent to
            the backend ML pipeline to calculate
            the behavioral risk probability.
          </p>
        </div>
      </div>

    </div>
  );
}

/* ==============================
   STEP 4
============================== */

function ReviewStep({ form }) {
  return (
    <div>

      <StepHeader
        icon={<ShieldCheck />}
        title="Review & Verify"
        text="Review the test information before starting verification."
      />

      <div className="review-grid">

        <ReviewItem
          label="Voter ID"
          value={form.voterId}
        />

        <ReviewItem
          label="Identity Reference"
          value={form.identityReference}
        />

        <ReviewItem
          label="Device"
          value={form.deviceType}
        />

        <ReviewItem
          label="Browser"
          value={form.browser}
        />

        <ReviewItem
          label="Operating System"
          value={form.operatingSystem}
        />

        <ReviewItem
          label="Login Hour"
          value={form.loginHour}
        />

      </div>

      <div className="review-security-box">

        <ShieldCheck size={23} />

        <div>
          <strong>
            Ready for secure verification
          </strong>

          <p>
            Fingerprint matching, behavioral risk
            analysis, decision generation and
            blockchain audit will be performed by
            the Django backend.
          </p>
        </div>

      </div>

    </div>
  );
}

/* ==============================
   HELPERS
============================== */

function StepHeader({ icon, title, text }) {
  return (
    <div className="verification-step-header">

      <div className="verification-step-icon">
        {icon}
      </div>

      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>

    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="verification-field">

      <label>{label}</label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div className="review-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StepItem({
  number,
  title,
  active,
  completed,
}) {
  return (
    <div
      className={`verification-step ${
        active ? "active" : ""
      } ${completed ? "completed" : ""}`}
    >
      <div className="verification-step-number">
        {completed ? (
          <Check size={16} />
        ) : (
          number
        )}
      </div>

      <span>{title}</span>
    </div>
  );
}

function StepLine({ completed }) {
  return (
    <div
      className={`verification-step-line ${
        completed ? "completed" : ""
      }`}
    />
  );
}

export default Verification;
