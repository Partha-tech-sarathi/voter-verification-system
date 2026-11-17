import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Mail,
  CreditCard,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    voterId: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Temporary frontend behaviour.
    // Django signup API will be connected later.
    navigate("/login");
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <div className="auth-left">

        <button
          className="auth-back"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="auth-left-content">

          <div className="auth-brand">
            <ShieldCheck size={36} />
            <span>SecureVote AI</span>
          </div>

          <h1>
            Create your secure verification account.
          </h1>

          <p>
            Register to access the voter verification system and complete
            biometric and AI-assisted identity verification.
          </p>

          <div className="auth-security-list">
            <span>✓ Secure voter identity</span>
            <span>✓ Fingerprint verification</span>
            <span>✓ Behavioral risk analysis</span>
            <span>✓ Tamper-evident audit</span>
          </div>

        </div>

        <small>Academic Research Prototype</small>

      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right signup-right">

        <div className="auth-card signup-card">

          <div className="auth-mobile-brand">
            <ShieldCheck size={28} />
            SecureVote AI
          </div>

          <p className="auth-label">VOTER REGISTRATION</p>

          <h2>Create Account</h2>

          <p className="auth-subtitle">
            Enter your information to create your SecureVote AI account.
          </p>

          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}
            <label>Full Name</label>

            <div className="input-with-icon">
              <User size={18} />

              <input
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={(e) =>
                  updateField("fullName", e.target.value)
                }
                required
              />
            </div>

            {/* EMAIL */}
            <label>Email Address</label>

            <div className="input-with-icon">
              <Mail size={18} />

              <input
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
                required
              />
            </div>

            {/* VOTER ID */}
            <label>Voter ID</label>

            <div className="input-with-icon">
              <CreditCard size={18} />

              <input
                type="text"
                placeholder="Example: V001"
                value={form.voterId}
                onChange={(e) =>
                  updateField("voterId", e.target.value)
                }
                required
              />
            </div>

            {/* PASSWORD */}
            <label>Password</label>

            <div className="input-with-icon">

              <LockKeyhole size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={form.password}
                onChange={(e) =>
                  updateField("password", e.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {/* CONFIRM PASSWORD */}
            <label>Confirm Password</label>

            <div className="input-with-icon">

              <LockKeyhole size={18} />

              <input
                type={
                  showConfirmPassword ? "text" : "password"
                }
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) =>
                  updateField(
                    "confirmPassword",
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            <label className="remember-row signup-agreement">
              <input type="checkbox" required />

              <span>
                I agree to use this academic prototype with
                test/demo data only.
              </span>
            </label>

            <button
              type="submit"
              className="btn-primary auth-submit"
            >
              Create Account
            </button>

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Already have an account?

            <button onClick={() => navigate("/login")}>
              Sign In
            </button>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;