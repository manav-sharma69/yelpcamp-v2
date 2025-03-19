"use client";
import React from "react";
import styles from "./styles.module.css";
import { ReviewsContext } from "../ReviewsProvider";

import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { Star, X } from "lucide-react";
import ReviewForm from "../ReviewForm";

export default function ReviewsSummary({ variant = "tiny", campgroundName }) {
  const { avgReviews, totalReviews, loading } =
    React.useContext(ReviewsContext);

  return variant === "tiny" ? (
    <TinySummary avg={avgReviews} total={totalReviews} loading={loading} />
  ) : (
    <LargeSummary
      loading={loading}
      avg={avgReviews}
      total={totalReviews}
      campgroundName={campgroundName}
    />
  );
}

function TinySummary({ avg, total, loading }) {
  return (
    <div className={styles["grid-item-two"]}>
      <Star fill="black" size={"13px"} />{" "}
      <Skeleton loading={loading}>
        {total > 0 ? (
          <Text>
            {avg} • {total} reviews
          </Text>
        ) : (
          <Text>No Reviews</Text>
        )}
      </Skeleton>
    </div>
  );
}

function LargeSummary({ avg, total, campgroundName, loading }) {
  return (
    <div className={styles["grid-item-five"]}>
      <Flex align={"center"} justify={"between"} width={"100%"}>
        <div>
          <Star fill="black" size={"24px"} />{" "}
          <Skeleton loading={loading}>
            {total > 0 ? (
              <Text size={"6"} weight={"medium"}>
                {avg} • {total} reviews
              </Text>
            ) : (
              <Text size={"6"} weight={"medium"}>
                No Reviews
              </Text>
            )}
          </Skeleton>
        </div>
        <AddReview campgroundName={campgroundName} />
      </Flex>
    </div>
  );
}

function AddReview({ campgroundName }) {
  const { createReview, pushNewReview, isLoggedIn } =
    React.useContext(ReviewsContext);
  if (!isLoggedIn) {
    return null;
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost" color="gray" highContrast size={"3"}>
          Review Campground
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Flex width={"100%"} align={"center"} justify={"between"}>
          <Dialog.Title>Add a review for {campgroundName}</Dialog.Title>
          <Dialog.Close>
            <IconButton color="gray" highContrast variant="ghost" size={"1"}>
              <X strokeWidth={"2px"} size={"16px"} />
            </IconButton>
          </Dialog.Close>
        </Flex>
        <Dialog.Description>
          Your review will be visible to anyone visiting this site.
        </Dialog.Description>
        <ReviewForm
          btnLabel={"Add Review"}
          updateClientSide={pushNewReview}
          submitAction={createReview}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
