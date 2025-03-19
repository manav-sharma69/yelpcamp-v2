import { createRouteHandler } from "uploadthing/next";
import { uploadThingRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: uploadThingRouter,
});