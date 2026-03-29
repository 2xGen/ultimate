import { NextResponse } from "next/server";

const AUTH_COOKIE = "utt_auth";
const PASSWORD = "tobias";

function shouldUseSecureCookie(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded === "https") return true;
  if (forwarded === "http") return false;
  return new URL(request.url).protocol === "https:";
}

export async function POST(request: Request): Promise<NextResponse> {
  let password = "";

  try {
    const body = (await request.json()) as { password?: string };
    password = body.password?.trim() || "";
  } catch {
    password = "";
  }

  if (password !== PASSWORD) {
    return NextResponse.json({ ok: false, message: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: AUTH_COOKIE,
    value: "1",
    httpOnly: true,
    // `Secure` cookies are ignored on http://localhost — login would "work" but never stick.
    secure: shouldUseSecureCookie(request),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
