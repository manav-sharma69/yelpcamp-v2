import LoginForm from "@/components/LoginForm";
import ResponsiveContainer from "@/components/RespContainer";
import { Box, Heading } from "@radix-ui/themes";

export default function LoginPage(){
  return (
    <>
      <ResponsiveContainer>
        <Box py={'6'} width={'40%'} mx={'auto'}>
          <Heading mb={'5'}>Log In</Heading>
          <LoginForm />
        </Box>
      </ResponsiveContainer>
    </>
  );
}