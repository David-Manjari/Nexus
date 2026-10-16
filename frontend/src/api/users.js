import { DEMO_USERS } from "../roles";
import { apiRequest } from "./http";

export async function getUsers() {
  return DEMO_USERS.map(({ id, name, email, role, department, active }) => ({
    id, name, email, role, department, active,
  }));
}

export async function getAssignableUsers() {
  const { users } = await apiRequest("/users/assignable");
  return users.map((user) => ({
    id: user.user_id,
    name: user.username,
    role: user.role,
  }));
}