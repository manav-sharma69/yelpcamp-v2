"use client";
import React from "react";
import useToggle from "@/utils/hooks/use-toggle";

import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import ResponsiveContainer from "../RespContainer";
import UserDetailsForm from "../UserDetailsForm";
import ResetPassword from "./ResetPassword";
import DeleteAccount from "./DeleteAccount";

export default function UserDetails({ userDetails }) {
  const [disabled, toggle] = useToggle(true);

  const { user, campgroundsOwned } = userDetails;

  return (
    <ResponsiveContainer
      width={{ md: "50%" }}
      maxWidth={{ xs: "500px", md: "none" }}
    >
      <Card mb={"3"}>
        <Flex align={"center"} py={"2"} justify={"between"} gap={"5"}>
          <Heading size={{ sm: "7" }}>Account Details</Heading>
          {disabled && (
            <Button onClick={toggle} color="jade">
              Edit Details
            </Button>
          )}
        </Flex>
      </Card>
      <Card mb={"3"}>
        <UserDetailsForm
          disabled={disabled}
          userData={user}
          campgroundsOwned={campgroundsOwned}
          cancelAction={toggle}
        />
      </Card>
      <Card mb={"3"}>
        <Flex align={"center"} justify={"between"}>
          <Text>Password</Text>
          <ResetPassword username={user.username} />
        </Flex>
      </Card>
      {disabled && (
        <Card mb={"3"}>
          <Flex align={"center"} justify={"between"} py={"2"}>
            <Text>Delete Account</Text>
            <DeleteAccount username={user.username} />
          </Flex>
        </Card>
      )}
    </ResponsiveContainer>
  );
}
