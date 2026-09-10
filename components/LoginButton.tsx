"use client";

import { signIn } from "next-auth/react";

export default function LoginButton({ callbackUrl }: { callbackUrl?: string }) {
  return (
    <button
      onClick={() => signIn("keycloak", { callbackUrl: callbackUrl || "/" })}
      className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition"
    >
      Login with Keycloak
    </button>
  );
}
