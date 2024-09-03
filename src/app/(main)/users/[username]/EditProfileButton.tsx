"use client";
import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";

type EditProfileButtonProps = {
  user: UserData;
};

function EditProfileButton({ user }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setShowDialog(true)}>
        Edit profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}

export default EditProfileButton;
