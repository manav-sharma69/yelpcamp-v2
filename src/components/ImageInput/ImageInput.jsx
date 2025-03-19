import { Button, Flex, Text, VisuallyHidden } from "@radix-ui/themes";
import { useRef } from "react";
import style from "./styles.module.css";
import { ImageUp } from "lucide-react";

export default function ImageInput({ onChange, onDrop }) {
  const inputRef = useRef(null);

  function handleDragOver(ev) {
    ev.preventDefault();
  }

  return (
    <div className={style["image-input-wrapper"]}>
      <VisuallyHidden>
        <input type="file" multiple ref={inputRef} onChange={onChange} />
      </VisuallyHidden>
      <div
        className={style["image-input-box"]}
        onDrop={onDrop}
        onDragOver={handleDragOver}
      >
        <ImageUp size={"120"} strokeWidth={"0.5px"} />
        <Flex direction={"column"} justify={"center"} align={"center"}>
          <Text
            weight={"medium"}
            size={"6"}
            className={style["drag-n-drop-heading"]}
          >
            Drag and drop
          </Text>
          <Text
            weight={"medium"}
            color="gray"
            className={style["drag-n-drop-text"]}
          >
            or browse for photos
          </Text>
        </Flex>
        <Button
          color="gray"
          className={style["photo-file-input-button"]}
          size={"3"}
          type="button"
          highContrast
          onClick={() => inputRef.current.click()}
        >
          Browse
        </Button>
      </div>
    </div>
  );
}
