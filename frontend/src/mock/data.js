export const ITEM_STATUS={
  AVAILABLE: "available",
  ASSIGNED: "assigned",
  MAINTENANCE: "maintenance",
};

export const tools=[
  { id: "tool-1", type: "tool", name: "Cordless Drill", category: "Power tool", brand: "Bosch", sku: "TL-001", image: "", status: "available", assignedTo: null },
  { id: "tool-2", type: "tool", name: "Tape Measure", category: "Hand tool", brand: "Stanley", sku: "TL-002", image: "", status: "available", assignedTo: null },
  { id: "tool-3", type: "tool", name: "Angle Grinder", category: "Power tool", brand: "Makita", sku: "TL-003", image: "", status: "maintenance", assignedTo: null }
];

export const assignments=[];
export const notifications = [
  { id: "notif-1", userId: "user-1", message: "You were assigned: Cordless Drill", type: "assignment", read: false, emailSent: true, createdAt: "2026-10-01T08:30:00Z" },
  { id: "notif-2", userId: "user-1", message: "Request #12 was escalated to you", type: "escalation", read: false, emailSent: true, createdAt: "2026-10-01T09:10:00Z" },
  { id: "notif-3", userId: "user-1", message: "Welcome to NEXUS", type: "info", read: true, emailSent: false, createdAt: "2026-09-30T12:00:00Z" },

export const notifications = [
  {
    id: 101,
    userId: 1,
    message: "System maintenance window scheduled for Saturday at 02:00.",
    type: "info",
    read: false,
    emailSent: true,
    createdAt: "2026-10-01T08:30:00.000Z",
  },
  {
    id: 102,
    userId: 2,
    message: "New purchase approval is waiting for your review.",
    type: "approval",
    read: false,
    emailSent: true,
    createdAt: "2026-10-02T09:15:00.000Z",
  },
  {
    id: 103,
    userId: 3,
    message: "Your procurement request was acknowledged by the team.",
    type: "status",
    read: true,
    emailSent: false,
    createdAt: "2026-10-01T15:40:00.000Z",
  },
];