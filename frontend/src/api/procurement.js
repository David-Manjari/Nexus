// Procurement API (Member 4). Uses the mock data by default.
// Set VITE_USE_MOCK=false (frontend/.env.local) to use the Flask backend instead.
import { USE_MOCK } from "./http";
import * as mock from "./procurement.mock";
import * as real from "./procurement.real";

const api = USE_MOCK ? mock : real;

export const getProcurements = api.getProcurements;
export const getProcurementById = api.getProcurementById;
export const createProcurement = api.createProcurement;
export const updateProcurement = api.updateProcurement;
export const escalateProcurement = api.escalateProcurement;
export const getProcurementsAwaitingApproval = api.getProcurementsAwaitingApproval;
