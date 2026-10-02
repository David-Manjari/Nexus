// Requests API (Member 4). Phase 2: swap each body for a fetch() to Flask.
import * as inventoryData from "../mock/data";
import {
  requests,
  procurements,
  fallbackDevices,
  fallbackVehicles,
} from "../mock/requestsData";

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();
const copy = (value) => JSON.parse(JSON.stringify(value));
const byNewest = (a, b) => b.createdAt.localeCompare(a.createdAt);
const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

function allItems() {
  const tools = inventoryData.tools ?? [];
  const devices = inventoryData.devices ?? fallbackDevices;
  const vehicles = inventoryData.vehicles ?? fallbackVehicles;
  return [...tools, ...devices, ...vehicles];
}

// GET /api/requestable-items  ->  [{ id, type, name, category, status }]
export async function getRequestableItems() {
  await wait();
  return copy(allItems());
}

// GET /api/requests?userId=  ->  [request]
export async function getMyRequests(userId) {
  await wait();
  return copy(requests.filter((r) => r.userId === userId).sort(byNewest));
}

// GET /api/requests?status=pending  ->  [request]
export async function getIncomingRequests() {
  await wait();
  return copy(requests.filter((r) => r.status === "pending").sort(byNewest));
}

// POST /api/requests  { itemId, quantity, reason, neededBy }  ->  request
// Available item -> goes to store manager. Unavailable -> procurement draft is created.
export async function createRequest({ itemId, quantity, reason, neededBy }, user) {
  await wait();
  if (!user) throw new Error("You must be logged in.");

  const item = allItems().find((i) => i.id === itemId);
  if (!item) throw new Error("That item no longer exists.");

  const at = now();
  const request = {
    id: makeId("req"),
    userId: user.id,
    requestedBy: user.name,
    itemId: item.id,
    itemName: item.name,
    itemType: item.type,
    quantity: Number(quantity),
    reason: String(reason).trim(),
    neededBy,
    status: "pending",
    procurementId: null,
    createdAt: at,
    history: [{ status: "submitted", note: "Request submitted", by: user.name, at }],
  };

  if (item.status === "available") {
    request.history.push({ status: "pending", note: "Item available. Sent to store manager.", by: "System", at });
  } else {
    const procurement = {
      id: makeId("proc"),
      requestId: request.id,
      itemName: item.name,
      itemType: item.type,
      quantity: request.quantity,
      estimatedCost: null,
      supplier: "",
      notes: `Auto-created: item is ${item.status}`,
      status: "draft",
      approvalLevel: 0,
      createdBy: "System",
      createdAt: at,
      history: [{ status: "draft", note: `Created from request ${request.id}`, by: "System", at }],
    };
    procurements.push(procurement);
    request.status = "procurement";
    request.procurementId = procurement.id;
    request.history.push({
      status: "procurement",
      note: `Item is ${item.status}. Procurement request created.`,
      by: "System",
      at,
    });
  }

  requests.push(request);
  return copy(request);
}
