'use server'
import bcrypt from 'bcrypt'
import Joi from 'joi'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import React from 'react'
import { signIn, signOut } from '../auth/auth'
import { getSession, isLoggedIn } from '../auth/helpers'
import { IMMUTABLE_USERS } from '../contants/user-constraints'
import { getPool } from './db'
import { deleteImagesByUserID } from './imagesCrud'

const pool = await getPool()

function validateUser(formData) {
  let id = formData.get('id')
  if (id === null) id = crypto.randomUUID()
  const username = formData.get('username')
  let role = formData.get('role')
  if (role === null) role = 'guest'
  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('password')

  const schema = Joi.object({
    id: Joi.string().uuid().required(),
    username: Joi.string().required(),
    role: Joi.string().valid('guest', 'host'),
    name: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$'
        )
      )
      .required()
  })

  return schema.validate(
    { id, username, role, name, email, password },
    { abortEarly: false }
  )
}

function validateUpdateUserData(formData) {
  const name = formData.get('name')
  const email = formData.get('email')

  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
  })

  return schema.validate({ name, email }, { abortEarly: false })
}

async function validateRequestAuths(username, caller) {
  if (!username) {
    const serverError = '"username" not found in form data at ' + caller
    console.log(serverError, { username: username })
    return {
      serverError: true,
      message: 'Something went wrong. Please try again.'
    }
  }

  // isLoggedIn?
  if (!(await isLoggedIn())) {
    const serverError = 'unauthenticated req at ' + caller
    console.log({ serverError })
    return { serverError: true, message: 'Something went wrong!' }
  }

  // verify user
  const session = await getSession()
  const uid = session?.user?.id

  const user = await getUserByUsername(username)
  if (uid !== user.id) {
    const serverError = 'author mismatch at ' + caller
    console.log({ serverError })
    return { message: 'Something went wrong.', serverError }
  }

  return { success: true, user }
}

function validateDeleteUserData(formData) {
  const password = formData.get('current-password')
  const verificationStr = formData.get('verification-str')
  const verificationStrOrg = 'delete my account'

  const schema = Joi.object({
    verificationStr: Joi.string().valid(verificationStrOrg).required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$'
        )
      )
      .required()
  })

  return schema.validate({ password, verificationStr }, { abortEarly: false })
}

function rejectImmutableUsers(username) {
  if (!username) {
    throw new Error('Provide username to reject immutable users')
  }

  if (IMMUTABLE_USERS.includes(username)) {
    return {
      serverError: true,
      message: `Cannot update profile of "${username}"`
    }
  }
}

