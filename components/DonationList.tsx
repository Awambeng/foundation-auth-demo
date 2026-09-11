import type { Donation } from "@/lib/types";

const DONATIONS: Donation[] = [
  { id: "001", donor: "John Doe", amount: 50_000, currency: "FCFA" },
  { id: "002", donor: "Mary Smith", amount: 25_000, currency: "FCFA" },
  { id: "003", donor: "Peter Brown", amount: 100_000, currency: "FCFA" },
];

export default function DonationList() {
  return (
    <div className="space-y-4">
      {DONATIONS.map((d) => (
        <div
          key={d.id}
          className="bg-[#2d2d2d] rounded-lg shadow p-5 flex justify-between items-center border border-gray-700"
        >
          <div>
            <p className="font-semibold text-white">Donation #{d.id}</p>
            <p className="text-sm text-gray-400">Donor: {d.donor}</p>
          </div>
          <span className="text-lg font-bold text-green-400">
            {d.amount.toLocaleString()} {d.currency}
          </span>
        </div>
      ))}
    </div>
  );
}
