import { NextResponse, type NextRequest } from "next/server";

import { BG_CANONICAL_PATH } from "./lib/bg-config";

const AUTH_COOKIE = "utt_auth";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Legacy /bg and /bg/ → canonical Coconut Rentals short link
  if (pathname === "/bg" || pathname === "/bg/") {
    const url = request.nextUrl.clone();
    url.pathname = BG_CANONICAL_PATH;
    return NextResponse.redirect(url, 308);
  }

  // Keep all public redirect links available.
  const isPackingListPage = pathname === "/pl" || pathname.startsWith("/pl/");
  if (
    pathname.startsWith("/go/") ||
    pathname.startsWith("/dc/") ||
    pathname.startsWith("/bq/") ||
    pathname.startsWith("/bg/") ||
    pathname.startsWith("/sw/") ||
    pathname.startsWith("/ex/") ||
    isPackingListPage
  ) {
    return NextResponse.next();
  }

  // Allow login page and login endpoint.
  if (pathname === "/login" || pathname.startsWith("/api/login")) {
    return NextResponse.next();
  }

  // Protect only homepage generator.
  if (pathname === "/") {
    const isAuthed = request.cookies.get(AUTH_COOKIE)?.value === "1";
    if (!isAuthed) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/go/:path*",
    "/dc/:path*",
    "/bq/:path*",
    "/bg",
    "/bg/:path*",
    "/sw/:path*",
    "/ex/:path*",
    "/pl",
    "/pl/:path*",
    "/login",
    "/api/login",
  ],
};
