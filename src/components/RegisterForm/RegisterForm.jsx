"use client";
import React from "react";
import { createUser } from "@/utils/actions/usersCrud";
import { SessionContext } from "../SessionProvider";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormSubmit,
} from "@radix-ui/react-form";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import AuthError from "../AuthError";
import useToggle from "@/utils/hooks/use-toggle";
import { Eye, EyeOff } from "lucide-react";
import HelperCard from "../HelperCard";

export default function RegisterForm({ setOpen }) {
  const { refresh } = React.useContext(SessionContext);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [formState, formAction, isPending] = React.useActionState(
    createUser,
    null
  );
  const [errorMessage, setErrorMessage] = React.useState("");
  const [showPass, toggle] = useToggle();

  React.useEffect(() => {
    console.log({ formState });
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
    <Flex direction={"column"} gapY={"4"}>
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
                  <FormMessage match={"valueMissing"}></FormMessage>
                </Text>
              </Flex>
              <FormControl asChild>
                <TextField.Root type="text" disabled={isPending} required />
              </FormControl>
            </FormField>
          </Box>

          <Box asChild width={"100%"}>
            <FormField name="name">
              <Flex justify={"between"}>
                <Text asChild size={"2"}>
                  <FormLabel>Name</FormLabel>
                </Text>
                <Text asChild weight={"regular"} size={"2"}>
                  <FormMessage match={"valueMissing"}></FormMessage>
                </Text>
              </Flex>
              <FormControl asChild>
                <TextField.Root type="text" disabled={isPending} required />
              </FormControl>
            </FormField>
          </Box>

          <Box asChild width={"100%"}>
            <FormField name="email">
              <Flex justify={"between"}>
                <Text asChild size={"2"}>
                  <FormLabel>Email</FormLabel>
                </Text>
                <Text asChild weight={"regular"} size={"2"}>
                  <FormMessage match={"valueMissing"}></FormMessage>
                </Text>
              </Flex>
              <FormControl asChild>
                <TextField.Root required type="email" disabled={isPending} />
              </FormControl>
            </FormField>
          </Box>

          <Box asChild width={"100%"}>
            <FormField name="password">
              <Flex justify={"between"}>
                <Text asChild size={"2"}>
                  <Flex align={"center"}>
                    <FormLabel>Password</FormLabel>
                    <HelperCard
                      message={
                        "Password must contain: atleast one lowercase letter, one uppercase letter, one number, one symbol and should be 8-16 characters long."
                      }
                    />
                  </Flex>
                </Text>
                <Text asChild weight={"regular"} size={"2"}>
                  <FormMessage match={"valueMissing"}></FormMessage>
                </Text>
              </Flex>
              <FormControl asChild>
                <TextField.Root
                  type={showPass ? "text" : "password"}
                  required
                  disabled={isPending}
                >
                  <TextField.Slot side="right">
                    <IconButton
                      size={"1"}
                      variant="ghost"
                      color="gray"
                      highContrast
                      onClick={toggle}
                      type="button"
                    >
                      {showPass ? (
                        <Eye size={"16px"} color="black" />
                      ) : (
                        <EyeOff size={"16px"} color="black" />
                      )}
                    </IconButton>
                  </TextField.Slot>
                </TextField.Root>
              </FormControl>
            </FormField>
          </Box>

          <FormSubmit asChild>
            <Button loading={isPending} color="grass">
              Sign Up
            </Button>
          </FormSubmit>
        </Form>
      </Flex>
    </Flex>
  );
}
