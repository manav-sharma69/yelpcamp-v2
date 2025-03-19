import ResponsiveContainer from "@/components/RespContainer";
import { redactedScipt } from "@/utils/fonts/font";
import { Box, Card, Flex, Grid, Inset, Skeleton, Text } from "@radix-ui/themes";

const TEMP_SLIDES = new Array(12).fill(1);

const loadingCampdata = {
  name: "Campground Name",
  location: "State, Country",
  price: "15",
  id: "loading-campground-id",
};

export default async function HomePageFallback() {
  return (
    <>
      <CGIndexSkeleton />
    </>
  );
}

function CGIndexSkeleton() {
  return (
    <Box
      mx={"auto"}
      width={"fit-content"}
      pb={"9"}
      pt={"5"}
      data-name="wrapper-cg-indx"
    >
      <ResponsiveContainer pt={"7"} pb={"9"}>
        <Grid
          columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
          gapY={"6"}
          gapX={{ xs: "1", sm: "7", md: "6" }}
        >
          {TEMP_SLIDES.map((slide, i) => {
            return (
              <Box
                mx={"auto"}
                maxWidth={{
                  initial: "320px",
                  xs: "400px",
                  sm: "380px",
                  md: "298px",
                }}
                width={"100%"}
                key={i}
              >
                <Card asChild size={"2"}>
                  <Flex gapY={"7"} direction={"column"}>
                    <Skeleton loading={true}>
                      <Inset clip="padding-box" side="top">
                        <Box height={"280px"} width={"500px"} />
                      </Inset>
                    </Skeleton>
                    <Flex direction={"column"} gapY={"1"}>
                      <Text as="p" className={redactedScipt.className}>
                        {loadingCampdata.location}
                      </Text>
                      <Text
                        as="p"
                        size={"4"}
                        className={redactedScipt.className}
                      >
                        {loadingCampdata.name}
                      </Text>
                      <Flex
                        direction={"row"}
                        align={"center"}
                        justify={"between"}
                      >
                        <Text as="p" className={redactedScipt.className}>
                          ${loadingCampdata.price} per night
                        </Text>
                        <Text as="p" className={redactedScipt.className}>
                          5
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              </Box>
            );
          })}
        </Grid>
      </ResponsiveContainer>
    </Box>
  );
}
