"use client";
import React from "react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormSubmit,
} from "@radix-ui/react-form";
import { Box, Button, Flex, Text, TextArea, TextField } from "@radix-ui/themes";
import { ToastContext } from "../ToastProvider";
import Photos from "../PhotosStep";
import ImagesGrid from "../ImagesGrid";
import { SessionContext } from "../SessionProvider";

export default function CGDetailsForm({
  author,
  submitAction,
  buttonLabel = "Add Campground",
  imgs, // accepts images data for a particular CG in edit form
  ...delegated
}) {
  const [formState, formAction, isPending] = React.useActionState(
    submitAction,
    null
  );
  const router = useRouter();
  const { createToast } = React.useContext(ToastContext);
  const isEditForm = buttonLabel !== "Add Campground"; // or, !!imgs
  const containerWidth = isEditForm ? "70%" : "100%";
  const { disableCTA } = React.useContext(SessionContext);

  React.useEffect(() => {
    if (formState?.message) {
      createToast(formState.message, "error");
    }

    if (formState?.success) {
      createToast(formState.message, "success");
      router.push(`/camp/${formState.id}`);
    }
  }, [formState]);

  React.useEffect(() => {
    const msg =
      buttonLabel === "Add Campground"
        ? "Creating Campground..."
        : "Updating campground...";
    if (isPending) createToast(msg, "notice");
  }, [isPending]);

  return (
    <>
      <Flex
        asChild
        direction={"column"}
        align={"center"}
        justify={"center"}
        gapY={"4"}
        width={"100%"}
        pb={"8"}
      >
        <Form action={formAction}>
          {delegated?.id && (
            <input
              type="hidden"
              disabled={isPending}
              name="id"
              value={delegated.id}
            />
          )}

          <input
            type="hidden"
            disabled={isPending}
            name="author"
            value={author}
          />

          {/* name */}
          <Box asChild width={containerWidth}>
            <FormField name="name">
              <Flex justify={"between"}>
                <Text asChild size={"2"}>
                  <FormLabel>Campground Name</FormLabel>
                </Text>
                <Text asChild weight={"regular"} size={"2"}>
                  <FormMessage match={"valueMissing"}></FormMessage>
                </Text>
              </Flex>
              <FormControl asChild>
                <TextField.Root
                  disabled={isPending}
                  type="text"
                  defaultValue={delegated?.name}
                  required
                />
              </FormControl>
            </FormField>
          </Box>

          {/* edit page */}
          {isEditForm && (
            <Box width={imgs.length === 0 ? containerWidth : "100%"}>
              <ImagesGrid imgs={imgs} />
            </Box>
          )}

          {/* photos */}
          <Box width={containerWidth}>
            <Photos />
          </Box>

          {/* price */}
          <Box asChild width={containerWidth}>
            <FormField name="price">
              <Flex justify={"between"}>
                <Text asChild size={"2"}>
                  <FormLabel>Price</FormLabel>
                </Text>
                <Text asChild weight={"regular"} size={"2"}>
                  <FormMessage match={"valueMissing"}></FormMessage>
                </Text>
              </Flex>
              <FormControl asChild>
                <TextField.Root
                  disabled={isPending}
                  type="number"
                  defaultValue={delegated?.price}
                  required
                />
              </FormControl>
            </FormField>
          </Box>

          {/* location */}
          <Box asChild width={containerWidth}>
            <FormField name="location">
              <Flex justify={"between"}>
                <Text asChild size={"2"}>
                  <FormLabel>Location</FormLabel>
                </Text>
                <Text asChild weight={"regular"} size={"2"}>
                  <FormMessage match={"valueMissing"}></FormMessage>
                </Text>
              </Flex>
              <FormControl asChild>
                <TextField.Root
                  type="text"
                  disabled={isPending}
                  required
                  defaultValue={delegated?.location}
                />
              </FormControl>
            </FormField>
          </Box>

          {/* description */}
          <Box asChild width={containerWidth}>
            <FormField name="description">
              <Flex justify={"between"}>
                <Text asChild size={"2"}>
                  <FormLabel>Description</FormLabel>
                </Text>
                <Text asChild weight={"regular"} size={"2"}>
                  <FormMessage match={"valueMissing"}></FormMessage>
                </Text>
              </Flex>
              <FormControl asChild>
                <TextArea
                  disabled={isPending}
                  rows={"6"}
                  resize={"none"}
                  required
                  defaultValue={delegated?.description}
                />
              </FormControl>
            </FormField>
          </Box>

          <Flex width={containerWidth} justify={"between"} gap={"5"}>
            <Button
              disabled={isPending}
              color="red"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <FormSubmit asChild>
              <Button disabled={disableCTA} loading={isPending} color="grass">
                {buttonLabel}
              </Button>
            </FormSubmit>
          </Flex>
        </Form>
      </Flex>
    </>
  );
}
