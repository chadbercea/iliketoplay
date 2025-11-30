import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple pass-through middleware
// Auth is handled by:
// - API routes: use auth() function
// - Pages: use AuthGuard component
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

