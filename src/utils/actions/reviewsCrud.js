'use server';
import Joi from "joi";
import { getSession, isLoggedIn } from "../auth/helpers";
import { getPool } from "./db";

const pool = await getPool();

function validateReview(formData) {
	let { id, c_id, u_id, rating, body } = formData;
	id = id.length !== 0 ? id : crypto.randomUUID();

	const schema = Joi.object({
		id: Joi.string().uuid().required(),
		c_id: Joi.string().uuid().required(),
		u_id: Joi.string().uuid().required(),
		rating: Joi.number().min(1).max(5).required(),
		body: Joi.string().required(),
	});

	return schema.validate({ id, c_id, u_id, rating, body }, { abortEarly: false });
}

// C: Create
export async function createReview(currentState, formData) {
	// isLoggedIn?
	if (!(await isLoggedIn())) {
		const serverError = 27;
		console.log({ serverError });
		return { error: true, message: 'Something went wrong!' };
	}

	// add user id from session
	const formDataAsObject = Object.fromEntries(formData.entries());
	formDataAsObject.u_id = (await getSession())?.user?.id;

	// validate formData
	const { value: validatedData, error } = validateReview(formDataAsObject);

	if (error) {
		const serverError = {};
		error.details.map(err => {
			serverError[err.context.key] = false;
		});

		console.log(serverError);
		return { serverError: true, message: "Failed to create review. Please try again." };
	}

	const { id, c_id, u_id, rating, body } = validatedData;

	const insertQuery = `
			INSERT INTO reviews(id, c_id, u_id, rating, body)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, c_id, u_id, rating, body
	`;
	const client = await pool.connect();
	try {
		const { rows } = await client.query(insertQuery, [id, c_id, u_id, rating, body]);
		return {
			success: true,
			message: "Review created successfully!",
			rows
		}
	}
	catch (e) {
		console.log(e);
		return { serverError: true, message: 'Something went wrong' }
	}
	finally {
		client.release();
	}
}

// R: Read
export async function getReviewsByCampgroundId(c_id) {
	const client = await pool.connect();
	try {
		const fetchByCampIDQuery = `
			SELECT reviews.*, users.name AS author
			FROM reviews
			JOIN users ON reviews.u_id = users.id
			WHERE reviews.c_id = $1
			ORDER BY created_at DESC;
		`;
		const { rows: reviewData } = await client.query(fetchByCampIDQuery, [c_id]);
		return reviewData;
	}
	catch (e) {
		console.log({ serverError: 28 });
		return { serverError: true };
	}
	finally {
		client.release();
	}
}

export async function getReviewsByReviewId(id) {
	const client = await pool.connect();
	try {
		const fetchByCampIDQuery = `
			SELECT *
			FROM reviews
			WHERE id = $1;
		`;
		const { rows: reviewData } = await client.query(fetchByCampIDQuery, [id]);
		return reviewData;
	}
	catch (e) {
		console.log({ serverError: 29 });
		return { serverError: true };
	}
	finally {
		client.release();
	}
}

// this should be deleted (if cgCRUD's getCGsByUserID works)
export async function getAvgReviewsByCampgroundId(c_id) {
	const query = `SELECT rating FROM reviews WHERE c_id=$1`;
	const client = await pool.connect();
	try {
		// Fetch all ratings for the given campground ID
		const { rows: ratingsQueryRows } = await client.query(query, [c_id]);

		// If there are no reviews for the given campground, return 0.
		if (ratingsQueryRows.length === 0) {
			return 0;
		}

		// Calculate the sum of all ratings and the total count of reviews
		let sumOfReviews = 0;
		const totalReviews = ratingsQueryRows.length;

		ratingsQueryRows.forEach((row) => {
			sumOfReviews += row.rating;
		});

		// Calculate the average rating
		const avg = Number.parseFloat(sumOfReviews / totalReviews).toFixed(2);
		return avg;
	}
	catch (e) {
		const serverError = 'fetch error <get-avg-Reviews-By-CampgroundId>';
		console.log(serverError, e)
		return null;
	}
	finally {
		client.release();
	}
}

// U: Update
export async function updateReview(currentState, formData) {
	// isLoggedIn?
	if (!(await isLoggedIn())) {
		console.log({ serverError: 30 });
		return { serverError: true, message: 'Something went wrong!' };
	}

	// isAuthorized?
	const formDataAsObject = Object.fromEntries(formData.entries());
	const userID = (await getSession())?.user?.id;
	if (formDataAsObject.u_id !== userID) {
		console.log({ serverError: 31 });
		return { serverError: true, message: 'Something went wrong!' };
	}

	// validate formData
	const { value: validatedData, error } = validateReview(formDataAsObject);

	if (error) {
		console.log(error);
		const serverError = {};
		error.details.map(err => {
			serverError[err.context.key] = false;
		});

		return { serverError: true, message: 'Failed to update review. Please try again.' };
	}

	const { id, c_id, rating, body } = validatedData;

	// update query for updating cg by id
	const updateQuery = `
    UPDATE reviews
    SET body = $1, rating = $2
    WHERE id = $3
    RETURNING id, c_id, u_id, body, rating;
  `;

	try {
		const { rows } = await pool.query(updateQuery, [body, rating, id]);
		return {
			success: true,
			message: "Review updated successfully!",
			rows
		}
	}
	catch (e) {
		console.log(e);
		return { serverError: true, message: 'Something went wrong' };
	}
}

// D: Delete
export async function deleteReview(reviewID) {
	// isLoggedIn?
	if (!(await isLoggedIn())) {
		console.log({ serverError: 32 })
		return { serverError: true, message: 'Something went wrong!' };
	}

	// isAuthorized?
	const review = (await getReviewsByReviewId(reviewID))[0];
	const userID = (await getSession())?.user?.id;
	if (review.u_id !== userID) {
		const serverError = 33;
		console.log({ serverError });
		return { serverError, message: 'Something went wrong!' };
	}

	try {
		const deleteQuery = `
			DELETE FROM reviews
			WHERE id = $1
			RETURNING *;
		`;
		const { rows } = await pool.query(deleteQuery, [reviewID]);
		console.log(rows);
		// return rows;
	}
	catch (e) {
		console.error({ serverError: 34 }, e);
	}
}

/**
 * When to explicitly check if the review being deleted actually exists
 * When Deleting Requires Extra Logic
		Example: If deleting a review also triggers other actions (like updating a campground rating), 
		you might want to check first.

		Example: If permissions need to be validated before deleting (e.g., only the review's author can delete it).
*/