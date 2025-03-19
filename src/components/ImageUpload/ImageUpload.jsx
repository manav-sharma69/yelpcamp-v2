"use client";
import React from "react";
import useToggle from "@/utils/hooks/use-toggle";
import style from "./styles.module.css";

import { Button, Dialog, IconButton, ScrollArea } from "@radix-ui/themes";
import ImageInput from "../ImageInput";
import { Trash2 } from "lucide-react";
import Image from "next/image";

export default function ImageUpload({ uploadHandler, disabled }) {
  const [dialogOpen, toggle] = useToggle(false);
  const [images, setImages] = React.useState([]);
  const [isPending, startTransition] = React.useTransition();

  function handleDialogClose(id) {
    if (id === "cancel") {
      toggle();
      setImages([]);
    }
    if (id === "upload") {
      startTransition(async () => {
        const imgFiles = images.map(({ image, id }) => image);
        const status = await uploadHandler(imgFiles);
        if (status) {
          toggle();
          setImages([]);
        }
      });
    }
  }

  function handleDrop(ev) {
    ev.preventDefault();
    const imageArr = [];

    if (ev.dataTransfer.items) {
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          const imgId = crypto.randomUUID();
          const imageData = {
            image: file,
            id: imgId,
          };
          imageArr.push(imageData);
          setImages(imageArr);
        }
      });
    } else {
      [...ev.dataTransfer.files].forEach((file, i) => {
        const imgId = crypto.randomUUID();
        const imageData = {
          image: file,
          id: imgId,
        };
        imageArr.push(imageData);
        setImages(imageArr);
      });
    }
  }

  function handleChange(e) {
    const imagesArr = [];
    for (let img of e.target.files) {
      const imgId = crypto.randomUUID();
      const imageData = {
        image: img,
        id: imgId,
      };
      imagesArr.push(imageData);
    }
    setImages(imagesArr);
  }

  function deleteSelectedImage(id, url) {
    URL.revokeObjectURL(url);
    const nextImages = images.filter((img) => img.id !== id);
    setImages(nextImages);
  }

  return (
    <div className={style["dialog-wrapper"]}>
      <Dialog.Root open={dialogOpen}>
        <Dialog.Trigger onClick={toggle} disabled={disabled}>
          <Button>Upload Images</Button>
        </Dialog.Trigger>

        <Dialog.Content className={style["dialog-content-wrapper"]}>
          {/* HEADING */}
          <div className={style["dialog-heading"]}>
            <Dialog.Title
              align={"center"}
              m={"0"}
              className={style["dialog-title"]}
            >
              Upload Images
            </Dialog.Title>
            <Dialog.Description
              align={"center"}
              size="2"
              mb="4"
              className={style["dialog-description"]}
            >
              You can add more photos later
            </Dialog.Description>
          </div>

          {/* content */}
          <div className={style["dialog-content"]}>
            {images.length === 0 ? (
              <ImageInput onChange={handleChange} onDrop={handleDrop} />
            ) : (
              <SelectedImagesGrid
                images={images}
                onDeleteImage={deleteSelectedImage}
              />
            )}
          </div>

          <div className={style["dialog-close-wrapper"]}>
            <Dialog.Close onClick={(e) => handleDialogClose("cancel")}>
              <Button
                disabled={isPending}
                type="button"
                variant="soft"
                color="gray"
                size={"3"}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close onClick={(e) => handleDialogClose("upload")}>
              <Button
                loading={isPending}
                variant="classic"
                type="button"
                highContrast
                color="gray"
                size={"3"}
              >
                Upload
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

function SelectedImagesGrid({ images, onDeleteImage }) {
  return (
    <div className={style["selected-image-grid-wrapper"]}>
      <ScrollArea
        className={style["scroll-area"]}
        type="hover"
        scrollbars="vertical"
      >
        <div className={style["selected-image-grid"]}>
          {images.map(({ image, id }) => {
            const src = URL.createObjectURL(image);
            return (
              <div key={id} className={style["selected-image-grid-item"]}>
                <IconButton
                  color="gray"
                  variant="surface"
                  size={"1"}
                  className={style["image-delete-btn"]}
                  onClick={() => onDeleteImage(id, src)}
                >
                  <Trash2 strokeWidth={"1.25px"} size={18} />
                </IconButton>
                <Image
                  alt="img"
                  src={src}
                  fill={true}
                  className={style["selected-image"]}
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
