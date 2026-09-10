"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl");

  // After successful login, redirect based on role
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (session.user.roles?.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/donations");
      }
    }
  }, [status, session, callbackUrl, router]);

  if (status === "authenticated") {
    return <div className="text-center mt-20 text-gray-400">Redirecting…</div>;
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
      <p className="mt-2 text-gray-500">Authenticate with your Keycloak account</p>

      <button
        onClick={() => signIn("keycloak", { callbackUrl: callbackUrl || "/" })}
        className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition"
      >
        Login with Keycloak
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-gray-400">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
