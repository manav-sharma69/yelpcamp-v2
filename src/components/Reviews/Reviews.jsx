"use client";
import React from "react";
import styles from "./styles.module.css";
import { ReviewsContext } from "../ReviewsProvider";

import { updateReview } from "@/utils/actions/reviewsCrud";
import ReviewsSummary from "./ReviewsSummary";
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  IconButton,
  ScrollArea,
} from "@radix-ui/themes";
import { Pen, Star, Trash2, X } from "lucide-react";
import Link from "../Link";
import ReviewForm from "../ReviewForm";
import { ToastContext } from "../ToastProvider";

export default function Review({ campgroundName }) {
  const { totalReviews } = React.useContext(ReviewsContext);

  return (
    <>
      <ReviewsSummary campgroundName={campgroundName} variant="large" />
      {totalReviews > 0 && <Reviews />}
    </>
  );
}

function Reviews() {
  const { reviews } = React.useContext(ReviewsContext);

  const reviewsOnDisplay = reviews.slice(0, 6);

  return (
    <div className={styles["grid-item-six"]}>
      <div className={styles["reviews-grid"]}>
        {reviewsOnDisplay.map((review, i) => (
          <ReviewCard key={i} reviewData={review} />
        ))}
      </div>
      {reviews.length > 6 && <AllReviewsDialog reviews={reviews} />}
    </div>
  );
}

function AllReviewsDialog({ reviews }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          ml={"16px"}
          mb={"32px"}
          variant="outline"
          size={"3"}
          color="gray"
          highContrast
        >
          Show all {reviews.length} reviews
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        size={"4"}
        height={"80vh"}
        width={"60vw"}
        maxWidth={"none"}
      >
        <Flex width={"100%"} align={"center"} justify={"between"} mb={"5"}>
          <Flex align={"center"} justify={"between"} asChild gapX={"4"}>
            <Dialog.Title>
              <Star fill="black" size={"18px"} /> {reviews.length} reviews
            </Dialog.Title>
          </Flex>
          <Dialog.Close>
            <IconButton color="gray" highContrast variant="ghost" size={"1"}>
              <X strokeWidth={"2px"} size={"16px"} />
            </IconButton>
          </Dialog.Close>
        </Flex>
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: "89%" }}
        >
          <div className={styles["reviews-grid"]}>
            {reviews.map((review, i) => (
              <ReviewCard key={i} reviewData={review} />
            ))}
          </div>
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function ReviewCard({ reviewData }) {
  const { deleteReviewById, userID } = React.useContext(ReviewsContext);
  const { createToast } = React.useContext(ToastContext);
  const { id, u_id, body, rating, author } = reviewData;
  const isAuthor = u_id === userID;

  function handleDeleteReview() {
    if (!isAuthor) {
      // createToast('You are not allowed to do that!', 'error');
      return;
    }

    const res = deleteReviewById(id, u_id);
    res
      ? createToast("Review Deleted", "success")
      : createToast(
          "Something went wrong while deleting review. Please try again",
          "warning"
        );
  }

  return (
    <Card className={styles["review-card"]} variant="ghost">
      {/* author + ratings */}
      <Flex align={"center"} justify={"between"}>
        <Flex align={"center"} gap={"3"}>
          <Avatar
            radius="full"
            src="https://avatar.iran.liara.run/public"
            fallback={"U"}
            color="iris"
          />{" "}
          {author}
        </Flex>

        <Flex>
          {new Array(5).fill(0).map((a, index) => {
            return (
              <Star
                key={index}
                fill={index < rating ? "black" : "hsl(0, 0%, 78%)"}
                size={"12px"}
                strokeWidth={"0px"}
              />
            );
          })}
        </Flex>
      </Flex>
      {/* body */}
      <Flex>
        <p className={styles["body"]}>{body}</p>
      </Flex>
      {/* show more + controls */}
      <Flex align={"center"} justify={"between"} py={"1"} px={"3"}>
        <Flex>
          <Link href="#">Show more</Link>
        </Flex>
        {isAuthor && (
          <Flex align={"center"} gap={"3"}>
            <EditFormDialog reviewData={reviewData} />
            <IconButton color="red" size={"1"} onClick={handleDeleteReview}>
              <Trash2 strokeWidth={"2px"} size={"12px"} />
            </IconButton>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}

function EditFormDialog({ reviewData }) {
  const { editReview } = React.useContext(ReviewsContext);
  const { id, c_id, body, rating, u_id } = reviewData;
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton color="jade" size={"1"}>
          <Pen strokeWidth={"2px"} size={"12px"} />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>
          <Flex align={"center"} justify={"between"}>
            <Heading>Edit Review</Heading>
            <Dialog.Close>
              <IconButton color="red" size={"1"}>
                <X strokeWidth={"2px"} size={"16px"} />
              </IconButton>
            </Dialog.Close>
          </Flex>
        </Dialog.Title>
        <Dialog.Description>Update your review</Dialog.Description>
        <ReviewForm
          updateClientSide={editReview}
          btnLabel={"Save changes"}
          submitAction={updateReview}
          reviewID={id}
          c_id={c_id}
          body={body}
          rating={rating}
          u_id={u_id}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
