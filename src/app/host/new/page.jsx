import { createCampground } from "@/utils/actions/campgroundsCrud";
import CGDetailsForm from "@/components/CGDetailsForm";
import ResponsiveContainer from "@/components/RespContainer";
import { Box, Flex, Heading } from "@radix-ui/themes";
import { auth } from "@/utils/auth/auth";

export default async function NewCampground() {
  const session = await auth();

  return (
    <>
      <ResponsiveContainer width={{ md: "60%", lg: "50%" }}>
        <Box asChild mt={"9"} mb={"8"}>
          <Heading align={"center"} size={"9"} weight={"regular"}>
            Add Campground
          </Heading>
        </Box>
        <Flex
          align={"center"}
          justify={"center"}
          direction={"column"}
          width={"50%"}
          mx={"auto"}
        >
          <CGDetailsForm
            submitAction={createCampground}
            author={session?.user?.id}
          />
        </Flex>
      </ResponsiveContainer>
    </>
  );
}
