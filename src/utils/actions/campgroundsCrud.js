'use server';
import React from "react";
import Joi from "joi";
import { getPool } from "@/utils/actions/db";
import { getSession, isLoggedIn } from "../auth/helpers";
import { setUserRole } from "./usersCrud";
import { MAX_IMAGES, MIN_IMAGES } from "../contants/user-constraints";
import { addNewImages, getImageKeysByCampgroundID, updateImagesByCampgroundID } from "./imagesCrud";
import { addContactInfo } from "./contact-info-crud";
import { utApi } from "../uploadthing/server";
import { cookies } from "next/headers";

const pool = await getPool();

function validateCampground(formData) {
  let id = formData.get('id');
  const isCreateCampground = !!id;
  if (id === null) id = crypto.randomUUID();
  const author = formData.get('author');
  const name = formData.get('name');
  const latlong = JSON.parse(formData.get('latlong'));
  const location = formData.get('location');
  const price = formData.get('price');
  const description = formData.get('description');
  const keys = JSON.parse(formData.get('keys'));

  // console.log({ validateCampground: latlong });
  const keysSchemaUpdateCG = Joi.array().max(MAX_IMAGES).required();
  const keysSchemaCreateCG = Joi.array().min(MIN_IMAGES).max(MAX_IMAGES).unique().items(Joi.string().required()).required();

  const schema = Joi.object({
    id: Joi.string().uuid().required(),
    author: Joi.string().uuid().required(),
    name: Joi.string().required(),
    latlong: Joi.array().min(2).max(2).items(Joi.number().required()).required(),
    location: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string().required(),
    keys: isCreateCampground ? keysSchemaUpdateCG : keysSchemaCreateCG,
  });

  return schema.validate({ id, author, name, latlong, location, price, description, keys }, { abortEarly: false });
}

async function geocodeLocation(location) {
  // fix it later to respect rate limiting
  const ENDPOINT = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=geojson`;
  const res = await fetch(ENDPOINT);
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  const lngLat = data.features[0].geometry.coordinates;
  return lngLat.reverse();
}

// C: Create
export async function createCampground(currentState, formData) {
  // isLoggedIn?
  if (!(await isLoggedIn())) {
    const serverError = 1;
    console.log({ serverError });
    return { serverError: true, message: 'Something went wrong!' };
  }

  // check if images sent are more than MAX_IMAGES
  if (!(JSON.parse(formData.get('keys')).length <= MAX_IMAGES)) {
    const serverError = 2;
    console.log({ serverError });
    return {
      serverError: true,
      message: `More than ${MAX_IMAGES} are not allowed.`
    }
  }

  // geocode the location given w/ 1sec interval for rate limiting
  // and throw error if geocoding fails
  const coords = await geocodeLocation(formData.get('location'));
  if (!coords) {
    const serverError = 3;
    console.log({ serverError });
    return { serverError: true, message: 'Something went wrong! Please try again' };
  }

  console.log({ coords });
  // add latlong to formData
  formData.append('latlong', JSON.stringify(coords));

  // validate formData
  const { value: validatedData, error } = validateCampground(formData);

  if (error) {
    const serverError = {};
    error.details.map(err => {
      serverError[err.context.key] = false;
    });
    console.log({ serverError });
    return { serverError: true, message: 'Failed to create campground. Please try again.' };
  }

  const { id, author, name, price, location, description, latlong, keys } = validatedData;

  // verify user - verifying that user who's logged in and the one sending req to create a CG are the same
  const session = (await getSession());
  const uid = session?.user?.id;
  if (uid !== author) {
    const serverError = 4;
    console.log({ serverError });
    return { message: 'Something went wrong.', serverError: true };
  }
  // console.log({id, author, name, price, location, description});

  const client = await pool.connect();
  try {
    const insertQuery = `
        INSERT INTO campgrounds(id, author, name, price, description, lat_long, location)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
    const { rows } = await client.query(insertQuery, [id, author, name, price, description, latlong, location]);
  }
  catch (e) {
    const serverError = 5;
    console.log({ serverError });
    return { serverError: true, message: 'Something went wrong. Please try again' };
  }
  finally {
    client.release();
  }

  // add data to images table and contactinfo table
  const authorName = session?.user.name;
  const imgsRes = await addNewImages({ keys, c_id: id, credit: authorName, altText: name, u_id: author });
  if (imgsRes?.serverError) {
    return imgsRes;
  }

  const contactInfoRes = await addContactInfo(id);
  if (contactInfoRes?.serverError) {
    return contactInfoRes;
  }

  // set user's role to "host" if not already
  if (session.user.role !== 'host') {
    const res = await setUserRole(author, 'host');
    const cs = await cookies();
    cs.delete('user_role');
    cs.set('user_role', 'host');
  }

  return {
    success: true,
    id: id,
    message: `${name} created successfully!`,
  }
}

