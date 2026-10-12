// Requests API (Member 4) - real version. Talks to Flask through /api (see http.js).
import { api, mapHistory, toDateOnly, toIso } from "./http";

// Backend request status -> the status names the pages already know.
const STATUS = { fulfilled: "issued", converted: "procurement", rejected: "declined" };
const mapStatus = (status) => STATUS[status] ?? status;

function toRequest(r) {
  return {
    id: r.request_id,
    userId: r.requested_by,
    requestedBy: r.requester_name,
    itemId: r.asset_id,
    itemName: r.item_name ?? (r.asset_id ? `Asset #${r.asset_id}` : ""),
    itemType: r.asset_type ?? "",
    quantity: r.quantity,
    reason: r.reason,
    neededBy: toDateOnly(r.needed_by),
    status: mapStatus(r.status),
    createdAt: toIso(r.created_at),
    history: mapHistory(r.history, mapStatus),
  };
}

const toItem = (a) => ({
  id: a.asset_id,
  type: a.asset_type,
  name: a.name,
  category: a.category,
  status: a.status,
});

let itemCache = new Map();

// GET /assets  ->  [{ id, type, name, category, status }]
export async function getRequestableItems() {
  const data = await api("/assets");
  const items = data.assets.map(toItem);
  itemCache = new Map(items.map((item) => [item.id, item]));
  return items;
}

// GET /requests  ->  [request]  (only the signed-in user's own)
export async function getMyRequests(userId) {
  const data = await api("/requests");
  return data.requests
    .filter((r) => userId === undefined || r.requested_by === userId)
    .map(toRequest);
}

// GET /requests?status=pending  ->  [request]
export async function getIncomingRequests() {
  const data = await api("/requests?status=pending");
  return data.requests.map(toRequest);
}

async function findItem(itemId) {
  const id = Number(itemId);
  if (itemCache.has(id)) return itemCache.get(id);
  try {
    return toItem((await api(`/assets/${id}`)).asset);
  } catch {
    throw new Error("That item no longer exists.");
  }
}

// POST /requests  { itemId, quantity, reason, neededBy }  ->  request
// In stock -> store manager. Not in stock -> the backend raises a procurement draft.
export async function createRequest({ itemId, quantity, reason, neededBy }, user) {
  if (!user) throw new Error("You must be logged in.");
  const item = await findItem(itemId);
  const data = await api("/requests", {
    method: "POST",
    body: {
      request_type: "asset",
      asset_id: item.id,
      asset_type: item.type,
      item_name: item.name,
      category: item.category || undefined,
      quantity: Number(quantity),
      reason: String(reason).trim(),
      needed_by: neededBy,
    },
  });
  return toRequest(data.request);
}
