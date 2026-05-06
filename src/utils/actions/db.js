'use server'
import pkg from 'pg'
const { Pool } = pkg

// { CAMPGROUNDS_ADDED: 142, CAMPGROUNDS_SKIPPED: 519, TOTAL: 661 }
const pool = new Pool({
  connectionString: process.env.NEON_DB_URL
})

export async function getPool() {
  return pool
}

async function createCampgroundTable() {
  // successful creation returns nothing, failure returns error
  // location can be null because dataset does not have location, only latlong
  const createCampgroundTableQuery = `
        CREATE TABLE campgrounds (
            id UUID PRIMARY KEY NOT NULL,
            author UUID NOT NULL,
            name VARCHAR(255) NOT NULL,
            price NUMERIC NOT NULL,
            location TEXT,
            description TEXT NOT NULL,
            lat_long TEXT[2] NOT NULL,
            weather_overview TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_author
                FOREIGN KEY (author) REFERENCES users(id)
                ON DELETE CASCADE
        );
    `

  try {
    // Run the query and await the result
    const res = await pool.query(createCampgroundTableQuery)
    console.log('"campgrounds" Table created successfully')
  } catch (error) {
    // Handle any errors that occur
    console.error('Error creating table:', error.message)
  }
}

async function createImagesTable() {
  const createImagesTableQuery = `
        CREATE TABLE images (
            id UUID PRIMARY KEY NOT NULL,
            c_id UUID NOT NULL,
            credit TEXT NOT NULL,
            title TEXT,
            alt_text TEXT NOT NULL,
            caption TEXT,
            url TEXT NOT NULL,
            CONSTRAINT fk_campground FOREIGN KEY (c_id) REFERENCES campgrounds(id) ON DELETE CASCADE
        );
    `

  try {
    // Run the query and await the result
    const res = await pool.query(createImagesTableQuery)
    console.log('"images" Table created successfully')
  } catch (error) {
    // Handle any errors that occur
    console.error('Error creating table:', error.message)
  }
}

async function createContactInfoTable() {
  const createContactInfoTableQuery = `
        CREATE TABLE contact_info (
            id UUID PRIMARY KEY NOT NULL,
            c_id UUID NOT NULL,
            contacts JSONB NOT NULL,
            reservation_url TEXT,
            reservation_info TEXT,
            regulations_overview TEXT,
            regulations_url TEXT,
            CONSTRAINT fk_campground FOREIGN KEY (c_id) REFERENCES campgrounds(id) ON DELETE CASCADE
        );
    `

  try {
    // Run the query and await the result
    const res = await pool.query(createContactInfoTableQuery)
    console.log('"contactInfo" Table created successfully')
  } catch (error) {
    // Handle any errors that occur
    console.error('Error creating table:', error.message)
  }
}

async function createReviewsTable() {
  // successful creation returns nothing, failure returns error
  const createReviewsTableQuery = `
        CREATE TABLE reviews (
            id UUID PRIMARY KEY NOT NULL,
            c_id UUID NOT NULL,
            u_id UUID NOT NULL,
            body TEXT NOT NULL,
            rating INT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_campground
                FOREIGN KEY (c_id) REFERENCES campgrounds(id)
                ON DELETE CASCADE,
            CONSTRAINT fk_user
                FOREIGN KEY (u_id) REFERENCES users(id)
                ON DELETE CASCADE
        );
    `

  try {
    // Run the query and await the result
    const res = await pool.query(createReviewsTableQuery)
    console.log('"reviews" table created successfully')
  } catch (error) {
    // Handle any errors that occur
    console.error('Error creating table:', error.message)
  }
}

async function createUsersTable() {
  // successful creation returns nothing, failure returns error
  const createUsersTableQuery = `
  CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(10) DEFAULT 'guest' CHECK (role IN ('host', 'guest')) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
  );
`

  try {
    // Run the query and await the result
    const res = await pool.query(createUsersTableQuery)
    console.log('"users" table created successfully')
  } catch (error) {
    // Handle any errors that occur
    console.error('Error creating table:', error.message)
  }
}

async function deleteTable(tableName) {
  // Sanitize the table name to prevent SQL injection
  // if no sanitization is done, attacker may do this: deleteTable("campgrounds; DROP TABLE users; --");
  const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '') // Basic sanitization

  const query = `DROP TABLE IF EXISTS ${sanitizedTableName} CASCADE`

  try {
    await pool.query(query)
    console.log(`Table "${sanitizedTableName}" deleted successfully.`)
  } catch (error) {
    console.error('Error deleting table:', error.message)
  }
}

// ORDER:
// createUsersTable();
// createCampgroundTable();
// createImagesTable();
// createContactInfoTable();
// createReviewsTable();
