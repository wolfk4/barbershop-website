const SAFE_USERNAME_CHARACTERS = /^[A-Za-z0-9._@-]+$/

/**
 * Only allow username characters accepted by the employee login rules.
 */
export function sqlInjectCheck(username: string): boolean {
  return SAFE_USERNAME_CHARACTERS.test(username)
}