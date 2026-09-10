/**
 * Lightweight Keycloak Admin API client.
 *
 * All functions run server-side only.  Environment variables are never
 * prefixed with NEXT_PUBLIC_ so they never reach the browser.
 */

const KC_URL = process.env.KEYCLOAK_ADMIN_URL!;
const KC_ADMIN_REALM = process.env.KEYCLOAK_ADMIN_REALM!;
const KC_ADMIN_CLIENT_ID = process.env.KEYCLOAK_ADMIN_CLIENT_ID!;
const KC_ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN_USERNAME!;
const KC_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD!;
const TARGET_REALM = "abdullah-foundation";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function getAdminToken(): Promise<string> {
  const res = await fetch(
    `${KC_URL}/realms/${KC_ADMIN_REALM}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "password",
        client_id: KC_ADMIN_CLIENT_ID,
        username: KC_ADMIN_USERNAME,
        password: KC_ADMIN_PASSWORD,
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to obtain Keycloak admin token");
  const data = await res.json();
  return data.access_token;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function createVolunteer(name: string, email: string): Promise<{ id: string }> {
  const token = await getAdminToken();
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ") || "";

  // 1. Create user
  const createRes = await fetch(
    `${KC_URL}/admin/realms/${TARGET_REALM}/users`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email.split("@")[0],
        email,
        firstName,
        lastName,
        enabled: true,
        emailVerified: false,
      }),
    }
  );

  if (!createRes.ok && createRes.status !== 409) {
    throw new Error("Failed to create user in Keycloak");
  }

  // 2. Fetch the newly created user to get their ID
  const userRes = await fetch(
    `${KC_URL}/admin/realms/${TARGET_REALM}/users?email=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const users = await userRes.json();
  const user = users[0];
  if (!user) throw new Error("User not found after creation");

  // 3. Fetch volunteer role
  const roleRes = await fetch(
    `${KC_URL}/admin/realms/${TARGET_REALM}/roles/volunteer`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const role = await roleRes.json();

  // 4. Assign volunteer role
  await fetch(
    `${KC_URL}/admin/realms/${TARGET_REALM}/users/${user.id}/role-mappings/realm`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ id: role.id, name: role.name }]),
    }
  );

  return { id: user.id };
}

export async function listVolunteers(): Promise<{ id: string; name: string; email: string }[]> {
  const token = await getAdminToken();

  // Get volunteer role ID
  const roleRes = await fetch(
    `${KC_URL}/admin/realms/${TARGET_REALM}/roles/volunteer/users`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!roleRes.ok) return [];
  const users = await roleRes.json();

  return users.map((u: { id: string; firstName?: string; lastName?: string; email?: string }) => ({
    id: u.id,
    name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "Unknown",
    email: u.email ?? "",
  }));
}
