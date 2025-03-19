import LoginForm from "@/components/LoginForm";
import ResponsiveContainer from "@/components/RespContainer";
import { Box, Card, Heading } from "@radix-ui/themes";

export default function LoginPage() {
  return (
    <>
      <ResponsiveContainer style={{ placeItems: "center", display: "grid" }}>
        <Box asChild py={"6"} px={"5"} width={"350px"} mx={"auto"}>
          <Card variant="classic">
            <Heading mb={"5"}>Log In</Heading>
            <LoginForm />
          </Card>
        </Box>
      </ResponsiveContainer>
    </>
  );
}
