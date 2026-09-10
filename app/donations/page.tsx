import { requireUser } from "@/lib/auth-helpers";
import DonationList from "@/components/DonationList";

export default async function DonationsPage() {
  const user = await requireUser();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Donations</h1>

      <div className="bg-white rounded-lg shadow p-5 mb-8">
        <p className="text-sm text-gray-500">Logged in as</p>
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
        <div className="mt-2">
          {user.roles.map((r) => (
            <span
              key={r}
              className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      <DonationList />
    </div>
  );
}
