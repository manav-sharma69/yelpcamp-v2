"use client";
import React from "react";
import { uploadFiles } from "@/utils/uploadthing/helpers";
import { SessionContext } from "../SessionProvider";
import { ToastContext } from "../ToastProvider";

import ImageUpload from "../ImageUpload";

export default function Photos() {
  const { createToast } = React.useContext(ToastContext);
  const { disableCTA } = React.useContext(SessionContext);
  const [keys, setKeys] = React.useState([]);
  const [uploadComplete, setUploadComplete] = React.useState(false);

  async function handleImageUpload(images) {
    if (disableCTA) {
      createToast("Unauthenticated Request", "error");
      return false;
    }
    if (images.length === 0) {
      createToast("No photos selected ☹️", "error");
      return false;
    }
    const res = await uploadFiles("campgroundImages", {
      files: images,
    });
    setKeys(res.map((data) => data.key));
    setUploadComplete(true);
    return true;
  }

  React.useEffect(() => {
    if (uploadComplete) {
      const msg =
        "Upload complete! Add more photos anytime by editing your campground.";
      createToast(msg, "success");
    }
  }, [uploadComplete]);

  return (
    <>
      {uploadComplete && (
        <input type="hidden" name="keys" value={JSON.stringify(keys)} />
        // <input type="hidden" name="keys" value={JSON.stringify(keys)} />
      )}
      <ImageUpload
        disabled={uploadComplete}
        uploadHandler={handleImageUpload}
      />
    </>
  );
}
