import Link from "next/link";
import { getUser, hasRole } from "@/lib/auth-helpers";
import LoginButton from "@/components/LoginButton";

export default async function HomePage() {
  const user = await getUser();

  return (
    <div className="flex flex-col items-center text-center mt-16">
      <h1 className="text-4xl font-bold text-gray-900">Abdullah Foundation</h1>
      <p className="mt-2 text-xl text-gray-500">Authentication Demo</p>

      <p className="mt-6 max-w-lg text-gray-600 leading-relaxed">
        This application demonstrates authentication and role-based authorization
        using <span className="font-medium">Keycloak</span> and{" "}
        <span className="font-medium">Auth.js</span>.
      </p>

      {user ? (
        <div className="mt-10 bg-white rounded-xl shadow p-8 w-full max-w-sm">
          <p className="text-lg">
            Welcome, <span className="font-semibold">{user.name}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">{user.email}</p>

          <div className="mt-3">
            {user.roles.map((r) => (
              <span
                key={r}
                className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
              >
                {r}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/donations"
              className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium"
            >
              View Donations
            </Link>
            {hasRole(user, "admin") && (
              <Link
                href="/admin"
                className="bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 font-medium"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <LoginButton />
        </div>
      )}
    </div>
  );
}
