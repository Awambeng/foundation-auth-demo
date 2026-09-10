import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

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
    // Keycloak puts realm roles in realm_access.roles by default.
    jwt({ token, account }) {
      if (account?.access_token) {
        try {
          const payload = JSON.parse(
            Buffer.from(account.access_token.split(".")[1], "base64url").toString()
          );
          // Use type assertions — the raw JWT fields aren't in the JWT interface
          token.id = payload.sub as string;
          token.roles = (payload.realm_access?.roles as string[]) ?? [];
        } catch {
          token.roles = [];
        }
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
