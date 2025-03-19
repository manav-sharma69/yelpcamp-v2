import ResponsiveContainer from "../RespContainer";
import { Box, Flex } from "@radix-ui/themes";
import NavLinks from "./NavLinks";
import Link from "../Link";
import Logo from "../Logo";

export default async function Navbar() {
  return (
    <Box
      asChild
      style={{ zIndex: 1, background: "white" }}
      position={"sticky"}
      top={"0"}
      py={"2"}
    >
      <nav>
        <ResponsiveContainer>
          <Flex justify={"between"}>
            <Box>
              <Link href={"/"} color="gray">
                <Logo />
              </Link>
            </Box>

            <NavLinks />
          </Flex>
        </ResponsiveContainer>
      </nav>
    </Box>
  );
}
