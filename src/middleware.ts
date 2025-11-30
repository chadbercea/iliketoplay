import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Public routes that don't require auth
  const isPublicRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/signup");

  // API routes should pass through (they handle their own auth and return 401)
  const isApiRoute = pathname.startsWith("/api/");

  // If not logged in and trying to access protected route
  if (!isLoggedIn && !isPublicRoute) {
    // API routes: let them pass through to return their own 401
    if (isApiRoute) {
      return NextResponse.next();
    }
    // Page routes: redirect to login
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access login/signup, redirect to home
  if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

