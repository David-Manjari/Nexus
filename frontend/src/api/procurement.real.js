// Procurement API (Member 4) - real version. Talks to Flask through /api (see http.js).
import { api, mapHistory, toIso } from "./http";

function toProcurement(p) {
  return {
    id: p.procurement_id,
    requestId: p.request_id,
    itemName: p.item_name,
    itemType: p.asset_type ?? "tool",
    quantity: p.quantity,
    estimatedCost: p.estimated_cost == null ? null : Number(p.estimated_cost),
    supplier: p.supplier ?? "",
    notes: p.reason ?? "",
    status: p.status,
    approvalLevel: p.status === "pending_approval" ? 1 : 0,
    createdBy: p.raised_by_name,
    createdAt: toIso(p.created_at),
    history: mapHistory(p.history),
  };
}

// The backend rejects empty text, so leave blank fields out.
function toBody(fields) {
  const body = {
    item_name: fields.itemName?.trim(),
    asset_type: fields.itemType,
    quantity: Number(fields.quantity),
    estimated_cost: Number(fields.estimatedCost),
    supplier: fields.supplier?.trim(),
    reason: fields.notes?.trim(),
  };
  for (const key of Object.keys(body)) {
    if (body[key] === undefined || body[key] === "" || Number.isNaN(body[key])) delete body[key];
  }
  return body;
}

// GET /procurements  ->  [procurement]
export async function getProcurements() {
  const data = await api("/procurements");
  return data.procurements.map(toProcurement);
}

// GET /procurements/:id  ->  procurement
export async function getProcurementById(id) {
  const data = await api(`/procurements/${id}`);
  return toProcurement(data.procurement);
}

// POST /procurements  ->  procurement
export async function createProcurement(fields) {
  const data = await api("/procurements", { method: "POST", body: toBody(fields) });
  return toProcurement(data.procurement);
}

// PATCH /procurements/:id  (drafts only)  ->  procurement
export async function updateProcurement(id, fields) {
  const data = await api(`/procurements/${id}`, { method: "PATCH", body: toBody(fields) });
  return toProcurement(data.procurement);
}

// PATCH /procurements/:id  { action: "submit" }  ->  procurement   (draft -> awaiting approval)
export async function escalateProcurement(id) {
  const data = await api(`/procurements/${id}`, { method: "PATCH", body: { action: "submit" } });
  return toProcurement(data.procurement);
}

// ---- For Member 5 (Approvals) -------------------------------------------

// GET /procurements?status=pending_approval  ->  [procurement]
export async function getProcurementsAwaitingApproval() {
  const data = await api("/procurements?status=pending_approval");
  return data.procurements.map(toProcurement);
}
