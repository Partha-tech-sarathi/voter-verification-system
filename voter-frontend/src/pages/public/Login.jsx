import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary navigation only.
    // Real Django authentication will be connected later.
    navigate("/user/dashboard");
  };

  return (
    <div className="auth-page">

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
            Secure voter verification powered by intelligent risk analysis.
          </h1>

          <p>
            Multi-factor identity verification combining biometric
            authentication, behavioral risk analysis and tamper-evident
            audit logging.
          </p>

          <div className="auth-security-list">
            <span>✓ Biometric verification</span>
            <span>✓ AI behavioral risk analysis</span>
            <span>✓ Fallback authentication</span>
            <span>✓ Tamper-evident audit trail</span>
          </div>

        </div>

        <small>Academic Research Prototype</small>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-mobile-brand">
            <ShieldCheck size={28} />
            SecureVote AI
          </div>

          <p className="auth-label">USER PORTAL</p>

          <h2>Welcome back</h2>

          <p className="auth-subtitle">
            Sign in to continue to secure verification.
          </p>

          <form onSubmit={handleSubmit}>

            <label>Email / User ID</label>

            <div className="input-with-icon">
              <Mail size={18} />

              <input
                type="text"
                placeholder="Enter your email or user ID"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="password-heading">

              <label>Password</label>

              <button
                type="button"
                className="text-button"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>

            </div>

            <div className="input-with-icon">

              <LockKeyhole size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            <label className="remember-row">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button
              type="submit"
              className="btn-primary auth-submit"
            >
              Sign In
            </button>

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Don't have an account?
            <button
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
          </p>

          <button
            className="admin-login-link"
            onClick={() => navigate("/admin/login")}
          >
            Administrator Login →
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;