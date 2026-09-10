# Abdullah Foundation – Auth Demo

A clean demonstration of **Keycloak as Identity Provider** with **Auth.js handling authentication** in a **Next.js 14** application.

## Architecture

```
┌──────────────────────┐
│      Keycloak        │
│                      │
│  Users & Passwords   │
│  Realm Roles         │
│  OIDC Provider       │
└─────────┬────────────┘
          │ OIDC (access_token with realm_access.roles)
          ▼
┌──────────────────────┐
│      Auth.js v5      │
│                      │
│  Decodes roles from  │
│  Keycloak JWT        │
│  Manages sessions    │
│  Route protection    │
└─────────┬────────────┘
          ▼
┌──────────────────────┐
│     Next.js 14       │
│                      │
│  App Router          │
│  Server Components   │
│  Role-based access   │
└──────────────────────┘
```

**Key design decisions:**

- **Keycloak owns everything identity-related**: users, passwords, roles, authentication. The application never stores credentials.
- **Auth.js integrates OIDC into Next.js**: it handles the OAuth flow, token exchange, and session management.
- **Roles come from the Keycloak JWT**: Auth.js decodes `realm_access.roles` from the access token. No extra API calls needed.
- **Authorization is enforced server-side**: middleware protects routes, and server components call `requireRole()`. Hiding nav links is not enough.

## Two Clients, Two Purposes

The application uses **two different clients** for **two different things**:

| Client | Realm | Purpose |
|--------|-------|---------|
| `foundation-web` | `abdullah-foundation` | OIDC login for users (standard flow) |
| `admin-cli` | `master` | Keycloak Admin API (server-side only) |

**`foundation-web`** is our application's OIDC client. Users authenticate through it via the standard OAuth authorization code flow. Auth.js uses this client to sign users in and manage sessions.

**`admin-cli`** is Keycloak's **built-in** client that ships with every Keycloak installation. It lives in the `master` realm and is used for administrative operations. We use it to get an admin token so our server can call the Keycloak Admin API (e.g., create volunteers). This is **not** a second application client — it's Keycloak's own internal tool for admin access.

Both are necessary because they serve completely different purposes in different realms.

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm

## Setup

### 1. Start Keycloak

```bash
docker compose up -d
```

Keycloak starts on `http://localhost:8080` and automatically imports the preconfigured realm. No manual setup required.

### 2. Configure environment

```bash
cp .env.example .env.local
```

Generate an Auth.js secret:

```bash
npx auth secret  # or: openssl rand -base64 32
```

Paste the generated value into `AUTH_SECRET` in `.env.local`.

### 3. Start Next.js

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.

## URLs

| Service  | URL                   |
| -------- | --------------------- |
| Next.js  | http://localhost:3000 |
| Keycloak | http://localhost:8080 |

## Demo Users

| Username   | Password   | Role      |
| ---------- | ---------- | --------- |
| admin      | admin      | admin     |
| volunteer1 | volunteer1 | volunteer |
| volunteer2 | volunteer2 | volunteer |

> These are development-only credentials. The realm JSON is for local demo purposes.

## Demo Flow

1. Open http://localhost:3000
2. Click **Login with Keycloak**
3. Log in as `admin` / `admin` → lands on **Admin Dashboard**
4. See volunteer list fetched from Keycloak
5. Click **Create Volunteer** to add a new volunteer via Keycloak Admin API
6. Navigate to **Donations** — view mock donation data
7. **Logout** (destroys both Next.js and Keycloak sessions)
8. Log in as `volunteer1` / `volunteer1` → lands on **Donations**
9. Try navigating to `/admin` manually — **Access Denied**

## How Roles Flow

```
Keycloak assigns role "volunteer" to user
        ↓
OIDC access_token contains realm_access.roles: ["volunteer"]
        ↓
Auth.js jwt callback decodes the token (no extra HTTP calls)
        ↓
Session carries user.roles: ["volunteer"]
        ↓
middleware.ts checks roles for /admin route → redirects to /unauthorized
        ↓
requireRole("admin") in server components → redirects if missing
```

