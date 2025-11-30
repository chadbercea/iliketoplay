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

  // If not logged in and trying to access protected route, redirect to login
  if (!isLoggedIn && !isPublicRoute) {
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

