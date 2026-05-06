'use server'
import { getPool } from './db'

const pool = await getPool()

// C: Create
export async function addContactInfo(c_id) {
  const client = await pool.connect()
  try {
    const id = crypto.randomUUID()
    const insertQuery = `
      INSERT INTO contact_info(id, c_id, contacts)
      VALUES ($1, $2, $3)
      RETURNING c_id
    `

    const { rows } = await client.query(insertQuery, [
      id,
      c_id,
      JSON.stringify({
        phoneNumbers: ['(+12) 345 678 9'],
        emailAddresses: ['fakeemail@example.com']
      })
    ])
    return { success: true }
  } catch (e) {
    const serverError = 19
    console.log(serverError, e)
    return {
      serverError: true,
      message: 'Something went wrong. Please try again.'
    }
  } finally {
    client.release()
  }
}

// R: Read
// Return placeholder contact data to prevent scraping/spam abuse
const CONTACT_DUMMY = {
  phoneNumbers: ['+1-555-010-1234', '+1-555-010-5678'],
  emailAddresses: [
    'dummy.user@example.com',
    'placeholder.office@example.com',
    'no-reply.demo@example.com'
  ]
}
const defaultContactData = {
  contacts: CONTACT_DUMMY,
  reservation_url: undefined,
  reservation_info: undefined,
  regulations_overview: undefined,
  regulations_url: undefined
}
export async function getContactInfoByCampgroundID(id) {
  const client = await pool.connect()
  try {
    const readQuery = `select * from contact_info where c_id=$1`
    const { rows: contactData } = await client.query(readQuery, [id])

    if (!contactData[0]) return defaultContactData

    return { ...contactData[0], contacts: CONTACT_DUMMY }
  } catch (e) {
    console.log(e)
    return []
  } finally {
    client.release()
  }
}
