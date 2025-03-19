import React from "react";
import styles from "./styles.module.css";

import {
  Button,
  Dialog,
  Flex,
  IconButton,
  ScrollArea,
  Skeleton,
  VisuallyHidden,
} from "@radix-ui/themes";
import Image from "next/image";
import { List, X } from "lucide-react";

export default function ShowPageImgUI({ imgData }) {
  return (
    <>
      <Grid imgData={imgData} />
      <Carousel imgData={imgData} />
    </>
  );
}

function Grid({ imgData }) {
  const imgDataForGrid = imgData.slice(0, 5);
  return (
    <div className={styles["grid-wrapper"]}>
      {imgDataForGrid.map(
        ({ id, credit, alt_text: alt, thumbnail_url: url }) => (
          <div className={`${styles["grid-item"]}`} key={id}>
            <Skeleton>
              <Image
                src={url}
                alt={!!alt ? `${alt} - ${credit}` : ""}
                fill
                sizes="(min-width: 480px) 40vw, 85vw"
                className={styles["grid-img"]}
              />
            </Skeleton>
          </div>
        )
      )}
      {imgData.length > 5 && <ShowAllImagesDialog imgData={imgData} />}
    </div>
  );
}

function ShowAllImagesDialog({ imgData }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={styles["imgs-list-trigger"]}>
        <Button color="gray" highContrast size={"3"}>
          <Flex align={"center"} gap={"2"}>
            <p>Show All</p>
            <List strokeWidth={"2px"} size={"18px"} />
          </Flex>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Flex align={"center"} justify={"between"} gap={"5"}>
          <Dialog.Title>All Images</Dialog.Title>
          <Dialog.Close>
            <IconButton color="gray" highContrast variant="ghost" size={"1"}>
              <X strokeWidth={"2px"} size={"16px"} />
            </IconButton>
          </Dialog.Close>
        </Flex>
        <VisuallyHidden>
          <Dialog.Description>
            A list of all images of this campground
          </Dialog.Description>
        </VisuallyHidden>
        <ScrollArea
          type="always"
          scrollbars="vertical"
          style={{ height: "80vh" }}
          mt={"16px"}
        >
          {imgData.map(({ id, credit, alt_text: alt, thumbnail_url: url }) => (
            <div className={`${styles["imgs-list-wrapper"]}`} key={id}>
              <Skeleton>
                <Image
                  src={url}
                  alt={!!alt ? `${alt} - ${credit}` : ""}
                  fill
                  sizes="(min-width: 480px) 40vw, 85vw"
                  className={styles["grid-img"]}
                />
              </Skeleton>
            </div>
          ))}
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function Carousel({ imgData }) {
  return (
    <div className={styles["carousel"]}>
      {imgData.map(({ id, credit, alt_text: alt, thumbnail_url: url }) => (
        <div className={styles["carousel-img-wrapper"]} key={id}>
          <Skeleton>
            <Image
              src={url}
              alt={!!alt ? `${alt} - ${credit}` : ""}
              fill
              sizes="(min-width: 480px) 40vw, 85vw"
              className={styles["carousel-image"]}
            />
          </Skeleton>
        </div>
      ))}
    </div>
  );
}
