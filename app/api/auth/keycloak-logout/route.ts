import { NextResponse } from "next/server";

/**
 * Redirects to Keycloak's logout endpoint, which destroys the KC session
 * and then redirects back to the app.
 *
 * Flow:
 * 1. User clicks Logout in the app
 * 2. Auth.js signOut cleans up the Next.js session
 * 3. Redirects here → redirects to Keycloak logout
 * 4. Keycloak destroys its session
 * 5. Keycloak redirects back to post_logout_redirect_uri
 */
export async function GET() {
  const issuer = process.env.AUTH_KEYCLOAK_ISSUER!;
  const clientId = process.env.AUTH_KEYCLOAK_ID!;
  const postLogoutRedirectUri = process.env.AUTH_URL || "http://localhost:3000";

  const keycloakLogoutUrl =
    `${issuer}/protocol/openid-connect/logout` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;

  return NextResponse.redirect(keycloakLogoutUrl);
}
