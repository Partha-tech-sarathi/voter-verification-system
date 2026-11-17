import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Fingerprint,
  BrainCircuit,
  Link2,
  ArrowRight,
  UserCheck,
} from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="brand">
          <ShieldCheck size={30} />
          <span>SecureVote AI</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#how">How It Works</a>
          <a href="#technology">Technology</a>

          <button
            className="btn-outline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO */}
      <main id="home" className="hero">

        <div className="prototype-badge">
          <ShieldCheck size={16} />
          Academic Research Prototype
        </div>

        <h1>
          Secure Identity.
          <br />
          <span>Intelligent Risk Analysis.</span>
        </h1>

        <p className="hero-description">
          AI-based multi-factor voter verification combining fingerprint
          authentication, behavioral risk analysis, fallback authentication
          and tamper-evident audit logging.
        </p>

        <div className="hero-buttons">

          <button
            className="btn-primary btn-large"
            onClick={() => navigate("/login")}
          >
            Start Verification
            <ArrowRight size={19} />
          </button>

          <button
            className="btn-outline btn-large"
            onClick={() => navigate("/admin/login")}
          >
            Admin Portal
          </button>

        </div>
      </main>

      {/* VERIFICATION WORKFLOW */}
      <section className="workflow-section">

        <p className="section-label">
          SECURE VERIFICATION PIPELINE
        </p>

        <div className="workflow">

          <WorkflowItem
            icon={<UserCheck />}
            title="Identity"
            text="Voter identification"
          />

          <ArrowRight className="workflow-arrow" />

          <WorkflowItem
            icon={<Fingerprint />}
            title="Fingerprint"
            text="Biometric matching"
          />

          <ArrowRight className="workflow-arrow" />

          <WorkflowItem
            icon={<BrainCircuit />}
            title="AI Risk"
            text="Behavioral analysis"
          />

          <ArrowRight className="workflow-arrow" />

          <WorkflowItem
            icon={<ShieldCheck />}
            title="Decision"
            text="Risk-aware decision"
          />

          <ArrowRight className="workflow-arrow" />

          <WorkflowItem
            icon={<Link2 />}
            title="Audit"
            text="Hash-chain record"
          />

        </div>
      </section>

      {/* TECHNOLOGY */}
      <section id="technology" className="features-section">

        <div className="section-heading">

          <p className="section-label">
            CORE TECHNOLOGY
          </p>

          <h2>
            Multi-Layer Verification Architecture
          </h2>

          <p>
            Multiple security layers work together to provide reliable,
            explainable and auditable identity verification.
          </p>

        </div>

        <div className="feature-grid">

          <FeatureCard
            icon={<Fingerprint />}
            title="Biometric Authentication"
            text="Fingerprint matching provides the primary biometric identity verification layer."
          />

          <FeatureCard
            icon={<BrainCircuit />}
            title="AI Behavioral Risk"
            text="XGBoost evaluates contextual login features and estimates account-takeover risk."
          />

          <FeatureCard
            icon={<ShieldCheck />}
            title="Fallback Authentication"
            text="Additional test OTP authentication is triggered when fingerprint verification fails."
          />

          <FeatureCard
            icon={<Link2 />}
            title="Tamper-Evident Audit"
            text="Verification events are recorded using SHA-256 linked audit records for integrity checking."
          />

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how-section">

        <div className="section-heading">

          <p className="section-label">
            HOW IT WORKS
          </p>

          <h2>
            From Identity to Secure Audit
          </h2>

        </div>

        <div className="steps-grid">

          <Step
            number="01"
            title="Identify Voter"
            text="Provide the test voter identity."
          />

          <Step
            number="02"
            title="Verify Fingerprint"
            text="Compare registered and presented fingerprint."
          />

          <Step
            number="03"
            title="Analyze Risk"
            text="Evaluate behavioral context using the ML model."
          />

          <Step
            number="04"
            title="Make Decision"
            text="Backend decision engine determines the verification outcome."
          />

          <Step
            number="05"
            title="Fallback if Required"
            text="Test OTP provides additional authentication."
          />

          <Step
            number="06"
            title="Record Audit"
            text="The final event is added to the tamper-evident hash-chain audit."
          />

        </div>

      </section>

      {/* FOOTER */}
      <footer className="landing-footer">

        <div className="brand">
          <ShieldCheck size={23} />
          <span>SecureVote AI</span>
        </div>

        <p>
          Academic Research Prototype
        </p>

      </footer>

    </div>
  );
}


function WorkflowItem({ icon, title, text }) {
  return (
    <div className="workflow-item">

      <div className="workflow-icon">
        {icon}
      </div>

      <strong>{title}</strong>

      <span>{text}</span>

    </div>
  );
}


function FeatureCard({ icon, title, text }) {
  return (
    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );
}


function Step({ number, title, text }) {
  return (
    <div className="step-card">

      <span className="step-number">
        {number}
      </span>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );
}


export default Landing;