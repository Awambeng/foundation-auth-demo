"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.roles?.includes("admin") ?? false;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-semibold text-lg text-indigo-700">
          Abdullah Foundation
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/donations" className="hover:text-indigo-600">
                Donations
              </Link>
              {isAdmin && (
                <Link href="/admin" className="hover:text-indigo-600">
                  Admin
                </Link>
              )}
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">{user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/api/auth/keycloak-logout" })}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
