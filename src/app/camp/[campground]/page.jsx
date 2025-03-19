// CG Show
import React from "react";
import { getContactInfoByCampgroundID } from "@/utils/actions/contact-info-crud";
import { getImagesByCampgroundID } from "@/utils/actions/imagesCrud";
import { getCampgroundById } from "@/utils/actions/campgroundsCrud";
import { fetchAddress } from "@/utils/maptiler/fetch-address";
import { getUserByID } from "@/utils/actions/usersCrud";
import { isAuthorized } from "@/utils/auth/helpers";
import { montserrat } from "@/utils/fonts/font";
import { notFound } from "next/navigation";
import styles from "./styles.module.css";
import { auth } from "@/utils/auth/auth";

import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Table,
  Text,
} from "@radix-ui/themes";
import ReviewsSummary from "@/components/Reviews/ReviewsSummary";
import ResponsiveContainer from "@/components/RespContainer";
import ReviewsProvider from "@/components/ReviewsProvider";
import ShowPageImgUI from "@/components/ShowPageImgUI";
import ShowPageMap from "@/components/ShowPageMap";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import Link from "@/components/Link";
import { X } from "lucide-react";

export default async function CampgroundPage({ params }) {
  const session = await auth();
  const userDataForReviewsProvider = {
    userID: session?.user?.id,
    name: session?.user?.name,
  };
  const { campground: id } = await params;
  const campgroundData = await getCampgroundById(id);
  if (campgroundData?.id === undefined) notFound();

  const {
    name,
    author,
    price,
    lat_long: latlong,
    description,
  } = campgroundData;
  const location = await fetchAddress(latlong[0], latlong[1]);

  const user = await getUserByID(author);
  const hasAuthority = await isAuthorized(author); // used to show edit and delete campground buttons

  const imgData = await getImagesByCampgroundID(id);
  const contactData = await getContactInfoByCampgroundID(id);

  return (
    <>
      {/* Name */}
      <ResponsiveContainer className={styles["heading"]}>
        <Box my={"3"} asChild>
          <Heading size={"8"}>{name}</Heading>
        </Box>
      </ResponsiveContainer>

      <ShowPageImgUI imgData={imgData} />

      <ResponsiveContainer>
        <div className={styles["grid"]}>
          <ContactAndPrice price={price} contactData={contactData} />
          <ReviewsProvider
            campgroundID={id}
            isLoggedIn={!!session}
            userData={userDataForReviewsProvider}
          >
            <LocationAndReviews location={location} />
            <ListedBy author={user?.name} />
            <Description description={description} />
            <ReviewsWrapper campgroundName={name} />
          </ReviewsProvider>
          <Map location={location} name={name} latlong={latlong} />
        </div>
      </ResponsiveContainer>
      <Footer />
    </>
  );
}

function ContactAndPrice({ price, contactData }) {
  const {
    contacts,
    reservation_url,
    reservation_info,
    regulations_overview,
    regulations_url,
  } = contactData;
  const phoneNumbers = contacts.phoneNumbers;
  const emailAddresses = contacts.emailAddresses;
  return (
    <div className={styles["grid-item-zero"]}>
      <Card className={styles["grid-item-zero-card"]} mx={"auto"}>
        <Flex direction={"column"} gap={"3"} width={"100%"}>
          <Text weight={"medium"} size={"6"} color="gray" highContrast>
            ${price} night
          </Text>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button size={"4"} highContrast variant="solid">
                Reserve
              </Button>
            </Dialog.Trigger>
            <Dialog.Content size={{ initial: "1", xs: "2", sm: "3" }}>
              <Flex
                width={"100%"}
                align={"center"}
                justify={"between"}
                mb={{ initial: "2", sm: "5" }}
              >
                <Dialog.Title>Contact Details</Dialog.Title>
                <Dialog.Close>
                  <IconButton
                    color="gray"
                    highContrast
                    variant="ghost"
                    size={"1"}
                  >
                    <X strokeWidth={"2px"} size={"16px"} />
                  </IconButton>
                </Dialog.Close>
              </Flex>

              <Dialog.Description>
                Contact Author Or Reserve Campground Online
              </Dialog.Description>
              <Flex direction={"column"} gapY={"5"} mt={"3"}>
                <Flex
                  gap={"4"}
                  align={{ xs: "center" }}
                  justify={"center"}
                  direction={{ initial: "column", xs: "row" }}
                  width={"fit-content"}
                  mr={"auto"}
                >
                  {phoneNumbers.length > 0 && (
                    <Table.Root variant="surface">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>
                            Phone Numbers
                          </Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {phoneNumbers.map((num, i) => (
                          <Table.Row key={i}>
                            <Table.Cell>{num}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  )}
                  {emailAddresses.length > 0 && (
                    <Table.Root variant="surface">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>
                            Email Addresses
                          </Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {emailAddresses.map((email, i) => (
                          <Table.Row key={i}>
                            <Table.Cell>{email}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  )}
                </Flex>
                {(reservation_info || reservation_url) && (
                  <Card>
                    <Flex
                      align={{ initial: "start", sm: "center" }}
                      justify={"between"}
                      direction={{ initial: "column", sm: "row" }}
                      mb={{ initial: "2", sm: "1" }}
                    >
                      <Heading as="h3">Reservation</Heading>
                      {reservation_url && (
                        <Link href={reservation_url}>Reserve Here</Link>
                      )}
                    </Flex>
                    {reservation_info && <Text>{reservation_info}</Text>}
                  </Card>
                )}
                {(regulations_overview || regulations_url) && (
                  <Card>
                    <Flex
                      align={{ initial: "start", sm: "center" }}
                      justify={"between"}
                      direction={{ initial: "column", sm: "row" }}
                      mb={{ initial: "2", sm: "1" }}
                    >
                      <Heading as="h3">Regulations</Heading>
                      {regulations_url && (
                        <Link href={regulations_url}>View Regulations</Link>
                      )}
                    </Flex>
                    {regulations_overview && (
                      <Text>{regulations_overview}</Text>
                    )}
                  </Card>
                )}
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Card>
    </div>
  );
}

function LocationAndReviews({ location }) {
  return (
    <>
      <div className={styles["grid-item-one"]}>
        <Heading style={{ fontWeight: "600" }} size={"5"} as="h2">
          Campground in{" "}
          {location === "" ? (
            <Skeleton loading>network error</Skeleton>
          ) : (
            location
          )}
        </Heading>
      </div>
      <ReviewsSummary variant="tiny" />
    </>
  );
}

function ListedBy({ author }) {
  return (
    <>
      <div className={styles["grid-item-three"]}>
        <Avatar
          radius="full"
          src="https://avatar.iran.liara.run/public"
          fallback={"U"}
          color="iris"
        />{" "}
        Listed by {author}
      </div>
    </>
  );
}

function Description({ description }) {
  return (
    <Text
      as="p"
      className={`${styles["grid-item-four"]} ${montserrat.className}`}
      weight={"regular"}
    >
      {description}
    </Text>
  );
}

function ReviewsWrapper({ campgroundName }) {
  return <Reviews campgroundName={campgroundName} />;
}

function Map({ location, name, latlong }) {
  return (
    <div className={styles["grid-item-seven"]}>
      <ShowPageMap latlong={latlong} title={name} location={location} />
    </div>
  );
}
