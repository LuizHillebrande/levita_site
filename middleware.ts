import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth-middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger rotas admin
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const auth = await verifyAuth(request)

    if (!auth) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}


