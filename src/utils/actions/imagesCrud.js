'use server';
import { utApi } from "../uploadthing/server";
import { getPool } from "./db";

const pool = await getPool();

// C: Create
export async function addNewImages({ keys, c_id, credit, altText, u_id }) {
  // img url template: `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${key}`
  if (!keys || !Array.isArray(keys)) {
    const serverError = 20;
    console.log({ serverError });
    return { serverError: true, message: 'Something went wrong. Please try again.' }
  }

  const client = await pool.connect();
  const res = await Promise.all(keys.map(async (key) => {
    const url = `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${key}`;
    try {
      const id = crypto.randomUUID();
      const insertQuery = `
        INSERT INTO images(id, c_id, credit, title, alt_text, caption, url, thumbnail_url, u_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING url;
      `;

      const { rows } = await client.query(insertQuery, [id, c_id, credit, null, altText, null, url, url, u_id]);
      console.log({ imgDB: rows[0] });
    }
    catch (e) {
      console.log({ serverError: 21 }, e);
      return 'fail';
    }
  }));
  client.release();
  if (res.includes('fail')) {
    const serverError = 22;
    console.log({ serverError });
    return { serverError: true, message: 'Something went wrong' };
  }

  return { success: true };
}

// R: Read
export async function getImagesByCampgroundID(id) {
  const client = await pool.connect();
  try {
    const fetchQuery = `
      SELECT id, credit, alt_text, url, thumbnail_url FROM images WHERE c_id=$1;
    `;

    const { rows } = await client.query(fetchQuery, [id]);

    return rows;
  }
  catch (e) {
    const serverError = 23;
    console.log({ serverError });
    return { serverError: true, message: "Something went wrong!" }
  }
  finally {
    client.release();
  }
}

export async function getImageKeysByCampgroundID(id) {
  const client = await pool.connect();
  try {
    const fetchQuery = `
      select url from images where c_id=$1;    
    `;

    const { rows } = await client.query(fetchQuery, [id]);
    const keys = rows.map(({ url }) => url.split('/').pop());

    return keys;
  }
  catch (e) {
    console.log(e);
    return;
  }
  finally {
    client.release();
  }
}

// U: Update
export async function updateImagesByCampgroundID(params) {
  try {
    // delete all cgs for the given c_id
    const deleteRes = await deleteImagesByCampgroundID(params.c_id);
    if (deleteRes?.serverError) throw deleteRes;
    // add this new list - just call addNewImages
    const addNewRes = await addNewImages(params);
    if (addNewRes?.serverError) throw addNewRes;

    return { success: true };
  }
  catch (e) {
    const serverError = 24;
    console.log(serverError, e);
    return { serverError: true, message: 'Something went wrong.' }
  }
}

// D: Delete
export async function deleteImagesByCampgroundID(c_id) {
  const client = await pool.connect();
  try {
    const deleteQuery = `delete from images where c_id=$1 returning *;`;
    const { rows } = await client.query(deleteQuery, [c_id]);
    return { success: rows[0] };
  }
  catch (e) {
    const serverError = 25;
    console.log({ serverError }, e);
    return { serverError: true, message: 'why?' }
  }
  finally {
    client.release();
  }
}

// deletes images from uploadthing
export async function deleteImagesByUserID(u_id) {
  const client = await pool.connect();
  let keys;
  try {
    const fetchQuery = `select url from images where u_id = $1`;

    const { rows } = await client.query(fetchQuery, [u_id]);
    keys = rows.map(({ url }) => url.split('/').pop());
  }
  catch (e) {
    console.log(e);
    return;
  }
  finally {
    client.release();
  }

  // delete images from uploadthing
  const res = await utApi.deleteFiles(keys);
  console.log({ uploadthingDel: res });
  if (!res.success) {
    const serverError = 26;
    console.log({ serverError }, res);
    return { serverError: true, message: 'Something went wrong' };
  }
  return { success: true };
}