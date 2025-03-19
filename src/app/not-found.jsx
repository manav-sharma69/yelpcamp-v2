// does not accept any params: https://nextjs.org/docs/app/api-reference/file-conventions/not-found
// But also look at the Examples -> Data Fetching

import Image from "next/image";
import notFoundGIF from "../../public/404/cat404.gif";

export default async function PageNotFoundGlobal() {
  return (
    <>
      <div
        style={{
          height: "calc(100vh - 64px)",
          display: "grid",
          placeItems: "center",
          touchAction: "none",
        }}
      >
        <Image src={notFoundGIF} alt="Page not found" />
      </div>
    </>
  );
}
