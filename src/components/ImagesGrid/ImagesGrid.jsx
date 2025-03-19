"use client";
import React from "react";
import style from "./styles.module.css";

import Image from "next/image";
import {
  Box,
  Callout,
  Card,
  Heading,
  RadioCards,
  Text,
} from "@radix-ui/themes";
import { Info } from "lucide-react";

export default function ImagesGrid({ imgs }) {
  if (imgs?.length === 0) {
    return (
      <Box width={"100%"} my={"5"}>
        <Callout.Root color="indigo" size={"1"}>
          <Callout.Icon>
            <Info />
          </Callout.Icon>
          <Callout.Text weight={"bold"}>
            You have not uploaded any photos yet.
          </Callout.Text>
        </Callout.Root>
        <input type="hidden" name="totalOldImages" value={JSON.stringify([])} />
      </Box>
    );
  }

  const keys = imgs.map(({ url }) => url.split("/").pop());
  return (
    <>
      <Heading
        as="h2"
        weight={"light"}
        color="gray"
        align={"center"}
        mt={"3"}
        mb={"5"}
      >
        Manage Your Photos
      </Heading>
      <Box asChild width={"fit-content"} mx={"auto"} mb={"8"}>
        <Card style={{ backgroundColor: "rgb(215, 215, 215)" }}>
          <Box pb={"1"}>
            <Text>Select images to delete</Text>
          </Box>
          <div className={style["grid"]}>
            {imgs.map(({ credit, alt_text: alt, url }, i) => {
              const [checked, setChecked] = React.useState(false);

              return (
                <RadioCards.Root
                  key={url}
                  variant="classic"
                  loop
                  name={`imagesToDelete-${i}`}
                >
                  <RadioCards.Item
                    value={url.split("/").pop()}
                    checked={checked}
                    onClick={() => setChecked(!checked)}
                  >
                    <div className={style["image-wrapper"]}>
                      <Image
                        fill={true}
                        src={url}
                        data-key={url.split("/").pop()}
                        alt={alt ?? ""}
                        className={style["image"]}
                        sizes="(min-width: 480px) 40vw, 85vw"
                      />
                    </div>
                  </RadioCards.Item>
                </RadioCards.Root>
              );
            })}
          </div>
        </Card>
      </Box>
      <input type="hidden" name="totalOldImages" value={JSON.stringify(keys)} />
    </>
  );
}
