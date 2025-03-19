"use client";
import React from "react";
import { deleteCampground } from "@/utils/actions/campgroundsCrud";
import { ToastContext } from "../ToastProvider";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";

export default function DeleteCampground({ name, id, updateState }) {
  const [isPending, startTransition] = React.useTransition();
  const { createToast } = React.useContext(ToastContext);

  React.useEffect(() => {
    isPending && createToast(`Deleting ${name}`, "notice");
  }, [isPending]);

  function handleOnClick() {
    startTransition(async () => {
      // res stores the data of the deleted campground
      // (in case I need it for UI in future)
      const res = await deleteCampground(id);
      if (res.error) {
        createToast(res.message, "error");
        return;
      }
      updateState(id);
    });
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button size={"3"} variant="surface" color="red">
          Delete 🗑️
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete {name}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This action is irreversible and will permanently delete
          the campground.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={handleOnClick}>
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
