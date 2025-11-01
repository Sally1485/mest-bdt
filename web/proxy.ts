import { NextResponse, NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  try {
    const hanko = req.cookies.get("hanko")?.value;
    // Redirect to login page if not logged in
    if (!hanko && req.nextUrl.pathname !== "/login") {
      console.log(hanko);
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Redirect to home page if already logged in and heading for login again
    if (hanko && req.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Allow the request to proceed if a profile exists or if the user is on the settings page.
    return NextResponse.next();
  } catch (error) {
    // If there's any error (e.g., no hanko cookie, invalid token), redirect to the login page.
    console.log("Authentication or profile check failed:", JSON.stringify(error));
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    /* Apply proxy to all pages except API routes, static assets, and specific excluded pages. */
    '/((?!api|assets|_next/static|_next/image|favicon.ico).*)',
  ],
};