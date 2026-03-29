import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { isProtectedPath } from "@/lib/auth/middleware";

export default auth((req) => {
  if (isProtectedPath(req.nextUrl.pathname) && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};