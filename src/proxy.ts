import { NextResponse, type NextRequest } from "next/server";

/**
 * Every page address on this site is lowercase. Next.js routes are
 * case-sensitive, so /Company and /company would otherwise be two different
 * URLs to a search engine (one of them a 404). Any page request with an
 * uppercase letter gets a single 301 to its lowercase form, query kept.
 *
 * Renamed pages (e.g. /Website -> /services/web-development) are handled
 * first by redirects() in next.config.ts, which runs before this proxy.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === pathname.toLowerCase()) return NextResponse.next();

  // Only plain page loads; leave form posts and other methods untouched.
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname.toLowerCase();
  return NextResponse.redirect(url, 301);
}

export const config = {
  // Pages only: skip API routes, Next internals and files with an extension.
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
