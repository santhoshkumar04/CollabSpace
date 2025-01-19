import { v4 as uuid } from "uuid";

export function generateInviteCode() {
  return uuid().replace(/-/g, "").substring(0, 8);
}

export function generateTaskCode() {
  return `task-${uuid().replace(/-/g, "").substring(0, 3)}`;
}
