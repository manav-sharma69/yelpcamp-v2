// EDIT CAMPGROUND
import { getCampgroundById } from "@/utils/actions/campgroundsCrud";
import { updateCampground } from "@/utils/actions/campgroundsCrud";
import { isAuthorized, isLoggedIn } from "@/utils/auth/helpers";

import { Box, Flex, Heading } from "@radix-ui/themes";
import ResponsiveContainer from "@/components/RespContainer";
import CGDetailsForm from "@/components/CGDetailsForm";
import Unauthenticated from "@/components/Unauthenticated";
import { getImagesByCampgroundID } from "@/utils/actions/imagesCrud";

export default async function EditCampground({ params }) {
  // in case session expires
  if (!(await isLoggedIn())) return <Unauthenticated />;

  const { campground: id } = await params;
  const { name, author, location, price, description } =
    await getCampgroundById(id);

  if (!(await isAuthorized(author))) return <Unauthorized campground={name} />;

  const imgs = await getImagesByCampgroundID(id);

  return (
    <>
      <ResponsiveContainer width={{ md: "60%", lg: "50%" }}>
        <Box asChild mt={"9"} mb={"8"}>
          <Heading align={"center"} size={"9"} weight={"regular"}>
            Edit Campground
          </Heading>
        </Box>
        <Flex
          align={"center"}
          justify={"center"}
          direction={"column"}
          // width={"50%"}
          mx={"auto"}
        >
          <CGDetailsForm
            submitAction={updateCampground}
            id={id}
            name={name}
            author={author}
            location={location}
            price={price}
            description={description}
            buttonLabel="Save changes"
            imgs={imgs}
          />
        </Flex>
      </ResponsiveContainer>
    </>
  );
}

function Unauthorized({ campground }) {
  return (
    <ResponsiveContainer
      width={{ md: "60%", lg: "50%" }}
      style={{ justifyContent: "center" }}
    >
      <Flex
        direction={"column"}
        align={"center"}
        justify={"center"}
        height={"100%"}
      >
        <Heading align={"center"} size={"8"} weight={"regular"} mb={"5"}>
          It looks like you do not own {campground}.
        </Heading>
        <Heading align={"center"} size={"8"} weight={"regular"}>
          Please go back.
        </Heading>
      </Flex>
    </ResponsiveContainer>
  );
}

export async function generateMetadata({ params }) {
  const { campground: id } = await params;
  const campground = await getCampgroundById(id);

  return {
    title: `Edit ${campground.name}`,
  };
}
