import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value
  const isLogin = req.nextUrl.pathname.startsWith("/login")
  const isPublic = req.nextUrl.pathname === "/"

  if (!token && !isLogin && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token && isLogin) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
