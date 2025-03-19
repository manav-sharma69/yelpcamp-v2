'use server';
import { AuthError } from "next-auth";
import { auth, signIn as naSignIn, signOut as naSignOut } from "./auth";
import { cookies } from "next/headers";
import { getUserByID } from "../actions/usersCrud";

export async function getUserRole() {
  const session = await auth();
  if (!session) {
    return; // maybe something else?
  }

  const cs = await cookies();
  if (!cs.has('user_role')) {
    const user = await getUserByID(session.user.id);
    const role = user.role;
    cs.set('user_role', role);
  }
  return cs.get('user_role').value;
}

export async function signOut(signOutArgs) {
  await naSignOut();
}

export async function getSession() {
  const session = await auth();
  return session;
}

export async function isLoggedIn() {
  return !!(await getSession());
}

export async function isAuthorized(id) {
  const session = await auth();
  if (!session) return false;
  return session?.user?.id === id;
}

export async function authenticate(prevState, formData) {
  try {
    const creds = Object.fromEntries(formData.entries());
    const res = await naSignIn('credentials', { ...creds, redirect: false });
    // console.log(res);
    return { success: 'login successful' }
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        case 'CallbackRouteError':
          // here, error.cause will show custom messages that I'm throwing from authorize functions in auth.js file
          return { message: error.cause.err.message };
        default:
          return 'Something went wrong.';
      }
    }

    throw error;
  }
}