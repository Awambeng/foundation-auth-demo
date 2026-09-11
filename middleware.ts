import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { ROLES } from "@/lib/roles";

// Routes that require authentication
const protectedRoutes = ["/donations", "/admin"];

// Routes that require the admin role
const adminRoutes = ["/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Check if the route requires authentication
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  if (isProtected && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if the route requires admin role
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
  if (isAdminRoute && session) {
    const roles = (session.user as { roles?: string[] })?.roles ?? [];
    if (!roles.includes(ROLES.ADMIN)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/donations/:path*", "/admin/:path*", "/api/admin/:path*"],
};