// R: Read
export const getCampgroundById = React.cache(
  async function (id) {
    const client = await pool.connect();
    try {
      const { rows: campgroundData } = await client.query('select * from campgrounds where id=$1', [id]);
      return campgroundData[0];
    }
    catch (e) {
      console.log(e);
      return { error: true };
    }
    finally {
      client.release();
    }
  }
)

export async function getCampgrounds(limit, prefetchedIDs) {
  let readQuery;
  const client = await pool.connect();
  try {
    if (!limit && !prefetchedIDs) {
      readQuery = `
       SELECT 
       campgrounds.*, 
       COALESCE(ROUND(AVG(reviews.rating), 2), 0) AS average_rating
       FROM campgrounds
       LEFT JOIN reviews ON campgrounds.id = reviews.c_id
       GROUP BY campgrounds.id;
     `;
      const { rows: cgs } = await client.query(readQuery);
      return cgs;
    }

    else if (limit && prefetchedIDs) {
      const validSyntax = prefetchedIDs.map((id) => `'${id}'`);
      readQuery = `
      SELECT 
      campgrounds.*, 
      COALESCE(ROUND(AVG(reviews.rating), 2), 0) AS average_rating, 
      COALESCE(json_agg(DISTINCT to_jsonb(images)) FILTER (WHERE images.id IS NOT NULL), '[]') AS images
      FROM campgrounds
      LEFT JOIN reviews ON campgrounds.id = reviews.c_id
      LEFT JOIN images ON campgrounds.id = images.c_id
      WHERE campgrounds.id NOT IN (${validSyntax})
      GROUP BY campgrounds.id
      ORDER BY random()
      LIMIT $1;
      `;
      // return readQuery;
      const { rows: cgs } = await client.query(readQuery, [limit]);
      return cgs;
    }

    else if (limit && !prefetchedIDs) {
      readQuery = `
      SELECT 
      campgrounds.*, 
      COALESCE(ROUND(AVG(reviews.rating), 2), 0) AS average_rating, 
      COALESCE(json_agg(DISTINCT to_jsonb(images)) FILTER (WHERE images.id IS NOT NULL), '[]') AS images
      FROM campgrounds
      LEFT JOIN reviews ON campgrounds.id = reviews.c_id
      LEFT JOIN images ON campgrounds.id = images.c_id
      GROUP BY campgrounds.id
      ORDER BY random()
      LIMIT $1;
      `;
      const { rows: cgs } = await client.query(readQuery, [limit]);
      return cgs;
    }
  }
  catch (e) {
    console.log(e);
    return;
  }
  finally {
    client.release();
  }
}

export async function getCampgroundsBySearchTerm(searchTerm) {
  const client = await pool.connect();
  try {
    const searchQuery = `
      SELECT 
      campgrounds.*, 
      COALESCE(ROUND(AVG(reviews.rating), 2), 0) AS average_rating, 
      COALESCE(json_agg(DISTINCT to_jsonb(images)) FILTER (WHERE images.id IS NOT NULL), '[]') AS images
      FROM campgrounds
      LEFT JOIN reviews ON campgrounds.id = reviews.c_id
      LEFT JOIN images ON campgrounds.id = images.c_id
      WHERE name ILIKE $1
      GROUP BY campgrounds.id
    `;
    // SELECT * FROM campgrounds WHERE name ILIKE $1
    const { rows: matchingCampgrounds } = await client.query(searchQuery, [`${searchTerm}%`]);
    return matchingCampgrounds;
  }
  catch (e) {
    const serverError = 6;
    console.log({ serverError });
  }
  finally {
    client.release();
  }
}

export async function getCampgroundsByUserId(id, limit = 8, offset = 0) {
  const client = await pool.connect();
  try {
    const fetchQuery =
      `
      WITH total_count AS (
        SELECT COUNT(*) AS total_campgrounds
        FROM campgrounds
        WHERE author=$1
      )
      SELECT 
        campgrounds.*, 
        COALESCE(ROUND(AVG(reviews.rating), 2), 0) AS average_rating, 
        COALESCE(json_agg(DISTINCT to_jsonb(images)) FILTER (WHERE images.id IS NOT NULL), '[]') AS images,
        total_count.total_campgrounds
      FROM campgrounds
      LEFT JOIN reviews ON campgrounds.id = reviews.c_id
      LEFT JOIN images ON campgrounds.id = images.c_id
      CROSS JOIN total_count
      WHERE campgrounds.author=$1
      GROUP BY campgrounds.id, total_count.total_campgrounds
      ORDER BY campgrounds.name
      OFFSET $2
      LIMIT $3;
    `;
    const { rows } = await client.query(fetchQuery, [id, offset, limit]);
    return rows;
  }
  catch (e) {
    const serverError = 7;
    console.log({ serverError }, e);
    return null;
  }
  finally {
    client.release();
  }
}

