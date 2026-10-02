export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  APPROVER: "approver",
  STAFF: "staff",
};

export const ROLE_DEFINITIONS = [
  {
    key: ROLES.ADMIN,
    label: "Admin",
    description: "Full access to system configuration and all user administration tools.",
    permissions: ["manage_users", "manage_roles", "approve_requests", "view_finance"],
  },
  {
    key: ROLES.MANAGER,
    label: "Manager",
    description: "Can manage operational workflows and review approvals for their team.",
    permissions: ["approve_requests", "review_reports", "assign_tasks"],
  },
  {
    key: ROLES.APPROVER,
    label: "Approver",
    description: "Can approve requests and comment on spending decisions.",
    permissions: ["approve_requests", "comment_on_requests"],
  },
  {
    key: ROLES.STAFF,
    label: "Staff",
    description: "Access to routine operational workflows and self-service requests.",
    permissions: ["submit_requests", "view_dashboard"],
  },
];

export const DEMO_USERS = [
  {
    id: 1,
    name: "Nexus Admin",
    email: "admin@nexus.com",
    password: "admin123",
    role: ROLES.ADMIN,
    roles: [ROLES.ADMIN],
    department: "IT",
    active: true,
  },
  {
    id: 2,
    name: "Operations Manager",
    email: "manager@nexus.com",
    password: "manager123",
    role: ROLES.MANAGER,
    roles: [ROLES.MANAGER, ROLES.APPROVER],
    department: "Operations",
    active: true,
  },
  {
    id: 3,
    name: "Procurement Staff",
    email: "staff@nexus.com",
    password: "staff123",
    role: ROLES.STAFF,
    roles: [ROLES.STAFF],
    department: "Procurement",
    active: true,
  },
];

export function getRoleLabel(role) {
  const match = ROLE_DEFINITIONS.find((entry) => entry.key === role);
  return match ? match.label : role;
}

export function hasAnyRole(user, allowedRoles = []) {
  if (!user) return false;
  const userRoles = Array.isArray(user.roles) ? user.roles : [user.role];
  return allowedRoles.some((role) => userRoles.includes(role));
}
