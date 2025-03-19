"use client";
import React from "react";
import { authenticate } from "@/utils/auth/helpers";
import { useSearchParams } from "next/navigation";
import { SessionContext } from "../SessionProvider";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormSubmit,
} from "@radix-ui/react-form";
import { Box, Button, Flex, Text, TextField } from "@radix-ui/themes";
import AuthError from "../AuthError";

export default function LoginForm({ setOpen }) {
  const { refresh } = React.useContext(SessionContext);
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") || "http://localhost:3000";
  const [formState, formAction, isPending] = React.useActionState(
    authenticate,
    null
  );
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    let id;
    if (formState?.success) {
      if (typeof setOpen === "function") {
        setOpen(false);
      } else {
        id = setTimeout(() => {
          window.location.replace(callbackUrl);
        }, 1000);
      }
      refresh();
    } else if (!formState?.success && formState?.message) {
      setErrorMessage(formState?.message);
    }

    return () => {
      clearTimeout(id);
    };
  }, [formState]);

  return (
    <>
      {errorMessage !== "" && <AuthError message={errorMessage} />}

      <Flex
        asChild
        direction={"column"}
        align={"center"}
        justify={"center"}
        gapY={"4"}
        width={"100%"}
      >
        <Form action={formAction}>
          <Box asChild width={"100%"}>
            <FormField name="username">
              <Flex justify={"between"}>
                <Text asChild size={"2"}>
                  <FormLabel>Username</FormLabel>
                </Text>
                <Text asChild weight={"regular"} size={"2"}>
                  <FormMessage match={"valueMissing"}>
                    Enter a username
                  </FormMessage>
                </Text>
              </Flex>
              <FormControl asChild>
                <TextField.Root type="text" disabled={isPending} required />
              </FormControl>
            </FormField>
          </Box>

          <Box asChild width={"100%"}>
            <FormField name="password">
              <Flex justify={"between"}>
                <Text asChild size={"2"}>
                  <FormLabel>Password</FormLabel>
                </Text>
                <Text asChild weight={"regular"} size={"2"}>
                  <FormMessage match={"valueMissing"}>
                    Provide a password
                  </FormMessage>
                </Text>
              </Flex>
              <FormControl asChild>
                <TextField.Root type="password" disabled={isPending} required />
              </FormControl>
            </FormField>
          </Box>

          <FormSubmit asChild>
            <Button loading={isPending} color="grass">
              Log In
            </Button>
          </FormSubmit>
        </Form>
      </Flex>
    </>
  );
}
