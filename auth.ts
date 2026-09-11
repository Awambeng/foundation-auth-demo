import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { INTERNAL_KEYCLOAK_ROLES } from "@/lib/roles";

// ---------------------------------------------------------------------------
// Module augmentation — extend Session with our custom fields.
// JWT augmentation is NOT done via module declaration (deprecated in v5);
// we use type assertions inside the callbacks instead.
// ---------------------------------------------------------------------------

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
    } & DefaultSession["user"];
  }
}

/** Extract app-relevant realm roles from a Keycloak access token payload. */
function extractRoles(payload: { realm_access?: { roles?: string[] } }): string[] {
  const realmRoles = payload.realm_access?.roles ?? [];
  return realmRoles.filter(
    (r) =>
      !INTERNAL_KEYCLOAK_ROLES.includes(r) &&
      !r.startsWith("default-roles-"),
  );
}

/** Decode the payload segment of a JWT without verifying the signature. */
function decodeJwtPayload(jwt: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString());
}

// ---------------------------------------------------------------------------
// Auth.js v5 configuration
// ---------------------------------------------------------------------------

export const { handlers, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
    }),
  ],

  callbacks: {
    // Decode roles from the Keycloak access_token JWT — no extra HTTP calls.
    // On first sign-in, account is present. On subsequent requests, account
    // is undefined and the token already carries id/roles.
    jwt({ token, account }) {
      if (account?.access_token) {
        try {
          const payload = decodeJwtPayload(account.access_token);
          token.id = payload.sub as string;
          token.roles = extractRoles(payload);
        } catch {
          token.id = token.sub ?? "";
          token.roles = [];
        }
      }
      if (!token.id) {
        token.id = token.sub ?? "";
      }
      return token;
    },

    session({ session, token }) {
      session.user.id = (token.id as string) ?? "";
      session.user.roles = (token.roles as string[]) ?? [];
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
