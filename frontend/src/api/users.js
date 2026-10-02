import { DEMO_USERS } from "../roles";

export async function getUsers() {
  return DEMO_USERS.map(({ id, name, email, role, department, active }) => ({
    id, name, email, role, department, active,
  }));
}