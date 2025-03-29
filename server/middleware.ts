import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  if (path === "/login") {
    return NextResponse.next();
  }

  // Check authentication for all other paths
  const cookies = request.cookies;
  const password = cookies.get("password");

  const { USER_SECRET } = process.env;

  if (password?.value === USER_SECRET) {
    // User is authenticated, allow the request to proceed

    if (path === "/" || path === "") {
      return NextResponse.redirect(new URL(`dashboard`, request.url));
    }

    return NextResponse.next();
  }

  // User is not authenticated, redirect to login page
  const response = NextResponse.redirect(
    new URL(`/login?redirect=${path}`, request.url)
  );

  response.cookies.set("password", "", {
    expires: new Date(0),
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
