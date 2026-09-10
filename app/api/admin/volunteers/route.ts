import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-helpers";
import { listVolunteers } from "@/lib/keycloak-admin";

export async function GET() {
  // Only admins can list volunteers — server-side enforcement.
  await requireRole("admin");

  try {
    const volunteers = await listVolunteers();
    return NextResponse.json(volunteers);
  } catch (err) {
    console.error("Failed to list volunteers:", err);
    return NextResponse.json({ error: "Failed to list volunteers" }, { status: 500 });
  }
}
