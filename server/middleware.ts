import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === "/") {
    return NextResponse.redirect(new URL(`dashboard`, request.url));
  }

  if (path === "/login") {
    return NextResponse.next();
  }

  const cookies = request.cookies;
  const password = cookies.get("password");

  const { USER_SECRET } = process.env;

  if (password?.value === USER_SECRET) {
    return NextResponse.next();
  }

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
