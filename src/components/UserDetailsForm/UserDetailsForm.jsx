"use client";
import React from "react";

import { Box, Button, DataList, Flex, Text, TextField } from "@radix-ui/themes";
import Link from "../Link";
import { updateUserData } from "@/utils/actions/usersCrud";
import HelperCard from "../HelperCard";
import { ToastContext } from "../ToastProvider";

export default function UserDetailsForm({
  userData,
  campgroundsOwned,
  disabled,
  cancelAction,
}) {
  const [formState, formAction, isPending] = React.useActionState(
    updateUserData,
    null
  );
  const { createToast } = React.useContext(ToastContext);
  const id = React.useId();

  React.useEffect(() => {
    if (formState?.success) {
      createToast("Changes saved", "success");
      cancelAction();
    }

    if (formState?.serverError) {
      createToast(formState.message, "error");
    }
  }, [formState]);

  return (
    <Box py={"2"}>
      <form action={formAction}>
        <input type="hidden" name="username" value={userData.username} />
        <DataList.Root
          size={"3"}
          orientation={{ sm: "horizontal", initial: "vertical" }}
        >
          {/* USERNAME - this value cannot be changed */}
          <DataList.Item>
            <DataList.Label minWidth="88px">
              <Text as="label" htmlFor={`${id}-username`}>
                Username
              </Text>
            </DataList.Label>
            <DataList.Value>
              <Flex align={"center"} justify={"between"} asChild>
                <TextField.Root
                  disabled
                  style={{ width: "100%" }}
                  defaultValue={userData.username}
                  id={`${id}-username`}
                >
                  <HelperCard message={"This is a read-only value"} />
                </TextField.Root>
              </Flex>
            </DataList.Value>
          </DataList.Item>

          {/* NAME */}
          <DataList.Item>
            <DataList.Label minWidth="88px">
              <Text as="label" htmlFor={`${id}-name`}>
                Name
              </Text>
            </DataList.Label>
            <DataList.Value>
              <TextField.Root
                defaultValue={formState?.name ?? userData.name}
                disabled={disabled}
                style={{ width: "100%" }}
                name="name"
                id={`${id}-name`}
                required
              />
            </DataList.Value>
          </DataList.Item>

          {/* EMAIL */}
          <DataList.Item align={"stretch"}>
            <DataList.Label minWidth="88px">
              <Text as="label" htmlFor={`${id}-email`}>
                Email
              </Text>
            </DataList.Label>
            <DataList.Value>
              <TextField.Root
                disabled={disabled}
                id={`${id}-email`}
                name="email"
                type="email"
                style={{ width: "100%" }}
                defaultValue={formState?.email ?? userData.email}
                required
              />
            </DataList.Value>
          </DataList.Item>

          {/* ROLE - this will stay disabled */}
          <DataList.Item>
            <DataList.Label minWidth="88px">
              <Text as="label" htmlFor={`${id}-role`}>
                Role
              </Text>
            </DataList.Label>
            <DataList.Value>
              <Flex align={"center"} justify={"between"} asChild>
                <TextField.Root
                  defaultValue={userData.role}
                  disabled
                  style={{ width: "100%" }}
                  id={`${id}-role`}
                >
                  <HelperCard message={"This is a read-only value"} />
                </TextField.Root>
              </Flex>
            </DataList.Value>
          </DataList.Item>

          {/* CAMPGROUNDS LISTED - this will stay disabled */}
          <DataList.Item>
            <DataList.Label minWidth="88px">
              <Text as="label" htmlFor={`${id}-campgrounds-listed`}>
                Campgrounds Listed
              </Text>
            </DataList.Label>
            <Box asChild width={"100%"}>
              <DataList.Value>
                <Flex align={"center"} justify={"between"} width={"100%"}>
                  <Flex align={"center"} justify={"between"} asChild>
                    <TextField.Root
                      type="number"
                      disabled
                      defaultValue={campgroundsOwned}
                      id={`${id}-campgrounds-listed`}
                    >
                      <HelperCard message={"This is a read-only value"} />
                    </TextField.Root>
                  </Flex>
                  <Link href="/host">
                    <Button variant="surface" color="jade" type="button">
                      {campgroundsOwned == 0 ? "Add new" : "Manage"}
                    </Button>
                  </Link>
                </Flex>
              </DataList.Value>
            </Box>
          </DataList.Item>
        </DataList.Root>

        {/* SAVE & CANCEL BUTTONS */}
        {!disabled && (
          <Flex align={"center"} justify={"between"} mt={"5"}>
            <Button
              type="button"
              color="gray"
              variant="soft"
              onClick={cancelAction}
            >
              Cancel
            </Button>
            <Button color="green" loading={isPending}>
              Save
            </Button>
          </Flex>
        )}
      </form>
    </Box>
  );
}
