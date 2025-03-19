import { Callout } from "@radix-ui/themes";
import { CircleX } from "lucide-react";

export default function AuthError({ message }) {
  return (
    <>
      <Callout.Root color="red" size={"1"} mb={"3"}>
        <Callout.Icon>
          <CircleX />
        </Callout.Icon>
        <Callout.Text>{message}</Callout.Text>
      </Callout.Root>
    </>
  );
}
