import { sqlInjectCheck } from "@/lib/sql-inject-check";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmployeeEmail(email: string): boolean {
  return email.length <= 255 && sqlInjectCheck(email) && EMAIL_PATTERN.test(email);
}

export function parseEmployeeId(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}
