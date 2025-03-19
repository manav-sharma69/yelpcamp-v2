"use client";
import { usePathname } from "next/navigation";
import { SessionContext } from "../SessionProvider";
import React from "react";

import { Flex, Text } from "@radix-ui/themes";
import AuthDialogTemplate from "../AuthDialogTemplate";
import Link from "@/components/Link";
import SignOut from "../SignOut";

export default function AuthCTAs() {
  const { session } = React.useContext(SessionContext);
  const pathname = usePathname();

  if (pathname === "/login") {
    return (
      <>
        <Link href="/signup">
          <Text>Sign Up</Text>
        </Link>
      </>
    );
  }

  if (pathname === "/signup") {
    return (
      <>
        <Link href="/login">
          <Text>Log In</Text>
        </Link>
      </>
    );
  }

  return !!session ? (
    <SignOut as="button" />
  ) : (
    <Flex direction={"row"} gapX={"5"}>
      <AuthDialogTemplate isTypeLogIn={true} />
      <AuthDialogTemplate isTypeLogIn={false} />
    </Flex>
  );
}