// C: Create
export async function createUser(currentState, formData) {
  // validate formData
  const { value: validatedData, error } = validateUser(formData)

  if (error) {
    const serverError = {}
    error.details.map((err) => {
      serverError[err.context.key] = false
    })
    console.log(error)
    return {
      error: true,
      message: 'Recieved invalid credentials. Please try again.'
    }
  }

  const { id, username, role, name, email, password } = validatedData

  // make sure that username and email aren't taken already
  const userExists =
    (await getUserByEmail(email)) || (await getUserByUsername(username))
  if (userExists) {
    return {
      message: 'User already exists. Try a different username or email.'
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const insertQuery = `
      INSERT INTO users(id, username, role, name, email, password)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, role, name, email, password
  `

  try {
    const { rows } = await pool.query(insertQuery, [
      id,
      username,
      role,
      name,
      email,
      hashedPassword
    ])
  } catch (e) {
    console.log({ serverError: 35 }, e)
    return { serverError: true, message: 'Something went wrong' }
  }

  // only logs in. No redirect
  await signIn('credentials', { username, password, redirect: false })

  // this doesn't run probably
  return {
    success: true,
    id: id,
    message: `${name} created successfully!`
  }
}

// R: Read
export const getUserByUsername = React.cache(async function (username) {
  try {
    const { rows: userData } = await pool.query(
      'select * from users where username=$1',
      [username]
    )
    return userData[0]
  } catch (e) {
    console.log(e)
    return { error: true }
  }
})

const getUserByEmail = React.cache(async function (email) {
  try {
    const { rows: userData } = await pool.query(
      'SELECT * FROM users WHERE email=$1 LIMIT 1;',
      [email]
    )
    return userData[0]
  } catch (e) {
    console.log(e)
    return { error: true }
  }
})

export const getUserByID = React.cache(async function (id) {
  try {
    const { rows: userData } = await pool.query(
      'SELECT * FROM users WHERE id=$1;',
      [id]
    )
    return userData[0]
  } catch (e) {
    console.log(e)
    return { error: true }
  }
})

// U: Update

// For internal use only
export async function setUserRole(id, role) {
  const otherRoleValue = role === 'host' ? 'guest' : 'host'
  const updateRoleQuery = `
    UPDATE users
    SET role = $1
    WHERE id = $2 AND role = $3;
  `

  try {
    const { rows } = await pool.query(updateRoleQuery, [
      role,
      id,
      otherRoleValue
    ])
  } catch (e) {
    console.log(e)
    return { error: true }
  }
}

export async function updateUserData(prevState, formData) {
  // check authenticity and authority of request
  const isReqValid = await validateRequestAuths(
    formData.get('username'),
    'updateUserData'
  )
  if (isReqValid?.serverError) {
    return isReqValid
  }
  const { user } = isReqValid

  const rejectedData = rejectImmutableUsers(user.username)

  if (rejectedData) return rejectedData

  // validate formData
  const { value: validatedData, error } = validateUpdateUserData(formData)

  if (error) {
    const serverError = {}
    error.details.map((err) => {
      serverError[err.context.key] = false
    })
    console.log({ serverError })
    return { serverError, message: 'Failed to update data. Please try again.' }
  }

  const { name, email } = validatedData

  const client = await pool.connect()
  const updateQuery = `update users set name=$1, email=$2 where id=$3 returning *`
  try {
    const { rows } = await client.query(updateQuery, [name, email, user.id])
    console.log(rows)
    return { success: true, name: rows[0].name, email: rows[0].email }
  } catch (e) {
    const serverError = 35
    console.log({ serverError }, e)
    return { serverError: true, message: 'Something went wrong' }
  } finally {
    client.release()
  }
}

export async function changePassword(prevState, formData) {
  // check authenticity and authority of request
  const isReqValid = await validateRequestAuths(
    formData.get('username'),
    'changePassword'
  )
  if (isReqValid?.serverError) {
    return isReqValid
  }
  const { user } = isReqValid

  const rejectedData = rejectImmutableUsers(user.username)

  if (rejectedData) return rejectedData

  // validate formData
  const passwordNew = formData.get('new-password')
  const passwordConf = formData.get('confirm-password')
  if (passwordConf !== passwordNew) {
    const serverError = 36
    console.log({ serverError })
    return { serverError: true, message: 'Something went wrong' }
  }

  const schema = Joi.object({
    password: Joi.string()
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$'
        )
      )
      .required()
  })
  const { value: validatedData, error } = schema.validate({
    password: passwordNew
  })

  if (error) {
    const serverError = {}
    error.details.map((err) => {
      serverError[err.context.key] = false
    })
    console.log({ serverError }, 'validation error')
    return { serverError, message: 'Failed to update data. Please try again.' }
  }

  // validate 'current-password'
  const client = await pool.connect()
  const currPass = formData.get('current-password')
  try {
    const { rows } = await client.query(
      'select password from users where id=$1',
      [user.id]
    )
    const passFromDB = rows[0].password
    const passwordsMatch = await bcrypt.compare(currPass, passFromDB)
    console.log({ passFromDB, passwordsMatch })
    if (!passwordsMatch) {
      const serverError = 37
      console.log({ serverError })
      return { serverError: true, message: 'Something went wrong' }
    }
  } catch (e) {
    const serverError = 38
    console.log({ serverError }, e)
    return { message: 'Something went wrong', serverError: true }
  }

  const { password } = validatedData
  const hashedPassword = await bcrypt.hash(password, 10)

  const updateQuery = `update users set password=$1 where id=$2 returning *`
  try {
    const { rows } = await client.query(updateQuery, [hashedPassword, user.id])
    console.log(rows)
    return { success: true }
  } catch (e) {
    const serverError = 39
    console.log({ serverError }, e)
    return { serverError: true, message: 'Something went wrong' }
  } finally {
    client.release()
  }
}

// D: Delete
export async function deleteUser(prevState, formData) {
  // check authenticity and authority of request
  const isReqValid = await validateRequestAuths(
    formData.get('username'),
    'deleteUser'
  )
  if (isReqValid?.serverError) {
    return isReqValid
  }
  const { user } = isReqValid
  const rejectedData = rejectImmutableUsers(user.username)

  if (rejectedData) return rejectedData

  // validate data
  const { value: validatedData, error } = validateDeleteUserData(formData)
  if (error) {
    const serverError = {}
    error.details.map((err) => {
      serverError[err.context.key] = false
    })
    console.log({ serverError }, 'validation error')
    return {
      serverError,
      message: 'Failed to delete account. Please try again.'
    }
  }

  // validate 'current-password'
  const client = await pool.connect()
  const currPass = formData.get('current-password')
  try {
    const { rows } = await client.query(
      'select password from users where id=$1',
      [user.id]
    )
    const passFromDB = rows[0].password
    const passwordsMatch = await bcrypt.compare(currPass, passFromDB)
    if (!passwordsMatch) {
      const serverError = 40
      console.log({ serverError })
      return { serverError: true, message: 'Something went wrong' }
    }
  } catch (e) {
    const serverError = 41
    console.log({ serverError }, e)
    return { message: 'Something went wrong', serverError: true }
  }

  const response = await deleteImagesByUserID(user.id) // deletes images from uploadthing
  if (response?.serverError) {
    return response
  }

  const deleteQuery = `delete from users where id=$1 returning *`
  try {
    const { rows } = await client.query(deleteQuery, [user.id])
    await signOut({ redirectTo: '/' })
  } catch (e) {
    if (isRedirectError(e)) {
      throw e
    }
    const serverError = 42
    console.log({ serverError }, e)
    return { serverError: true, message: 'Something went wrong' }
  } finally {
    client.release()
  }
}
