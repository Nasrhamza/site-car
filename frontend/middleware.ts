import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, SELLER_SESSION_COOKIE } from "@/lib/auth-constants";

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasAdminSession = req.cookies.get(ADMIN_SESSION_COOKIE)?.value === "1";
  const hasSellerSession = req.cookies.get(SELLER_SESSION_COOKIE)?.value === "1";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isSellerRoute = pathname === "/seller" || pathname.startsWith("/seller/");
  const isSellerAuthRoute = pathname === "/seller/login" || pathname === "/seller/request-account";

  if (isAdminRoute && !hasAdminSession) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  if (isSellerRoute && !isSellerAuthRoute && !hasSellerSession) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/seller/login";
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  if (pathname === "/login" && hasAdminSession) {
    const adminUrl = req.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";
    return applySecurityHeaders(NextResponse.redirect(adminUrl));
  }


  if (pathname === "/seller/login" && hasSellerSession) {
    const sellerUrl = req.nextUrl.clone();
    sellerUrl.pathname = "/seller";
    sellerUrl.search = "";
    return applySecurityHeaders(NextResponse.redirect(sellerUrl));
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)"]
};
