import { auth } from "@/auth";
import type { AuthUser } from "./types";

// ---------------------------------------------------------------------------
// Authorization error
// ---------------------------------------------------------------------------

/**
 * Thrown when authorization fails.
 * Catch in route handlers and return a proper HTTP response,
 * or in pages and redirect appropriately.
 */
export class AuthorizationError extends Error {
  constructor(
    public readonly statusCode: 401 | 403,
    message: string,
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert an Auth.js session into the app-level AuthUser shape. */
function toAuthUser(
  session: {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      roles?: string[];
    };
  } | null,
): AuthUser | null {
  if (!session?.user) return null;
  return {
    id: session.user.id ?? "",
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    roles: session.user.roles ?? [],
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Get the current user or null (never redirects or throws). */
export async function getUser(): Promise<AuthUser | null> {
  const session = await auth();
  return toAuthUser(session);
}

/**
 * Require authentication.
 *
 * Throws AuthorizationError(401) so callers can handle it appropriately:
 * - Server Components / pages: catch + redirect to /login
 * - Route Handlers: catch + return 401 JSON response
 */
export async function requireUser(): Promise<AuthUser> {
  const user = await getUser();
  if (!user) {
    throw new AuthorizationError(401, "Authentication required");
  }
  return user;
}

/**
 * Require a specific realm role.
 *
 * Throws AuthorizationError(401) for missing auth,
 * AuthorizationError(403) for insufficient permissions.
 */
export async function requireRole(roleName: string): Promise<AuthUser> {
  const user = await requireUser(); // may throw 401
  if (!user.roles.includes(roleName)) {
    throw new AuthorizationError(403, `Role '${roleName}' required`);
  }
  return user;
}

/** Convenience: check whether a user has any of the given roles. */
export function hasAnyRole(user: AuthUser, roles: readonly string[]): boolean {
  return roles.some((r) => user.roles.includes(r));
}
