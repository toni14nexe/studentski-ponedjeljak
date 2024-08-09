import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const nonAuthorizedForbiddenUrls = [
  "/add-assembly",
  /^\/edit-assembly\/\d+$/,
  "/members/add",
  /^\/members\/edit\/\d+$/,
  "/laws/add",
  /^\/laws\/edit\/\d+$/,
  "/reprimands/add",
  /^\/reprimands\/edit\/\d+$/,
  /^\/superadmin.+$/,
];

export function middleware(request: NextRequest) {
  // Ignore requests to _next/static and other static files
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/_next/static")) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get("authToken");
  const loginHash = process.env.NEXT_PUBLIC_LOGIN_HASH;

  // API authorization
  // Must be logged in for POST, PUT & DELETE methods
  if (
    pathname.slice(0, 5) === "/api/" &&
    request.method !== "GET" &&
    (!authToken || authToken.value !== loginHash)
  ) {
    return false;

    // Page redirections
    // Authorized user blockers
  } else if (
    authToken &&
    authToken.value === loginHash &&
    request.nextUrl.pathname === "/login"
  )
    return NextResponse.redirect(new URL("/", request.url));
  // Non authorized user blockers
  else if (
    (!authToken || authToken.value !== loginHash) &&
    nonAuthorizedForbiddenUrls.some((forbiddenUrl) =>
      typeof forbiddenUrl === "string"
        ? forbiddenUrl === pathname
        : forbiddenUrl instanceof RegExp
        ? forbiddenUrl.test(pathname)
        : false
    )
  )
    return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/:path*"],
};
