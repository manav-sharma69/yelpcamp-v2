import { Container } from "@radix-ui/themes";

export default function ResponsiveContainer({ children, ...delegated }) {
  return (
    <Container
      {...delegated}
      size={{ lg: "4", md: "3", sm: "2", initial: "1" }}
      px={{ initial: "4", xs: "1" }}
    >
      {children}
    </Container>
  );
}
