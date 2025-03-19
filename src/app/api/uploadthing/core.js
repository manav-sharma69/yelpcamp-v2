import { createUploadthing } from "uploadthing/next";
// import { UploadThingError } from 'uploadthing/server';

const uploadThing = createUploadthing();

export const uploadThingRouter = {
  campgroundImages: uploadThing({
    image: { minFileCount: '1', maxFileCount: '200', maxFileSize: "100MB" }
  })
    .onUploadComplete(async (params) => {
      const { metadata, file } = params;
      console.log('Upload complete.');
      return { success: true };
    })
} 