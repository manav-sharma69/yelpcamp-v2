"use client";
import React from "react";
import useToggle from "@/utils/hooks/use-toggle";
import style from "./styles.module.css";

import { Button } from "@radix-ui/themes";
import { List, Map } from "lucide-react";

export default function ViewToggle({ children }) {
  const [isMapHidden, toggle] = useToggle(true);
  const [isShown, setIsShown] = React.useState(true);
  const CGIndex = React.cloneElement(children[0], {
    style: { display: isMapHidden ? "block" : "none" },
    setIsShown,
  });
  const HomePageMap = React.cloneElement(children[1], {
    style: { display: isMapHidden ? "none" : "block" },
  });
  return (
    <>
      <Button
        style={{ display: !isShown && "none" }}
        highContrast
        color="gray"
        radius="full"
        size={"4"}
        onClick={toggle}
        className={style["toggle-button"]}
      >
        {isMapHidden ? "Show Map" : "Show List"}
        {isMapHidden ? <Map /> : <List />}
      </Button>
      {CGIndex}
      {HomePageMap}
    </>
  );
}
