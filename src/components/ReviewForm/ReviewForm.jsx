"use client";
import React from "react";

import { Box, Button, Flex, Text, TextArea } from "@radix-ui/themes";
import { ReviewsContext } from "../ReviewsProvider";
import { ToastContext } from "../ToastProvider";
import StarRating from "../StarRating";
import useToggle from "@/utils/hooks/use-toggle";

export default function ReviewForm({
  btnLabel,
  submitAction,
  updateClientSide,
  cancelAction,
  reviewID = undefined,
  ...delegated
}) {
  const [formState, formAction, isPending] = React.useActionState(
    submitAction,
    null
  );
  const [rating, setRating] = React.useState(delegated?.rating ?? 0);
  const [successView, toggle] = useToggle();
  const [errorMsgType, setErrorMsgType] = React.useState("");
  const { campgroundID } = React.useContext(ReviewsContext);
  const { createToast } = React.useContext(ToastContext);

  React.useEffect(() => {
    if (formState?.serverError) {
      createToast(formState.message, "error");
    }

    if (formState?.success) {
      const res = updateClientSide(...formState.rows);
      !!res
        ? createToast(formState.message, "success")
        : createToast("Please refresh the page", "notice");
      toggle();
    }
  }, [formState]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = formData.get("body");
    if (rating === 0 && body.length === 0) {
      setErrorMsgType("both");
      return;
    } else if (rating === 0 && body.length > 0) {
      setErrorMsgType("rating");
      return;
    } else if (rating > 0 && body.length === 0) {
      setErrorMsgType("body");
      return;
    } else {
      formData.append("rating", rating);
      React.startTransition(async () => formAction(formData));
    }
  }

  return successView ? (
    <SuccessMessage />
  ) : (
    <Flex
      asChild
      direction={"column"}
      align={"center"}
      justify={"center"}
      gapY={"4"}
      width={"100%"}
    >
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="c_id" value={campgroundID} />
        <input type="hidden" name="id" value={reviewID} />
        <input type="hidden" name="u_id" value={delegated?.u_id} />

        <Box width={"100%"} mt={"3"}>
          <Flex justify={"between"}>
            <Text size={"4"} weight={"medium"}>
              Rating
            </Text>
            <Text weight={"regular"} size={"2"}>
              {(errorMsgType === "both" || errorMsgType === "rating") &&
                "Please rate the campsite."}
            </Text>
          </Flex>
          <StarRating rating={rating} setRating={setRating} />
        </Box>

        <Box width={"100%"}>
          <Flex justify={"between"}>
            <Text as="label" id="rating-body" size={"4"} weight={"medium"}>
              Comment
            </Text>
            <Text weight={"regular"} size={"2"}>
              {(errorMsgType === "both" || errorMsgType === "body") &&
                "Please add a comment before submitting!"}
            </Text>
          </Flex>
          <TextArea
            id="rating-body"
            name="body"
            rows={"7"}
            color="crimson"
            resize={"none"}
            defaultValue={delegated?.body}
          />
        </Box>

        <Flex
          direction={"row"}
          justify={"between"}
          align={"center"}
          width={"100%"}
        >
          {/* <Button type='button' color="red" onClick={() => cancelAction()}>Cancel</Button> */}
          <Button color="amber" variant="outline">
            {isPending ? "..." : btnLabel}
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}

function SuccessMessage() {
  return <>Success!</>;
}
// used to notify that a review is being added or edited
// React.useEffect(() => {
// 	const msg = reviewID ? "Updating your review, please wait..." : "Creating your review, please wait..."
// 	if(isPending) createToast(msg, 'notice');
// }, [isPending]);
