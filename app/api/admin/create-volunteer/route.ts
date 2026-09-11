import { NextResponse } from "next/server";
import { requireRole, AuthorizationError } from "@/lib/auth-helpers";
import { ROLES } from "@/lib/roles";
import { createVolunteer } from "@/lib/keycloak-admin";

export async function POST(req: Request) {
  try {
    await requireRole(ROLES.ADMIN);
  } catch (err) {
    if (err instanceof AuthorizationError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode },
      );
    }
    throw err;
  }

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
