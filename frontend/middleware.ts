import { NextRequest, NextResponse } from "next/server";

const ADMIN_PREFIX = "/admin";
const LOGIN_PAGE   = "/admin/login";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // only guard /admin routes
  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();

  // login page always accessible
  if (pathname === LOGIN_PAGE) return NextResponse.next();

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    // redirect to login, preserve intended destination
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = LOGIN_PAGE;
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // token exists → allow through (server will validate on API call)
  // full JWT verify here needs edge-compatible lib — cookie presence is enough
  // for route guard; API calls will 401 if token expired → client auto-refreshes
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};