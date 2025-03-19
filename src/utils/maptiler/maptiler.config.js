import * as maptilersdkNoConfig from "@maptiler/sdk";

maptilersdkNoConfig.config.apiKey = process.env.MAPTILER_KEY;
export const maptilersdk = maptilersdkNoConfig;