import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/staff")
  ) {
    const token = request.cookies.get("next-auth.session-token");
    if (!token) {
      NextResponse.rewrite(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}
