import React from "react";

export default function useToggle(initialStatus = false) {
  const [status, setStatus] = React.useState(initialStatus);

  function toggle() {
    setStatus(!status);
  }

  return [status, toggle];
}