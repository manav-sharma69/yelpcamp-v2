"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SessionContext } from "../SessionProvider";

import Link from "../Link";
import { Box, Button, DropdownMenu, Flex } from "@radix-ui/themes";
import SignOut from "../SignOut";
import AuthCTAs from "./AuthCTAs";

export default function NavLinks() {
  const pathname = usePathname();
  const { session, role } = React.useContext(SessionContext);
  const hostingLabel =
    role && role === "host" ? "Switch to hosting" : "Start Hosting";

  return (
    <Flex gapX={"6"} align={"center"}>
      <Flex
        display={{ initial: "none", sm: "flex" }}
        align={"center"}
        gapX={"6"}
      >
        {session ? (
          <Link
            href="/account"
            style={{
              borderBottom:
                pathname.includes("/account") && "2px solid currentColor",
            }}
          >
            Account
          </Link>
        ) : null}

        {pathname.includes("/host") &&
        !pathname.includes("/host/new") &&
        role === "host" ? (
          <Link href="/host/new">
            <Button>List New Campground</Button>
          </Link>
        ) : null}

        {!(
          pathname.includes("/host") ||
          pathname.includes("/login") ||
          pathname.includes("/signup")
        ) && (
          <Box display={{ initial: "none", sm: "block" }}>
            <Link
              href="/host"
              style={{
                borderBottom:
                  pathname.includes("/host") && "2px solid currentColor",
              }}
            >
              {hostingLabel}
            </Link>
          </Box>
        )}
        <AuthCTAs />
      </Flex>

      <Box display={{ sm: "none" }}>
        {!!session ? (
          role === "host" ? (
            <LoggedInHostMenu />
          ) : (
            <LoggedInGuestMenu />
          )
        ) : (
          <LoggedOutMenu />
        )}
      </Box>
    </Flex>
  );
}

function LoggedInGuestMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button>U</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item asChild>
          <Link href="/account">Account</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <Link href="/host">Start Hosting</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <SignOut />
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild>
          <Link href="/about">About</Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function LoggedOutMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button>U</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>
          <Link href="/login">Login</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Link href="/signup">Sign Up</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <Link href="/host">Start Hosting</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Item asChild>
          <Link href="/about">About</Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function LoggedInHostMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button>U</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item asChild>
          <Link href="/account">Account</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <Link href="/host">Start Hosting</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <SignOut />
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild>
          <Link href="/about">About</Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
