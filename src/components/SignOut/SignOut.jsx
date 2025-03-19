"use client";
import React from "react";
import { signOut } from "@/utils/auth/helpers";

import { SessionContext } from "../SessionProvider";
import { Box, Button, Text } from "@radix-ui/themes";

export default function SignOut({ as = "text" }) {
  const { refresh, toggleCTAs } = React.useContext(SessionContext);
  const ELE = as === "text" ? Text : Button;

  async function handleOnClick() {
    toggleCTAs();
    signOut();
    refresh();
  }

  return <ELE onClick={handleOnClick}>Log Out</ELE>;
}
