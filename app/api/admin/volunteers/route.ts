import { NextResponse } from "next/server";
import { requireRole, AuthorizationError } from "@/lib/auth-helpers";
import { ROLES } from "@/lib/roles";
import { listVolunteers } from "@/lib/keycloak-admin";

export async function GET() {
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

  try {
    const volunteers = await listVolunteers();
    return NextResponse.json(volunteers);
  } catch (err) {
    console.error("Failed to list volunteers:", err);
    return NextResponse.json({ error: "Failed to list volunteers" }, { status: 500 });
  }
}
