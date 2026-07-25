import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next()
  response.headers.set("x-pathname", pathname)

  if (pathname === "/admin/login") {
    const token = await getToken({ req: request })
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return response
  }

  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
