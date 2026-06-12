import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/mail") ||
    request.nextUrl.pathname.startsWith("/calendar");

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mail/:path*", "/calendar/:path*"],
};
