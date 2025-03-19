import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Joi from "joi";
import { getUserByUsername } from "../actions/usersCrud";
import bcrypt from 'bcrypt';

class CustomError extends Error {
  constructor({ message }) {
    super();
    this.message = message;
  }
}

function validateCredentials(credentials) {
  const { username, password } = credentials;

  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  return schema.validate({ username, password });
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    authorize: async function (credentials) {
      // all the errors thrown here can be catched and made available to client side via authenticate fxn 
      // in helpers.js file
      const { value: validatedData, error } = validateCredentials(credentials);

      if (error) {
        throw new CustomError({ message: 'Invalid credentials' });
        // return { error: true, message: 'Invalid credentials' };
      }

      // fetch user creds from db
      const { username, password } = validatedData;
      const user = await getUserByUsername(username);

      if (!user) {
        throw new CustomError({ message: `"${username}" not found!` });
        // return { error: true, message: 'username or password incorrect' }
      }

      // compare passwords
      const passwordsMatch = await bcrypt.compare(password, user.password);

      // return user data or error
      if (!passwordsMatch) {
        throw new CustomError({ message: 'Invalid password!' });
        // return { error: true, message: 'username or password incorrect' }
      }

      // return { ...user };
      return user;
    },
  })],
});