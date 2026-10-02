import {EXTERNAL_API_URL} from "./config";
import {tools, assignments} from "../mock/data";

const SOURCES={
  device: ["laptops", "tablets", "smartphones"],
  vehicle: ["vehicle", "motorcycle"],
};

const created=[];
const deleted=new Set();
const overrides={};

const toItem=(type, p) => ({
  id: `${type}-${p.id}`,
  type,
  name: p.title,
  category: p.category,
  brand: p.brand ?? "",
  sku: p.sku ?? "",
  image: p.thumbnail,
  status: "available",
  assignedTo: null,
});

async function fetchCategory(category, signal){
  const res = await fetch(`${EXTERNAL_API_URL}/products/category/${category}`, {signal});
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return (await res.json()).products;
}

export async function getItems(type, {signal}={}){
  const base =
    type==="tool"
      ? tools
      : (await Promise.all(SOURCES[type].map((c) => fetchCategory(c, signal))))
          .flat()
          .map((p) => toItem(type, p));

  return [...base, ...created.filter((i) => i.type === type)]
    .filter((i) => !deleted.has(i.id))
    .map((i) => ({ ...i, ...overrides[i.id] }));
}

export async function createItem(type, data){
  const item = { id: `${type}-new-${Date.now()}`, type, status: "available", assignedTo: null, image: "", ...data };
  created.push(item);
  return item;
}

export async function updateItem(id, changes){
  overrides[id] = {...overrides[id], ...changes};
}

export async function deleteItem(id){
  deleted.add(id);
}

export async function assignItem(id, userId){
  const item = (await getItems(id.split("-")[0])).find((i) => i.id===id);
  if (item?.status !== "available") throw new Error("Item is not available");
  overrides[id] = {...overrides[id], status: "assigned", assignedTo: userId};
  assignments.push({id: assignments.length + 1, itemId: id, userId, assignedAt: new Date().toISOString(), returnedAt: null});
}

export async function returnItem(id){
  overrides[id] = {...overrides[id], status: "available", assignedTo: null};
  const open = assignments.find((a) => a.itemId===id && !a.returnedAt);
  if (open) open.returnedAt = new Date().toISOString();
}

export const getAssignmentHistory=async(id)=>
  assignments.filter((a) => a.itemId===id).reverse();