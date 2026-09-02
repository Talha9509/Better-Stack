import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/signin', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith('/_next'))

  if (!isPublic) {
    const token = request.cookies.get('authorization')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}