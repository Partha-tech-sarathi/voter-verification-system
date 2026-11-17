import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Database,
  BrainCircuit,
  Link2,
} from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary frontend navigation.
    // Real admin authentication will be connected to Django later.
    navigate("/admin/dashboard");
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <div className="auth-left admin-auth-left">

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

          <p className="admin-portal-label">
            ADMINISTRATION PORTAL
          </p>

          <h1>
            Monitor verification security and system activity.
          </h1>

          <p>
            Review voter verification attempts, AI risk
            predictions, fallback cases and tamper-evident
            blockchain audit records.
          </p>

          <div className="admin-login-features">

            <AdminFeature
              icon={<Database size={19} />}
              text="Verification Records"
            />

            <AdminFeature
              icon={<BrainCircuit size={19} />}
              text="AI Risk Monitoring"
            />

            <AdminFeature
              icon={<Link2 size={19} />}
              text="Blockchain Audit"
            />

          </div>

        </div>

        <small>
          Authorized Prototype Administration Only
        </small>

      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-mobile-brand">
            <ShieldCheck size={28} />
            SecureVote AI
          </div>

          <p className="auth-label">
            ADMIN PORTAL
          </p>

          <h2>Administrator Login</h2>

          <p className="auth-subtitle">
            Sign in to access system monitoring and
            verification management.
          </p>

          <form onSubmit={handleSubmit}>

            <label>
              Admin Username / Email
            </label>

            <div className="input-with-icon">

              <Mail size={18} />

              <input
                type="text"
                placeholder="Enter administrator username"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                required
              />

            </div>

            <label>Password</label>

            <div className="input-with-icon">

              <LockKeyhole size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter administrator password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            <button
              type="submit"
              className="btn-primary auth-submit"
            >
              <ShieldCheck size={17} />
              Sign In as Administrator
            </button>

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button
            className="admin-login-link"
            onClick={() =>
              navigate("/login")
            }
          >
            ← Return to Voter Login
          </button>

          <div className="admin-security-notice">
            <LockKeyhole size={16} />

            <p>
              Administrator access is restricted to
              authorized research prototype users.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

function AdminFeature({ icon, text }) {
  return (
    <div className="admin-login-feature">
      {icon}
      <span>{text}</span>
    </div>
  );
}

export default AdminLogin;