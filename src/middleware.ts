import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken");
  const loginHash = process.env.NEXT_PUBLIC_LOGIN_HASH;

  if (authToken && authToken.value === loginHash)
    if (request.nextUrl.pathname === "/login")
      return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/login"],
};
