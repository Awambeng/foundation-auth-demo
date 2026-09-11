/**
 * Single source of truth for Keycloak role names and access rules.
 * Imported by both server and client code — contains no secrets.
 */

export const ROLES = {
  ADMIN: "admin",
  VOLUNTEER: "volunteer",
} as const;

/** Roles allowed to view /donations. */
export const DONATION_VIEWER_ROLES: readonly string[] = [
  ROLES.ADMIN,
  ROLES.VOLUNTEER,
];

/** Keycloak-internal roles that should never reach the app session. */
export const INTERNAL_KEYCLOAK_ROLES: readonly string[] = [
  "uma_authorization",
  "offline_access",
];
