"use client";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { UserData } from "@/lib/types";
import {
  updateUserProfileSchema,
  updateUserProfileValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdateProfile } from "./mutations";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import avatarPlaceHolder from "@/../public/user-avatar.png";
import { Camera } from "lucide-react";
import CropImageDialog from "@/components/CropImageDialog";
import Resizer from "react-image-file-resizer";
type EditProfileDialogProps = {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditProfileDialog({
  onOpenChange,
  open,
  user,
}: EditProfileDialogProps) {
  const { isPending, mutate } = useUpdateProfile();
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  const form = useForm<updateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      bio: user.bio || "",
      displayName: user.displayName,
    },
  });

  async function onSubmit(values: updateUserProfileValues) {
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;
    mutate(
      { values, avatar: newAvatarFile },
      {
        onSuccess: () => {
          setCroppedAvatar(null);
          onOpenChange(false);
        },
      },
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5  flex justify-center">
          <AvatarInput
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.avatarUrl || avatarPlaceHolder
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <CustomInput
              control={form.control}
              name="displayName"
              label="Display name"
              placeholder="Your public display name"
            />
            <CustomInput
              input="textarea"
              control={form.control}
              name="bio"
              label="Bio"
              placeholder="Who are you??"
            />
            <DialogFooter>
              <Button
                type="submit"
                isLoading={isPending}
                loadingText="Saving"
                disabled={isPending}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type AvatarInputProps = {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
};

function AvatarInput({ onImageCropped, src }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      500,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="hidden sr-only"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <Image
          src={src}
          alt="Avatar preview"
          width={150}
          height={150}
          className="size-40 flex-none rounded-full object-cover border border-zinc-50"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera size={24} />
        </span>
      </button>

      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
