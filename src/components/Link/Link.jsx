import React from "react";
import { default as NextLink } from "next/link";
import { Link as RadixLink } from "@radix-ui/themes";

const Link = React.forwardRef(function (props, ref) {
  return (
    <RadixLink color={props?.color} asChild>
      <NextLink {...props} ref={ref} />
    </RadixLink>
  );
});

// For now, use this link as you get auto complete which will improve DX
// Slowly, also create ButtonLink and NavLink whose main feature will be that they'll need 0 styling
// And then you can use functionality related features of anchor element and next/link for better performance
// import { Link } from "@radix-ui/themes";

export default Link;

/**
 * 1. ALWAYS REMEMBER TO SPREAD ALL THE PROPS
 * 2. ALWAYS FORWARD REF
 * https://www.radix-ui.com/primitives/docs/guides/composition#composing-with-your-own-react-components
 */
