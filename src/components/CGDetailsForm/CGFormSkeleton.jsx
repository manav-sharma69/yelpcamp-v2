import { Box, Flex, Grid, Skeleton } from "@radix-ui/themes";

export default function CGFormSkeleton({ isEditForm }) {
  return (
    <>
      <Flex
        direction={"column"}
        align={"center"}
        justify={"center"}
        gapY={"4"}
        width={"100%"}
        pb={"8"}
      >
        {/* name */}
        <Skeleton>
          <Box height={"80px"} width={"100%"} />
        </Skeleton>

        {isEditForm && <ImagesGrid />}

        {/* photos */}
        <Skeleton style={{ alignSelf: "start" }}>
          <Box height={"50px"} width={"30%"} />
        </Skeleton>

        {/* price */}
        <Skeleton>
          <Box height={"80px"} width={"100%"} />
        </Skeleton>
      </Flex>
    </>
  );
}

function ImagesGrid() {
  return (
    <Grid columns={{ initial: "1", sm: "2" }} width={"80%"} height={"50vh"}>
      {new Array(8).fill(0).map((ele, idx) => (
        <Skeleton key={idx}>
          <Box height={"400"} width={"400"} />
        </Skeleton>
      ))}
    </Grid>
  );
}
