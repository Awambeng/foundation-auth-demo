import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-helpers";
import { createVolunteer } from "@/lib/keycloak-admin";

export async function POST(req: Request) {
  // Only admins can create volunteers — server-side enforcement.
  await requireRole("admin");

  const body = await req.json();
  const { name, email } = body as { name?: string; email?: string };

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  try {
    const result = await createVolunteer(name.trim(), email.trim());
    return NextResponse.json({ ok: true, userId: result.id });
  } catch (err) {
    console.error("Failed to create volunteer:", err);
    return NextResponse.json({ error: "Failed to create volunteer" }, { status: 500 });
  }
}
