import { NextResponse, type NextRequest } from "next/server";
import { decodeExperiments, encodeExperiments, EXPERIMENT_COOKIE, newExperiments, SOURCE_COOKIE } from "./lib/experiments";
import { decodeSource, encodeSource, hasSource, sourceFromParams } from "./lib/source";

const SIX_MONTHS = 60 * 60 * 24 * 180;

export function proxy(request: NextRequest) {
  const cookieOptions = {
    path: "/",
    maxAge: SIX_MONTHS,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
  const updates: [string, string][] = [];

  if (!decodeExperiments(request.cookies.get(EXPERIMENT_COOKIE)?.value)) {
    updates.push([EXPERIMENT_COOKIE, encodeExperiments(newExperiments())]);
  }

  // First touch wins; a later referral link only fills in a missing referral code.
  const stored = decodeSource(request.cookies.get(SOURCE_COOKIE)?.value);
  const incoming = sourceFromParams(request.nextUrl.searchParams);
  if (!request.cookies.has(SOURCE_COOKIE)) {
    updates.push([SOURCE_COOKIE, encodeSource({ ...incoming, landed_at: new Date().toISOString() })]);
  } else if (hasSource(incoming) && incoming.ref && !stored.ref) {
    updates.push([SOURCE_COOKIE, encodeSource({ ...stored, ref: incoming.ref })]);
  }

  if (!updates.length) return NextResponse.next();

  for (const [name, value] of updates) request.cookies.set(name, value);
  const response = NextResponse.next({ request: { headers: request.headers } });
  for (const [name, value] of updates) response.cookies.set(name, value, cookieOptions);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|.*\\.(?:jpg|png|svg|webp)$).*)"],
};