export async function getCampgroundsCountByUserId(id) {
  const client = await pool.connect();
  try {
    const fetchQuery = `select count(*) from campgrounds where author=$1`;
    const { rows } = await client.query(fetchQuery, [id]);
    return rows[0].count;
  }
  catch (e) {
    const serverError = 8;
    console.log({ serverError });
    return null;
  }
  finally {
    client.release();
  }
}

// U: Update
export async function updateCampground(currentState, formData) {
  // console.log('start');
  // isLoggedIn?
  if (!(await isLoggedIn())) {
    const serverError = 9;
    console.log({ serverError });
    return { serverError: true, message: 'Something went wrong.' };
  }

  // isAuthorized?
  const formDataAsObject = Object.fromEntries(formData.entries());
  const session = await getSession();
  const userID = session?.user?.id;
  if (formDataAsObject.author !== userID) {
    const serverError = 10;
    console.log({ serverError });
    return { serverError: true, message: 'Something went wrong!' };
  }

  // check if images sent are more than MAX_IMAGES
  const oldImgs = JSON.parse(formData.get('totalOldImages'));
  const newImgs = JSON.parse(formData.get('keys'));
  const imgsToDel = Object.entries(formDataAsObject).filter((ele) => ele[0].startsWith('imagesToDelete-')).map((ele) => ele[1]);
  const combinedKeys = oldImgs.filter((img, idx) => !imgsToDel.includes(img));

  Array.isArray(newImgs) && combinedKeys.push(...newImgs);
  formData.set('keys', JSON.stringify(combinedKeys));
  const totalOldImgs = oldImgs.length;
  const totalImages = totalOldImgs + newImgs?.length;
  if (totalImages > MAX_IMAGES) {
    const serverError = 11;
    console.log({ serverError }, totalImages);
    return {
      serverError: true,
      message: `More than ${MAX_IMAGES} are not allowed.`
    }
  }

  // geocode the location given w/ 1sec interval for rate limiting
  // and throw error if geocoding fails
  const coords = await geocodeLocation(formData.get('location'));
  if (!coords) {
    const serverError = 12;
    console.log({ serverError });
    return { serverError: true, message: 'Something went wrong! Please try again' };
  }

  // add latlong to formData
  formData.append('latlong', JSON.stringify(coords));

  // validate formData
  const { value: validatedData, error } = validateCampground(formData);

  if (error) {
    const serverError = {};
    error.details.map(err => {
      serverError[err.context.key] = false;
    });

    return { serverError: true, message: 'Failed to update campground data. Please try again.' };
  }

  // delete images from uploadthing
  const res = await utApi.deleteFiles(imgsToDel);
  console.log({ uploadthingDel: res });
  if (!res.success) {
    const serverError = 13;
    console.log({ serverError }, res);
    return { serverError: true, message: 'Something went wrong' };
  }

  const { id, author, name, price, location, description, latlong, keys } = validatedData;

  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE campgrounds
      SET name = $1, location = $2, price = $3, description = $4, lat_long = $5
      WHERE id = $6 AND author = $7
      RETURNING *;
    `;

    const { rows } = await client.query(updateQuery, [name, location, price, description, latlong, id, author]);
  }
  catch (e) {
    const serverError = 14
    console.log({ serverError }, e);
    return { serverError: true, message: 'Something went wrong' };
  }
  finally {
    client.release();
  }

  // update data in images table 
  const authorName = session.user.name;
  const imgsRes = await updateImagesByCampgroundID({ keys, c_id: id, credit: authorName, altText: name, u_id: author });
  if (imgsRes?.serverError) {
    imgsRes.serverError = true;
    return imgsRes;
  }

  // return state with id
  return {
    success: true,
    id: id,
    message: 'Campground data updated successfully!',
  }
}

// D: Delete
export async function deleteCampground(id) {
  // isLoggedIn?
  if (!(await isLoggedIn())) {
    const serverError = 15;
    console.log({ serverError });
    return { serverError: true, message: 'Something went wrong.' };
  }

  // isAuthorized?
  const campground = await getCampgroundById(id);
  const userID = (await getSession())?.user?.id;
  if (campground.author !== userID) {
    const serverError = 16;
    console.log({ serverError });
    return { serverError: true, message: 'Something went wrong!' };
  }

  // delete images from uploadthing
  const imgsToDel = await getImageKeysByCampgroundID(id);
  const res = await utApi.deleteFiles(imgsToDel);
  console.log({ uploadthingDel: res });
  if (!res.success) {
    const serverError = 17;
    console.log({ serverError }, res);
    return { serverError: true, message: 'Something went wrong' };
  }

  const client = await pool.connect();
  try {
    const deleteQuery = `
      DELETE FROM campgrounds 
      WHERE id=$1 
      RETURNING *;
    `;

    const { rows } = await client.query(deleteQuery, [id]);

    // return value
    return { success: rows[0] };
  }
  catch (e) {
    const serverError = 18;
    console.log({ serverError });
    return { serverError: true, message: 'Something went wrong' };
  }
  finally {
    client.release();
  }
}