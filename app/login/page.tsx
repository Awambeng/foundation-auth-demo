"use client";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import LoginButton from "@/components/LoginButton";
import { ROLES } from "@/lib/roles";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl");

  // After successful login, redirect based on role
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const roles = session.user.roles ?? [];
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (roles.includes(ROLES.ADMIN)) {
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
      <h1 className="text-2xl font-bold text-white">Sign In</h1>
      <p className="mt-2 text-gray-400">Authenticate with your Keycloak account</p>

      <div className="mt-8">
        <LoginButton callbackUrl={callbackUrl || "/"} />
      </div>
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
