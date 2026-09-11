import type { Volunteer } from "@/lib/types";

interface VolunteerListProps {
  volunteers: Volunteer[];
}

export default function VolunteerList({ volunteers }: VolunteerListProps) {
  if (volunteers.length === 0) {
    return <p className="text-gray-400 text-sm italic">No volunteers found.</p>;
  }

  return (
    <div className="bg-[#2d2d2d] rounded-lg shadow overflow-hidden border border-gray-700">
      <table className="w-full text-left">
        <thead className="bg-[#393939] border-b border-gray-700">
          <tr>
            <th className="px-5 py-3 text-sm font-semibold text-gray-300">Name</th>
            <th className="px-5 py-3 text-sm font-semibold text-gray-300">Email</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {volunteers.map((v) => (
            <tr key={v.id}>
              <td className="px-5 py-3 text-white">{v.name}</td>
              <td className="px-5 py-3 text-gray-400">{v.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
