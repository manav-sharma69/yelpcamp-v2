import ResponsiveContainer from "@/components/RespContainer";
import { Box, Heading, Skeleton } from "@radix-ui/themes";

export default function RegisterFormFallback() {
  return (
    <ResponsiveContainer>
      <Box py={"6"} width={"40%"} mx={"auto"}>
        <Heading mb={"5"}>Log In</Heading>
        <Skeleton>
          <Box width={"500px"} height={"50vh"} />
        </Skeleton>
      </Box>
    </ResponsiveContainer>
  );
}
