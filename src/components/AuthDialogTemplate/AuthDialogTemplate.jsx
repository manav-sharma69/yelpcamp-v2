"use client";
import React from "react";

import { X } from "lucide-react";
import { Button, Dialog } from "@radix-ui/themes";
import RegisterForm from "../RegisterForm";
import LoginForm from "../LoginForm";

export default function AuthDialogTemplate({ isTypeLogIn }) {
  const [open, setOpen] = React.useState(false);

  const formUI = {
    triggerLabel: isTypeLogIn ? "Log In" : "Sign Up",
    title: isTypeLogIn ? "Log In" : "Sign Up",
    description: isTypeLogIn ? "Log In to YelpCamp" : "Create a new account",
    form: isTypeLogIn ? (
      <LoginForm setOpen={setOpen} />
    ) : (
      <RegisterForm setOpen={setOpen} />
    ),
  };

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger onClick={() => setOpen(true)}>
        <Button>{formUI.triggerLabel}</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Close style={{ float: "right" }} onClick={() => setOpen(false)}>
          <Button variant="ghost" color="gray">
            <X />
          </Button>
        </Dialog.Close>

        <Dialog.Title>{formUI.title}</Dialog.Title>
        <Dialog.Description mb={"3"}>{formUI.description}</Dialog.Description>

        {formUI.form}
      </Dialog.Content>
    </Dialog.Root>
  );
}
