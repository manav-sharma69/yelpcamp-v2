"use client";
export default function GlobalError() {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h1>Something went wrong!</h1>
      </body>
    </html>
  );
}
