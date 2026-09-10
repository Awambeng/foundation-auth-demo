"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import VolunteerList from "@/components/VolunteerList";
import type { Volunteer } from "@/lib/types";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);

  // Fetch real volunteers from Keycloak on mount
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/admin/volunteers")
      .then((res) => (res.ok ? res.json() : []))
      .then(setVolunteers)
      .catch(() => setVolunteers([]))
      .finally(() => setLoadingVolunteers(false));
  }, [status]);

  if (status === "loading") {
    return <div className="text-center mt-20 text-gray-400">Loading…</div>;
  }

  if (!session) {
    router.push("/login?callbackUrl=/admin");
    return null;
  }

  async function handleCreateVolunteer(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/create-volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        setMessage("Volunteer created successfully!");
        setName("");
        setEmail("");
        setShowForm(false);
        // Re-fetch the volunteer list
        setLoadingVolunteers(true);
        const updated = await fetch("/api/admin/volunteers").then((r) =>
          r.ok ? r.json() : []
        );
        setVolunteers(updated);
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to create volunteer");
      }
    } catch {
      setMessage("Network error");
    } finally {
      setSubmitting(false);
      setLoadingVolunteers(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome, Admin!</h1>
      <p className="text-gray-500 mb-8">Admin Dashboard</p>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Volunteers</h2>
      {loadingVolunteers ? (
        <p className="text-gray-400 text-sm">Loading volunteers…</p>
      ) : (
        <VolunteerList volunteers={volunteers} />
      )}

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes("success")
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 font-medium"
        >
          Create Volunteer
        </button>
        <button
          onClick={() => router.push("/donations")}
          className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 font-medium"
        >
          View Donations
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateVolunteer}
          className="mt-6 bg-white rounded-lg shadow p-6 max-w-md space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create"}
          </button>
        </form>
      )}
    </div>
  );
}
