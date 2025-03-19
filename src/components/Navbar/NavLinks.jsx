"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SessionContext } from "../SessionProvider";

import Link from "../Link";
import { Box, Button, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import SignOut from "../SignOut";
import AuthCTAs from "./AuthCTAs";
import { signOut } from "@/utils/auth/helpers";
import { ToastContext } from "../ToastProvider";

export default function NavLinks() {
  const pathname = usePathname();
  const { session, role } = React.useContext(SessionContext);
  const hostingLabel =
    role && role === "host" ? "Switch to hosting" : "Start Hosting";

  const currPath = {
    isLoginPage: pathname.includes("/login"),
    isSignUpPage: pathname.includes("/signup"),
    isHostingPage: pathname.includes("/host"),
    isAboutPage: pathname.includes("/about"),
    isAccountPage: pathname.includes("/account"),
    isCreateCampgroundPage: pathname.includes("/host/new"),
  };

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
              borderBottom: currPath.isAccountPage && "2px solid currentColor",
            }}
          >
            Account
          </Link>
        ) : null}

        {currPath.isHostingPage &&
        !currPath.isCreateCampgroundPage &&
        role === "host" ? (
          <Link href="/host/new">
            <Button>List New Campground</Button>
          </Link>
        ) : null}

        {!(
          currPath.isHostingPage ||
          currPath.isLoginPage ||
          currPath.isSignUpPage
        ) && (
          <Box display={{ initial: "none", sm: "block" }}>
            <Link
              href="/host"
              style={{
                borderBottom:
                  currPath.isHostingPage && "2px solid currentColor",
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
          // role === "host" ? (
          //   <LoggedInHostMenu />
          // ) : (
          //   <LoggedInGuestMenu />
          // )
          <LoggedInMenu
            role={role}
            currPath={currPath}
            hostingLabel={hostingLabel}
          />
        ) : (
          <LoggedOutMenu currPath={currPath} />
        )}
      </Box>
    </Flex>
  );
}

function LoggedInMenu({ currPath, hostingLabel, role }) {
  const { refresh, toggleCTAs } = React.useContext(SessionContext);
  const { createToast } = React.useContext(ToastContext);

  async function handleOnClick() {
    toggleCTAs();
    signOut();
    refresh();
    createToast(`You've been logged out.`, "success");
  }
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button>U</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {!currPath.isAccountPage && (
          <DropdownMenu.Item asChild>
            <Link href="/account">Account</Link>
          </DropdownMenu.Item>
        )}
        {!currPath.isHostingPage && (
          <DropdownMenu.Item asChild>
            <Link href="/host">{hostingLabel}</Link>
          </DropdownMenu.Item>
        )}

        {currPath.isHostingPage &&
        !currPath.isCreateCampgroundPage &&
        role === "host" ? (
          <DropdownMenu.Item asChild>
            <Link href="/host/new">List New Campground</Link>
          </DropdownMenu.Item>
        ) : null}

        <DropdownMenu.Separator />

        <DropdownMenu.Item onClick={handleOnClick} asChild>
          <Text>Log Out</Text>
        </DropdownMenu.Item>

        {!currPath.isAboutPage && (
          <>
            <DropdownMenu.Separator />

            <DropdownMenu.Item asChild>
              <Link href="/about">About</Link>
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function LoggedOutMenu({ currPath }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button>U</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {currPath.isLoginPage !== true && (
          <DropdownMenu.Item asChild>
            <Link href="/login">Login</Link>
          </DropdownMenu.Item>
        )}
        {currPath.isSignUpPage !== true && (
          <DropdownMenu.Item asChild>
            <Link href="/signup">Sign Up</Link>
          </DropdownMenu.Item>
        )}
        {currPath.isHostingPage !== true && (
          <DropdownMenu.Item asChild>
            <Link href="/host">Start Hosting</Link>
          </DropdownMenu.Item>
        )}

        {currPath.isAboutPage !== true && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.Item asChild>
              <Link href="/about">About</Link>
            </DropdownMenu.Item>
          </>
        )}
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
