"use client";

import { signIn } from "next-auth/react";

/**
 * Shared "Sign in with Keycloak" button.
 * Used by the home page (logged-out) and the /login page.
 */
export default function LoginButton({ callbackUrl }: { callbackUrl?: string }) {
  return (
    <button
      onClick={() => signIn("keycloak", { callbackUrl: callbackUrl || "/" })}
      className="bg-white text-black px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition flex items-center gap-3"
    >
      <img
        src="/keycloak.webp"
        alt="Keycloak"
        width={24}
        height={24}
        className="rounded"
      />
      Sign in with Keycloak
    </button>
  );
}
