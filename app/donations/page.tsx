import { redirect } from "next/navigation";
import { requireUser, hasAnyRole, AuthorizationError } from "@/lib/auth-helpers";
import { DONATION_VIEWER_ROLES } from "@/lib/roles";
import DonationList from "@/components/DonationList";

export default async function DonationsPage() {
  let user;
  try {
    user = await requireUser();
    if (!hasAnyRole(user, DONATION_VIEWER_ROLES)) {
      redirect("/unauthorized");
    }
  } catch (err) {
    if (err instanceof AuthorizationError) {
      redirect("/login?callbackUrl=/donations");
    }
    throw err;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Donations</h1>
      <DonationList />
    </div>
  );
}
