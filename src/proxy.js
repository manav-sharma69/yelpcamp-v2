import NextAuth from 'next-auth'
import { authConfig } from './utils/auth/auth.config'

const auth = NextAuth(authConfig).auth
export { auth as proxy }

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
}
