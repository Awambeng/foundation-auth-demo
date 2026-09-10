import type { Volunteer } from "@/lib/types";

interface VolunteerListProps {
  volunteers: Volunteer[];
}

export default function VolunteerList({ volunteers }: VolunteerListProps) {
  if (volunteers.length === 0) {
    return (
      <p className="text-gray-500 text-sm italic">No volunteers found.</p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-5 py-3 text-sm font-semibold text-gray-600">Name</th>
            <th className="px-5 py-3 text-sm font-semibold text-gray-600">Email</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {volunteers.map((v) => (
            <tr key={v.id}>
              <td className="px-5 py-3">{v.name}</td>
              <td className="px-5 py-3 text-gray-500">{v.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
