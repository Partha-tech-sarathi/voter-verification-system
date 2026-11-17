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
  Database,
  CheckCircle2,
  Blocks,
  Hash,
  Eye,
  RefreshCw,
} from "lucide-react";

function AdminBlockchain() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Temporary blockchain status.
  // Later this will come from Django blockchain validation API.
  const chainStatus = {
    valid: true,
    totalBlocks: 13,
    totalAuditRecords: 13,
  };

  // Temporary audit records.
  // Later these will come directly from the backend.
  const auditRecords = [
    {
      auditId: "AUD_78C9F610",
      verificationId: "VER_942ADFD4",
      eventType: "VERIFICATION",
      result: "FALLBACK_REQUIRED",
      riskScore: 0.04147,
      previousHash:
        "a7f7d0f44fc1da2f9044194cf2f47e9cf2520534347ce81d07fe2fcb3f024fc1",
      currentHash:
        "08773e93babf1766a88a9b4f6cb277ec55f42f287d29a9dcf85bef15a541841a",
    },
    {
      auditId: "AUD_AE588897",
      verificationId: "VER_942ADFD4",
      eventType: "FALLBACK_AUTH",
      result: "VERIFIED",
      riskScore: 0.04147,
      previousHash:
        "08773e93babf1766a88a9b4f6cb277ec55f42f287d29a9dcf85bef15a541841a",
      currentHash:
        "b909429a779d6d3279720dc2ce595d6573011256039207d88f9851d9d92183e8",
    },
    {
      auditId: "AUD_BFAF3770",
      verificationId: "VER_4895823E",
      eventType: "VERIFICATION",
      result: "FALLBACK_REQUIRED",
      riskScore: 0.04147,
      previousHash:
        "b909429a779d6d3279720dc2ce595d6573011256039207d88f9851d9d92183e8",
      currentHash:
        "2de9171ec11007ce3eb65cd438913658f49b57ba377c6187ad8ad5f90794a055",
    },
    {
      auditId: "AUD_C7A99EB9",
      verificationId: "VER_4895823E",
      eventType: "FALLBACK_AUTH",
      result: "MANUAL_REVIEW",
      riskScore: 0.04147,
      previousHash:
        "2de9171ec11007ce3eb65cd438913658f49b57ba377c6187ad8ad5f90794a055",
      currentHash:
        "2d0baf5eac112da6fe4037a6767c850ccb2f4e8e5597c500433aaedd263f29d6",
    },
  ];

  const filteredRecords = auditRecords.filter((record) => {
    const value = search.toLowerCase();

    return (
      record.auditId.toLowerCase().includes(value) ||
      record.verificationId.toLowerCase().includes(value) ||
      record.eventType.toLowerCase().includes(value) ||
      record.result.toLowerCase().includes(value)
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
            active
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
              TAMPER-EVIDENT AUDIT
            </p>

            <h1>Blockchain Audit</h1>

            <p>
              Monitor verification audit records and
              SHA-256 hash-chain integrity.
            </p>
          </div>

          <div
            className={
              chainStatus.valid
                ? "blockchain-valid-status"
                : "blockchain-invalid-status"
            }
          >
            {chainStatus.valid ? (
              <CheckCircle2 size={15} />
            ) : (
              <AlertTriangle size={15} />
            )}

            {chainStatus.valid
              ? "Hash Chain Valid"
              : "Integrity Warning"}
          </div>

        </header>

        {/* SUMMARY */}
        <section className="blockchain-summary-grid">

          <BlockchainSummary
            icon={<Blocks />}
            label="Total Blocks"
            value={chainStatus.totalBlocks}
          />

          <BlockchainSummary
            icon={<Database />}
            label="Audit Records"
            value={chainStatus.totalAuditRecords}
          />

          <BlockchainSummary
            icon={<ShieldCheck />}
            label="Chain Status"
            value={
              chainStatus.valid
                ? "VALID"
                : "INVALID"
            }
            type={
              chainStatus.valid
                ? "success"
                : "danger"
            }
          />

          <BlockchainSummary
            icon={<Hash />}
            label="Hash Algorithm"
            value="SHA-256"
          />

        </section>

        {/* CHAIN HEALTH */}
        <section className="blockchain-integrity-panel">

          <div className="blockchain-integrity-icon">
            <ShieldCheck size={32} />
          </div>

          <div className="blockchain-integrity-content">

            <span>
              BLOCKCHAIN INTEGRITY CHECK
            </span>

            <h2>
              Hash-chain linkage is valid
            </h2>

            <p>
              Each audit record stores the previous
              block hash and its own current hash,
              creating a tamper-evident sequence.
            </p>

          </div>

          <button
            className="blockchain-validate-button"
            onClick={() =>
              alert(
                "Blockchain validation API will be connected here."
              )
            }
          >
            <RefreshCw size={15} />
            Validate Chain
          </button>

        </section>

        {/* AUDIT TABLE */}
        <section className="admin-blockchain-panel">

          <div className="admin-blockchain-header">

            <div>
              <p className="small-label">
                AUDIT LEDGER
              </p>

              <h2>Blockchain Audit Records</h2>
            </div>

            <div className="blockchain-search">

              <Search size={16} />

              <input
                type="text"
                placeholder="Search audit record..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

          <div className="blockchain-table-wrapper">

            <table className="blockchain-table">

              <thead>
                <tr>
                  <th>Block</th>
                  <th>Audit ID</th>
                  <th>Verification</th>
                  <th>Event</th>
                  <th>Result</th>
                  <th>Risk</th>
                  <th>Previous Hash</th>
                  <th>Current Hash</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredRecords.map(
                  (record, index) => (

                    <tr key={record.auditId}>

                      <td>
                        <div className="block-number">
                          {index + 1}
                        </div>
                      </td>

                      <td>
                        <strong className="block-audit-id">
                          {record.auditId}
                        </strong>
                      </td>

                      <td>
                        <span className="block-verification-id">
                          {record.verificationId}
                        </span>
                      </td>

                      <td>
                        <span className="block-event">
                          {record.eventType}
                        </span>
                      </td>

                      <td>
                        <ResultBadge
                          result={record.result}
                        />
                      </td>

                      <td>
                        <span className="block-risk-score">
                          {record.riskScore.toFixed(5)}
                        </span>
                      </td>

                      <td>
                        <HashValue
                          value={record.previousHash}
                        />
                      </td>

                      <td>
                        <HashValue
                          value={record.currentHash}
                        />
                      </td>

                      <td>
                        <button
                          className="admin-view-button"
                          onClick={() =>
                            alert(
                              `Audit record: ${record.auditId}`
                            )
                          }
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* EXPLANATION */}
        <section className="blockchain-info-note">

          <Link2 size={20} />

          <div>
            <strong>
              Tamper-Evident Audit Chain
            </strong>

            <p>
              When a new verification event is recorded,
              its previous_hash references the preceding
              audit block. If a stored record is modified,
              chain validation can detect the broken hash
              linkage.
            </p>
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

function BlockchainSummary({
  icon,
  label,
  value,
  type = "",
}) {
  return (
    <div className="blockchain-summary-card">

      <div
        className={`blockchain-summary-icon ${type}`}
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

function HashValue({ value }) {
  const shortHash =
    value.slice(0, 8) +
    "..." +
    value.slice(-6);

  return (
    <span
      className="block-hash"
      title={value}
    >
      {shortHash}
    </span>
  );
}

function ResultBadge({ result }) {
  if (result === "VERIFIED") {
    return (
      <span className="block-result verified">
        VERIFIED
      </span>
    );
  }

  if (result === "MANUAL_REVIEW") {
    return (
      <span className="block-result review">
        MANUAL REVIEW
      </span>
    );
  }

  return (
    <span className="block-result fallback">
      FALLBACK
    </span>
  );
}

export default AdminBlockchain;