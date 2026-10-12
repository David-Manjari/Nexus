// Shared helpers for talking to the Flask backend (Member 4).
// Mock mode is the default. Set VITE_USE_MOCK=false in frontend/.env.local to use the real API.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

// In development Vite forwards /api/... to Flask (see vite.config.js).
const BASE = import.meta.env.VITE_API_URL ?? "/api";

export async function api(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      credentials: "include",
      headers: body === undefined ? {} : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach the server. Check that the backend is running.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // The response had no JSON body.
  }

  if (!response.ok) {
    if (response.status === 401) throw new Error("Please sign in again.");
    throw new Error(data?.error ?? `Request failed (${response.status})`);
  }
  return data;
}

// The backend sends dates like "Sun, 01 Nov 2026 00:00:00 GMT". The pages expect ISO text.
export const toIso = (value) => (value ? new Date(value).toISOString() : null);
export const toDateOnly = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

// Backend history rows -> the { status, note, by, at } shape RequestTimeline expects.
export const mapHistory = (history = [], mapStatus = (status) => status) =>
  history.map((entry) => ({
    status: mapStatus(entry.status),
    note: entry.note ?? "",
    by: entry.by,
    at: toIso(entry.at),
  }));
