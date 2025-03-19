import { redactedScipt } from "@/utils/fonts/font";
import styles from "@/components/ShowPageImgUI/styles.module.css";
import style from "./styles.module.css";

import ResponsiveContainer from "@/components/RespContainer";
import { Box, Heading, Skeleton } from "@radix-ui/themes";

export default async function CampgroundPageFallback() {
  const name = "Placeholder name";
  return (
    <>
      <ResponsiveContainer
        className={style["heading"]}
        style={{ flexGrow: 0, marginBlockEnd: "8vh" }}
      >
        <Box>
          <Heading className={` ${redactedScipt.className}`} size={"8"}>
            {name}
          </Heading>
        </Box>
      </ResponsiveContainer>

      <PlaceholderImageUI />
    </>
  );
}

function PlaceholderImageUI() {
  return (
    <>
      <Grid />
      <Carousel />
    </>
  );
}

function Grid() {
  return (
    <div className={styles["grid-wrapper"]}>
      {new Array(5).fill(0).map((ele, i) => (
        <Skeleton key={i}>
          <div className={`${styles["grid-item"]}`}>
            <div className={styles["grid-img"]} />
          </div>
        </Skeleton>
      ))}
    </div>
  );
}

function Carousel() {
  return (
    <div className={styles["carousel"]}>
      <Skeleton>
        <div className={styles["carousel-img-wrapper"]}>
          <div className={styles["carousel-image"]} />
        </div>
      </Skeleton>
    </div>
  );
}
