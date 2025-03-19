import CGFormSkeleton from "@/components/CGDetailsForm/CGFormSkeleton";
import ResponsiveContainer from "@/components/RespContainer";
import { Box, Flex, Heading } from "@radix-ui/themes";

export default function CreateCampgroundPlaceholder() {
  return (
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
        mx={"auto"}
      >
        <CGFormSkeleton isEditForm={true} />
      </Flex>
    </ResponsiveContainer>
  );
}
