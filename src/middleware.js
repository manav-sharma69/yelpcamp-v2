import NextAuth from "next-auth";
import { authConfig } from "./utils/auth/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};