"use client";
import React from "react";

import ResponsiveContainer from "@/components/RespContainer";
import { Box, Button, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import CampCard from "@/components/CampCard";
import Footer from "../Footer";
import { montserrat } from "@/utils/fonts/font";
import DeleteCampground from "../DeleteCampground";
import Link from "../Link";

export default function UserCGIndex({ initialCampgrounds, name }) {
  const [campgrounds, setCampgrounds] = React.useState(initialCampgrounds);
  const [isPending, startTransition] = React.useTransition();
  const totalCampgrounds =
    campgrounds.length === 0 ? 0 : campgrounds[0]["total_campgrounds"];

  function loadCampgrounds() {
    startTransition(async () => {
      const prefetchedFetchedIDs = campgrounds.map(({ id }) => id);
      const newCampgrounds = await getCampgrounds(8, prefetchedFetchedIDs);
      const nextCampgrounds = [...campgrounds, ...newCampgrounds];
      setCampgrounds(nextCampgrounds);
    });
  }

  function updateState(id) {
    const nextCGs = campgrounds.filter((campground) => campground.id !== id);
    setCampgrounds(nextCGs);
  }

  return (
    <>
      <Box
        mx={"auto"}
        width={"fit-content"}
        pb={"9"}
        pt={"5"}
        data-name="wrapper-cg-indx"
      >
        <ResponsiveContainer pt={"7"}>
          {campgrounds.length === 0 && (
            <Flex
              align={"center"}
              justify={"center"}
              direction={"column"}
              gapY={"2"}
            >
              <Heading weight={"bold"} size={"7"}>
                {!!name
                  ? `Hey ${name}, looks like you haven't listed any campgrounds yet.`
                  : `Looks like you haven't listed any campgrounds yet.`}
              </Heading>
              <Text
                className={montserrat.className}
                style={{ fontWeight: "600" }}
                size={"5"}
                color="gray"
              >
                Start adding your campgrounds to share them with others!
              </Text>
            </Flex>
          )}
          <Grid
            columns={{ initial: "1", sm: "2", md: "3", lg: "4" }}
            gapY={"6"}
            gapX={{ xs: "1", sm: "7", md: "6" }}
            mb={"5"}
          >
            {campgrounds.length !== 0 &&
              campgrounds.map((campground) => {
                return (
                  <Box key={campground.id}>
                    <CampCard
                      avgOfReviews={campground["average_rating"]}
                      campdata={campground}
                      imgData={campground.images}
                    />
                    <Card mt={"2"}>
                      <Flex align={"center"} justify={"between"}>
                        <Link href={`/camp/${campground.id}/edit`}>
                          <Button size={"3"} variant="surface" color="jade">
                            Edit 🏕️
                          </Button>
                        </Link>
                        <DeleteCampground
                          name={campground.name}
                          id={campground.id}
                          updateState={updateState}
                        />
                      </Flex>
                    </Card>
                  </Box>
                );
              })}
          </Grid>
          {totalCampgrounds > campgrounds.length && (
            <Flex
              align={"center"}
              justify={"center"}
              direction={"column"}
              gapY={"5"}
            >
              <Heading>Continue exploring campgrounds</Heading>
              <Button
                size={"4"}
                highContrast
                onClick={() => loadCampgrounds()}
                loading={isPending}
              >
                Show More
              </Button>
            </Flex>
          )}
        </ResponsiveContainer>
      </Box>
      <Footer />
    </>
  );
}
