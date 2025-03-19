import React, { Suspense } from "react";

import { Box, Card, Flex, Inset, Spinner, Text } from "@radix-ui/themes";
import ImageCarousel from "../ImageCarousel";
import Link from "../Link";

export default function CampCard({
  campdata,
  avgOfReviews: avg = <Spinner />,
  imgData,
}) {
  const { id, name, location, price } = campdata;

  return (
    <Box
      mx={"auto"}
      maxWidth={{ initial: "320px", xs: "400px", sm: "380px", md: "298px" }}
      width={"100%"}
    >
      <Suspense fallback={<p>Loading camp card... -Suspense Campcard.jsx</p>}>
        <Card asChild size={"2"}>
          <Link href={`/camp/${id}`} underline="none">
            <Flex gapY={"7"} direction={"column"}>
              <Inset clip="padding-box" side="top">
                <ImageCarousel data={imgData} />
              </Inset>
              <Flex direction={"column"} gapY={"1"}>
                <Text as="p">{location}</Text>
                <Text as="p" size={"4"}>
                  {name}
                </Text>
                <Flex direction={"row"} align={"center"} justify={"between"}>
                  <Text as="p">${price} per night</Text>
                  {avg == 0 ? (
                    <Text as="p">No Reviews</Text>
                  ) : React.isValidElement(avg) ? (
                    avg
                  ) : (
                    <Flex align={"center"} gapX={"2"}>
                      <Box>
                        <Text size={"3"}>&#9733;</Text>
                      </Box>
                      <Box>
                        <Text size={"2"}>{avg}</Text>
                      </Box>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Link>
        </Card>
      </Suspense>
    </Box>
  );
}
