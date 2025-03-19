import { TriangleAlert, CircleCheckBig, OctagonX, Info } from "lucide-react";
import { IconButton, Popover, Text } from "@radix-ui/themes";
import React from "react";

const COSMETICS_BY_VARIANT = {
  notice: {
    icon: Info,
    color: "gray",
  },
  warning: {
    icon: TriangleAlert,
    color: "yellow",
  },
  success: {
    icon: CircleCheckBig,
    color: "teal",
  },
  error: {
    icon: OctagonX,
    color: "red",
  },
};

export default function HelperCard({ message, variant = "notice" }) {
  const Icon = COSMETICS_BY_VARIANT[variant]["icon"];
  const color = COSMETICS_BY_VARIANT[variant]["color"];
  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton mx={"2"} size={"1"} variant="ghost" highContrast>
          <Icon size={14} color={color} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content maxWidth={"250px"} width={"fit-content"}>
        <Text as="p" size={"2"}>
          {message}
        </Text>
      </Popover.Content>
    </Popover.Root>
  );
}
