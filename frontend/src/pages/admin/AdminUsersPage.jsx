import { useAuth } from "../../auth/AuthContext";
import { DEMO_USERS, getRoleLabel } from "../../roles";

export default function AdminUsersPage() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Users</h2>
      <p>Manage user access and review current identities in the workspace.</p>

      <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
        {DEMO_USERS.map((member) => (
          <div key={member.id} style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
              <div>
                <strong>{member.name}</strong>
                <div style={{ color: "#475569" }}>{member.email}</div>
              </div>
              <span style={{
                background: member.id === user.id ? "#dbeafe" : "#e2e8f0",
                color: member.id === user.id ? "#1d4ed8" : "#334155",
                padding: "6px 10px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}>
                {member.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div style={{ marginTop: "12px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ background: "#eef2ff", color: "#4338ca", padding: "6px 10px", borderRadius: "999px" }}>
                {getRoleLabel(member.role)}
              </span>
              <span style={{ background: "#f1f5f9", color: "#334155", padding: "6px 10px", borderRadius: "999px" }}>
                {member.department}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
