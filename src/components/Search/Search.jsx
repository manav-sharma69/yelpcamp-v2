import React from "react";

import { Box, TextField } from "@radix-ui/themes";
import { Search as SearchIcon } from "lucide-react";

export default function Search({ searchTerm, setSearchTerm }) {
  return (
    <Box
      width={{ md: "50%", lg: "40%", initial: "90%" }}
      maxWidth={{ initial: "420px", sm: "78%", md: "none" }}
      mx={"auto"}
      py={"1"}
      mt={{ initial: "3" }}
    >
      <TextField.Root
        radius="full"
        size={"3"}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        placeholder="Search Campgrounds"
      >
        <TextField.Slot px={"3"}>
          <SearchIcon size={"16px"} />
        </TextField.Slot>
      </TextField.Root>
    </Box>
  );
}
