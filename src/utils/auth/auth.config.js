import { NextResponse } from "next/server";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "../contants/routes";
import { cookies } from "next/headers";
// import { getUserRole } from "./helpers";

function verifyRoute(route) {

  return {
    isOnAuth: AUTH_ROUTES.includes(route),
    isOnPrivate: PROTECTED_ROUTES.includes(route),
  }
}

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized(params) {
      const { auth, request } = params;
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname
      const { isOnPrivate } = verifyRoute(pathname);
      const { isOnAuth } = verifyRoute(pathname);
      if (isOnPrivate) {
        if (isLoggedIn) {
          // const role = await getUserRole();
          const cs = await cookies();
          const role = cs.get('user_role').value;
          if (pathname === '/host' && role === 'guest') {
            return NextResponse.rewrite(new URL('/host/new', request.url))
          }
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      }
      if (isOnAuth && isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return true;
    },

    jwt(params) {
      const { token, user } = params;
      if (user) { // User is available during sign-in
        // console.log('jwt if block', user);
        token.id = user.id
        token.role = user.role
      }
      // console.log('token after if', token);
      return token
    },

    session(params) {
      const { session, token } = params;
      session.user.id = token.id
      session.user.role = token.role
      delete session.user.email;
      delete session.user.image;
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
  providers: [],
  trustHost: true,
}