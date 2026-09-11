import { getUser } from "@/lib/auth-helpers";
import LoginButton from "@/components/LoginButton";

export default async function HomePage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 py-24">
        <h1 className="text-4xl font-bold text-white">Abdullah Foundation</h1>
        <p className="mt-2 text-xl text-gray-300">Authentication Demo</p>

        <p className="mt-6 max-w-lg text-gray-400 leading-relaxed">
          This application demonstrates authentication and role-based authorization
          using <span className="font-medium text-white">Keycloak</span> and{" "}
          <span className="font-medium text-white">Auth.js</span>.
        </p>

        <div className="mt-10">
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center py-24">
      <h1 className="text-4xl font-bold text-white">Abdullah Foundation</h1>
      <p className="mt-2 text-xl text-gray-400">Authentication Demo</p>

      <div className="mt-10 bg-[#2d2d2d] rounded-xl shadow p-8 w-full max-w-sm border border-gray-700">
        <p className="text-lg text-white">
          Welcome, <span className="font-semibold">{user.name}</span>
        </p>
        <p className="mt-1 text-sm text-gray-400">{user.email}</p>

        <div className="mt-3">
          {user.roles.map((r) => (
            <span
              key={r}
              className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
            >
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
