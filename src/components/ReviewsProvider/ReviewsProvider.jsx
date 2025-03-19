"use client";
import React from "react";

import {
  createReview,
  getReviewsByCampgroundId,
  deleteReview,
} from "@/utils/actions/reviewsCrud";
import useToggle from "@/utils/hooks/use-toggle";

export const ReviewsContext = React.createContext();

export default function ReviewsProvider({
  children,
  campgroundID,
  isLoggedIn,
  userData,
}) {
  const [reviewsData, dispatch] = React.useReducer(reducer, ["initial state"]);
  const [loading, toggleLoading] = useToggle(true);
  const [isPending, startTransition] = React.useTransition();
  const { userID, name } = userData;

  React.useEffect(() => {
    startTransition(async () => {
      const reviewsFromDB = await getReviewsByCampgroundId(campgroundID);
      dispatch({
        type: "reviews-from-DB",
        value: reviewsFromDB,
      });
      toggleLoading();
    });
  }, []);

  function pushNewReview(review) {
    if (!isLoggedIn) return;
    review.author = name;
    dispatch({
      type: "push-new-review",
      value: review,
    });
    return true;
  }

  function deleteReviewById(reviewID, u_ID) {
    if (!isLoggedIn) return;
    if (u_ID !== userID) return;
    deleteReview(reviewID);
    dispatch({
      type: "delete-by-review-id",
      id: reviewID,
    });
    return true;
  }

  function editReview(review) {
    if (!isLoggedIn) return;
    if (review.u_id !== userID) return;
    dispatch({
      type: "update-review",
      value: review,
    });
    return true;
  }

  const value = React.useMemo(
    () => ({
      reviews: reviewsData.reviews,
      pushNewReview,
      campgroundID,
      deleteReviewById,
      createReview,
      editReview,
      isLoggedIn,
      userID,
      avgReviews: reviewsData.average,
      totalReviews: reviewsData.totalReviews,
      loading,
    }),
    [reviewsData, isLoggedIn, loading]
  );

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
}

function reducer(reviewsData, action) {
  // [{review: {}, average: Number, totalReviews: Number}]
  function constructReviewsStr(reviewData) {
    return {
      reviews: reviewData,
      totalReviews: reviewData.length,
      average: Number.parseFloat(
        (() => {
          let sumOfRatings = 0;
          reviewData.forEach(({ rating }) => (sumOfRatings += rating));
          return Number.parseFloat(sumOfRatings / reviewData.length).toFixed(2);
        })()
      ),
    };
  }

  switch (action.type) {
    case "reviews-from-DB": {
      return constructReviewsStr(action.value);
    }

    case "push-new-review": {
      return constructReviewsStr([action.value, ...reviewsData.reviews]);
    }

    case "delete-by-review-id": {
      const reviews = reviewsData.reviews;
      const nextReviews = [];
      for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].id === action.id) {
          continue;
        } else {
          nextReviews.push(reviews[i]);
        }
      }

      return constructReviewsStr(nextReviews);
    }

    case "update-review": {
      const updatedReview = action.value;
      const nextReviews = reviewsData.reviews.map((review) => {
        return review.id === updatedReview.id ? updatedReview : review;
      });

      return constructReviewsStr(nextReviews);
    }
  }
}
