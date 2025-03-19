import RegisterForm from "@/components/RegisterForm";
import ResponsiveContainer from "@/components/RespContainer";
import { Box, Heading } from "@radix-ui/themes";

export default function RegisterUser() {
  return (
    <>
      <ResponsiveContainer>
        <Box py={"6"} width={"40%"} mx={"auto"}>
          <Heading mb={"5"}>Sign Up</Heading>
          <RegisterForm />
        </Box>
      </ResponsiveContainer>
    </>
  );
}
