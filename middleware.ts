import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Disable browser caching (including back-forward cache) on the admin routes.
 * Without this, hitting the browser back button after logout would show a
 * snapshot of the dashboard UI even though the session is gone.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