Roles are **never hardcoded**. They are always read from the Keycloak JWT.

## Authorization Layers

Two layers of server-side protection:

| Layer | Where | What it does |
|-------|-------|-------------|
| `middleware.ts` | Every matching request | Checks auth + admin role before the page loads |
| `requireRole()` | Server Components & API Routes | Double-checks auth + role inside the handler |

This means even if middleware is somehow bypassed, the page handler itself denies access.

## Project Structure

```
.
├── app/                              # Next.js App Router pages
│   ├── layout.tsx                    # Root layout with SessionProvider
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Tailwind CSS imports
│   ├── login/page.tsx                # Login (delegates to Keycloak)
│   ├── donations/page.tsx            # Protected: admin + volunteer
│   ├── admin/page.tsx                # Protected: admin only
│   └── unauthorized/page.tsx         # Access denied
├── app/api/
│   ├── auth/
│   │   ├── [...nextauth]/route.ts    # Auth.js catch-all route
│   │   └── keycloak-logout/route.ts  # Destroys Keycloak session on logout
│   └── admin/
│       ├── create-volunteer/route.ts # Creates volunteer in Keycloak
│       └── volunteers/route.ts       # Lists volunteers from Keycloak
├── components/
│   ├── Navbar.tsx                    # Role-aware navigation
│   ├── SessionProvider.tsx           # Client-side session wrapper
│   ├── LoginButton.tsx               # Triggers Keycloak login directly
│   ├── DonationList.tsx              # Mock donation data display
│   └── VolunteerList.tsx             # Volunteer table (accepts props)
├── lib/
│   ├── auth-helpers.ts               # DRY auth/authorization helpers
│   ├── keycloak-admin.ts             # Keycloak Admin API client
│   └── types.ts                      # Shared TypeScript types
├── auth.ts                           # Auth.js v5 root configuration
├── middleware.ts                      # Server-side route protection
├── keycloak/
│   └── realm-export.json             # Auto-imported realm config
├── docker-compose.yml                # Keycloak container
├── .env.example                      # Environment variable template
├── package.json                      # Dependencies
└── README.md
```

## Security Notes

- **Passwords belong to Keycloak** — the application never stores or handles them
- **Keycloak Admin API credentials stay server-side** — never prefixed with `NEXT_PUBLIC_`
- **Roles come from Keycloak** — extracted from the OIDC access token, never hardcoded
- **Authorization is enforced server-side** — middleware + `requireRole()` checks
- **Logout destroys both sessions** — Next.js session + Keycloak session via `/api/auth/keycloak-logout`
- **`admin-cli` is Keycloak's built-in client** — not a second application client
- **The realm JSON is development-only** — contains plain-text passwords for demo convenience

## Environment Variables

| Variable                   | Description                    | Source                                             |
| -------------------------- | ------------------------------ | -------------------------------------------------- |
| `AUTH_SECRET`              | Auth.js session encryption key | Generate with `npx auth secret`                    |
| `AUTH_URL`                 | App base URL for redirects     | `http://localhost:3000`                            |
| `AUTH_KEYCLOAK_ID`         | OIDC client ID                 | `foundation-web` in realm                          |
| `AUTH_KEYCLOAK_SECRET`     | OIDC client secret             | `foundation-web-secret` in realm                   |
| `AUTH_KEYCLOAK_ISSUER`     | Keycloak realm OIDC issuer URL | `http://localhost:8080/realms/abdullah-foundation` |
| `KEYCLOAK_ADMIN_URL`       | Keycloak base URL              | `http://localhost:8080`                            |
| `KEYCLOAK_ADMIN_REALM`     | Admin API realm                | `master` (for admin-cli access)                    |
| `KEYCLOAK_ADMIN_CLIENT_ID` | Admin API client               | `admin-cli` (Keycloak's built-in)                  |
| `KEYCLOAK_ADMIN_USERNAME`  | Admin username                 | `admin`                                            |
| `KEYCLOAK_ADMIN_PASSWORD`  | Admin password                 | `admin`                                            |
