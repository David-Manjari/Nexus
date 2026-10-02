// Components must only call these functions, never mock/data.js directly.
// Phase 2: replace each body with a fetch() call to the Flask API.
//
// Notification shape (matches mock/data.js):
// { id, userId, message, type, read, emailSent, createdAt }
// IDs are strings like "notif-1" to match the rest of the mock data.
import { notifications } from "../mock/data";

export async function getNotifications(userId) {
  return notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getUnreadCount(userId) {
  return notifications.filter((n) => n.userId === userId && !n.read).length;
}

export async function markAsRead(id) {
  const n = notifications.find((item) => item.id === id);
  if (!n) throw new Error("Notification not found");
  n.read = true;
  return n;
}

export async function markAllAsRead(userId) {
  notifications.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
  return true;
}

// Called by Members 4 and 5 when someone is assigned something
// or a request is escalated to them.
export async function createNotification({ userId, message, type = "info" }) {
  if (!userId || !message) throw new Error("userId and message are required");
  const n = {
    id: `notif-${Date.now()}`,
    userId,
    message,
    type,
    read: false,
    emailSent: true, // Phase 1: only shown as an "email sent" label
    createdAt: new Date().toISOString(),
  };
  notifications.push(n);
  return n;
}