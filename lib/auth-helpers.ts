import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { AuthUser } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert an Auth.js session into the app-level AuthUser shape. */
function toAuthUser(session: { user?: { id?: string; name?: string | null; email?: string | null; roles?: string[] } } | null): AuthUser | null {
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

/** Get the current user or null (never redirects). */
export async function getUser(): Promise<AuthUser | null> {
  const session = await auth();
  return toAuthUser(session);
}

/** Require authentication — redirects to /login if anonymous. */
export async function requireUser(): Promise<AuthUser> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/** Require a specific realm role — redirects to /unauthorized if missing. */
export async function requireRole(roleName: string): Promise<AuthUser> {
  const user = await requireUser();
  if (!user.roles.includes(roleName)) redirect("/unauthorized");
  return user;
}

/** Convenience: check roles without redirecting. */
export function hasRole(user: AuthUser, role: string): boolean {
  return user.roles.includes(role);
}
