"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ROLES, DONATION_VIEWER_ROLES } from "@/lib/roles";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const roles = user?.roles ?? [];
  const isAdmin = roles.includes(ROLES.ADMIN);
  const hasDonationAccess = DONATION_VIEWER_ROLES.some((r) => roles.includes(r));

  return (
    <nav className="bg-[#2d2d2d] border-b border-gray-700">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-semibold text-lg text-white">
          Abdullah Foundation
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              {hasDonationAccess && (
                <Link href="/donations" className="text-gray-300 hover:text-white">
                  Donations
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" className="text-gray-300 hover:text-white">
                  Admin
                </Link>
              )}
              <span className="text-gray-600">|</span>
              <span className="text-gray-400">{user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/api/auth/keycloak-logout" })}
                className="text-red-400 hover:text-red-300 font-medium"
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
