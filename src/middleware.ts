import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check auth state (access or refresh token)
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("refreshToken")?.value;

  // AUTH ROUTES → allowed only if NOT authenticated
  const authRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-code",
    "/reset-password",
    "/password-reset-success",
  ];

  // PROTECTED ROUTES → allowed only if authenticated
  const protectedRoutes = [
    "/feed",
    "/explore",
    "/messages",
    "/flicks",
    "/connections",
    "/edit",
  ];

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute =
    protectedRoutes.some((route) => pathname.startsWith(route)) ||
    (/^\/[^\/]+$/.test(pathname) && !authRoutes.includes(pathname));
  // ↑ This allows /username pages while excluding auth routes

  /** ============================
   *  1) AUTH PAGES → if authenticated → redirect to /feed
   * ============================ */
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  /** ============================
   *  2) PROTECTED ROUTES → if NOT authenticated → redirect to /login
   * ============================ */
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3) PUBLIC ROUTES → always allowed
  // 4) Anything else → allowed
  return NextResponse.next();
}

/**
 * Middleware config
 * - You must match everything (to detect usernames)
 *   then control inside the middleware.
 */
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
