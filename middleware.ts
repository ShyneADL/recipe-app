import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authSession = request.cookies.get("a_session"); // Appwrite session cookie name (without underscore)

  // Protected routes
  const protectedRoutes = ["/wishlist", "/profile"];

  // Public routes that should redirect to home if authenticated
  const publicRoutes = ["/login", "/signup"];

  // If the user is not authenticated and trying to access a protected route
  if (
    !authSession &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is authenticated and trying to access login/signup pages
  if (authSession && publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/wishlist/:path*",
    "/profile/:path*",
    "/login/:path*",
    "/signup/:path*",
  ],
};
