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
  UserCheck,
  Fingerprint,
  Eye,
} from "lucide-react";

function AdminVoters() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // TEMPORARY FRONTEND DATA
  // Later this will come from the Django/PostgreSQL voters table.
  const voters = [
    {
      voterId: "V001",
      name: "Test Voter",
      identityReference: "IDREF001",
      fingerprintRegistered: true,
      status: "ACTIVE",
    },
  ];

  const filteredVoters = voters.filter((voter) =>
    voter.voterId
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    voter.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    voter.identityReference
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
            onClick={() =>
              navigate("/admin/dashboard")
            }
          />

          <AdminNav
            icon={<Users />}
            text="Voters"
            active
          />

          <AdminNav
            icon={<ClipboardCheck />}
            text="Verifications"
            onClick={() =>
              navigate("/admin/verifications")
            }
          />

          <AdminNav
            icon={<AlertTriangle />}
            text="Manual Review"
            onClick={() =>
              navigate("/admin/manual-review")
            }
          />

          <AdminNav
            icon={<BrainCircuit />}
            text="AI Risk Monitor"
            onClick={() =>
              navigate("/admin/risk")
            }
          />

          <AdminNav
            icon={<Link2 />}
            text="Blockchain Audit"
            onClick={() =>
              navigate("/admin/blockchain")
            }
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
            onClick={() =>
              navigate("/admin/login")
            }
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
              VOTER MANAGEMENT
            </p>

            <h1>Registered Voters</h1>

            <p>
              View voter identity and biometric
              registration status.
            </p>
          </div>

          <div className="admin-system-status">
            <span className="status-dot"></span>
            Database Connected
          </div>

        </header>

        {/* SUMMARY */}
        <section className="voter-admin-summary">

          <div className="voter-admin-stat">

            <div className="voter-admin-stat-icon">
              <Users size={20} />
            </div>

            <div>
              <span>Total Voters</span>
              <strong>{voters.length}</strong>
            </div>

          </div>

          <div className="voter-admin-stat">

            <div className="voter-admin-stat-icon success">
              <UserCheck size={20} />
            </div>

            <div>
              <span>Active Voters</span>

              <strong>
                {
                  voters.filter(
                    (v) => v.status === "ACTIVE"
                  ).length
                }
              </strong>
            </div>

          </div>

          <div className="voter-admin-stat">

            <div className="voter-admin-stat-icon">
              <Fingerprint size={20} />
            </div>

            <div>
              <span>Biometric Registered</span>

              <strong>
                {
                  voters.filter(
                    (v) =>
                      v.fingerprintRegistered
                  ).length
                }
              </strong>
            </div>

          </div>

        </section>

        {/* TABLE CARD */}
        <section className="admin-voters-panel">

          <div className="admin-voters-header">

            <div>
              <p className="small-label">
                VOTER DATABASE
              </p>

              <h2>Voter Records</h2>
            </div>

            <div className="admin-voter-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search voter..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

          </div>

          <div className="admin-voters-table-wrapper">

            <table className="admin-voters-table">

              <thead>
                <tr>
                  <th>Voter ID</th>
                  <th>Name</th>
                  <th>Identity Reference</th>
                  <th>Fingerprint</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredVoters.map((voter) => (

                  <tr key={voter.voterId}>

                    <td>
                      <div className="admin-voter-id">

                        <div className="admin-voter-avatar">
                          {voter.voterId
                            .slice(-2)}
                        </div>

                        <strong>
                          {voter.voterId}
                        </strong>

                      </div>
                    </td>

                    <td>
                      {voter.name}
                    </td>

                    <td>
                      <span className="identity-reference">
                        {voter.identityReference}
                      </span>
                    </td>

                    <td>
                      {voter.fingerprintRegistered ? (
                        <span className="biometric-status registered">
                          <Fingerprint size={13} />
                          Registered
                        </span>
                      ) : (
                        <span className="biometric-status missing">
                          Not Registered
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="voter-active-status">
                        {voter.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="admin-view-button"
                        onClick={() =>
                          alert(
                            `Voter details: ${voter.voterId}`
                          )
                        }
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>

                  </tr>

                ))}

                {filteredVoters.length === 0 && (

                  <tr>
                    <td
                      colSpan="6"
                      className="admin-empty-table"
                    >
                      No voter records found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

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

export default AdminVoters;