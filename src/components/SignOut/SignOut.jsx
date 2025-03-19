"use client";
import React from "react";
import { signOut } from "@/utils/auth/helpers";

import { SessionContext } from "../SessionProvider";
import { Button } from "@radix-ui/themes";

export default function SignOut() {
  const { refresh, toggleCTAs } = React.useContext(SessionContext);

  async function handleOnClick() {
    toggleCTAs();
    signOut();
    refresh();
  }
  return <Button onClick={handleOnClick}>Log Out</Button>;
}
