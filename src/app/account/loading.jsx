import ResponsiveContainer from "@/components/RespContainer";
import { Card, Skeleton } from "@radix-ui/themes";

export default async function UserProfilePlaceholder() {
  return (
    <ResponsiveContainer
      width={{ md: "50%" }}
      maxWidth={{ xs: "500px", md: "none" }}
    >
      <Skeleton>
        <Card mb={"3"} style={{ height: "100px" }} />
      </Skeleton>
      <Skeleton>
        <Card mb={"3"} style={{ height: "50vh" }} />
      </Skeleton>
      <Skeleton>
        <Card mb={"3"} style={{ height: "100px" }} />
      </Skeleton>
      {/* <Card mb={"3"} style={{height: '70vh'}} />
      <Card mb={"3"} style={{height: '200px'}} /> */}
    </ResponsiveContainer>
  );
}
