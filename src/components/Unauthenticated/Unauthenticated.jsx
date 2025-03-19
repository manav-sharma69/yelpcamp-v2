import { Flex, Heading } from "@radix-ui/themes";
import ResponsiveContainer from "../RespContainer";
import Link from "@/components/Link";

export default function Unauthenticated() {
  return (
    <ResponsiveContainer
      width={{ md: "60%", lg: "50%" }}
      style={{ justifyContent: "center" }}
    >
      <Flex
        direction={"column"}
        align={"center"}
        justify={"center"}
        height={"100%"}
      >
        <Heading align={"center"} size={"8"} weight={"regular"}>
          Please{" "}
          <Link href="/login" color="iris">
            Log In
          </Link>{" "}
          to access this page.
        </Heading>
      </Flex>
    </ResponsiveContainer>
  );
}
