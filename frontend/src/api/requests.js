// Requests API (Member 4). Uses the mock data by default.
// Set VITE_USE_MOCK=false (frontend/.env.local) to use the Flask backend instead.
import { USE_MOCK } from "./http";
import * as mock from "./requests.mock";
import * as real from "./requests.real";

const api = USE_MOCK ? mock : real;

export const getRequestableItems = api.getRequestableItems;
export const getMyRequests = api.getMyRequests;
export const getIncomingRequests = api.getIncomingRequests;
export const createRequest = api.createRequest;
