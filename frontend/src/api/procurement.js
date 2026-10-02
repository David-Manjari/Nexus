// Procurement API (Member 4). Phase 2: swap each body for a fetch() to Flask.
import { requests, procurements } from "../mock/requestsData";

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();
const copy = (value) => JSON.parse(JSON.stringify(value));
const byNewest = (a, b) => b.createdAt.localeCompare(a.createdAt);
const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

function findProcurement(id) {
  const procurement = procurements.find((p) => p.id === id);
  if (!procurement) throw new Error("Procurement request not found.");
  return procurement;
}

function logOnLinkedRequest(procurement, entry) {
  if (!procurement.requestId) return;
  const request = requests.find((r) => r.id === procurement.requestId);
  if (request) request.history.push(entry);
}

// GET /api/procurements  ->  [procurement]
export async function getProcurements() {
  await wait();
  return copy([...procurements].sort(byNewest));
}

// GET /api/procurements/:id  ->  procurement
export async function getProcurementById(id) {
  await wait();
  return copy(findProcurement(id));
}

// POST /api/procurements  { itemName, itemType, quantity, estimatedCost, supplier, notes }  ->  procurement
export async function createProcurement(fields, user) {
  await wait();
  const at = now();
  const procurement = {
    id: makeId("proc"),
    requestId: null,
    itemName: fields.itemName.trim(),
    itemType: fields.itemType,
    quantity: Number(fields.quantity),
    estimatedCost: Number(fields.estimatedCost),
    supplier: fields.supplier.trim(),
    notes: fields.notes.trim(),
    status: "draft",
    approvalLevel: 0,
    createdBy: user.name,
    createdAt: at,
    history: [{ status: "draft", note: "Procurement request created", by: user.name, at }],
  };
  procurements.push(procurement);
  return copy(procurement);
}

// PUT /api/procurements/:id  (drafts only)  ->  procurement
export async function updateProcurement(id, fields, user) {
  await wait();
  const procurement = findProcurement(id);
  if (procurement.status !== "draft") throw new Error("Only drafts can be edited.");
  procurement.itemName = fields.itemName.trim();
  procurement.itemType = fields.itemType;
  procurement.quantity = Number(fields.quantity);
  procurement.estimatedCost = Number(fields.estimatedCost);
  procurement.supplier = fields.supplier.trim();
  procurement.notes = fields.notes.trim();
  procurement.history.push({ status: "draft", note: "Details updated", by: user.name, at: now() });
  return copy(procurement);
}

// POST /api/procurements/:id/escalate  ->  procurement   (push up the chain to level 1)
export async function escalateProcurement(id, user) {
  await wait();
  const procurement = findProcurement(id);
  if (procurement.status !== "draft") throw new Error("This request has already been sent.");
  if (!procurement.estimatedCost || !procurement.supplier) {
    throw new Error("Add an estimated cost and supplier before sending.");
  }
  const at = now();
  procurement.status = "pending_approval";
  procurement.approvalLevel = 1;
  procurement.history.push({ status: "pending_approval", note: "Sent to approver (level 1)", by: user.name, at });
  logOnLinkedRequest(procurement, { status: "pending_approval", note: "Procurement sent for approval", by: user.name, at });
  return copy(procurement);
}

// ---- For Member 5 (Approvals) -------------------------------------------

// GET /api/procurements?status=pending_approval  ->  [procurement]
export async function getProcurementsAwaitingApproval() {
  await wait();
  return copy(procurements.filter((p) => p.status === "pending_approval").sort(byNewest));
}

// POST /api/procurements/:id/decision  { decision: "approved" | "rejected", comment }  ->  procurement
// Level 1 approval moves it to level 2; level 2 approval makes it final.
export async function recordApprovalDecision(id, { decision, comment = "" }, user) {
  await wait();
  const procurement = findProcurement(id);
  if (procurement.status !== "pending_approval") throw new Error("This request is not awaiting approval.");

  const at = now();
  const level = procurement.approvalLevel;
  const suffix = comment.trim() ? `: ${comment.trim()}` : "";

  if (decision === "rejected") {
    procurement.status = "rejected";
    procurement.history.push({ status: "rejected", note: `Rejected at level ${level}${suffix}`, by: user.name, at });
  } else if (level < 2) {
    procurement.approvalLevel = level + 1;
    procurement.history.push({ status: "pending_approval", note: `Approved at level ${level}, sent to level ${level + 1}${suffix}`, by: user.name, at });
  } else {
    procurement.status = "approved";
    procurement.history.push({ status: "approved", note: `Final approval${suffix}`, by: user.name, at });
  }

  logOnLinkedRequest(procurement, { status: procurement.status, note: `Procurement ${procurement.status.replace("_", " ")}`, by: user.name, at });
  return copy(procurement);
}
