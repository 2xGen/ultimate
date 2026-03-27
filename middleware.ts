import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "utt_auth";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Keep all public redirect links available.
  if (pathname.startsWith("/go/")) {
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
  matcher: ["/", "/go/:path*", "/login", "/api/login"],
};
