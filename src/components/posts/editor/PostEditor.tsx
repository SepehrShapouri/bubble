"use client";

import UserAvatar from "@/components/main/UserAvatar";
import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useSubmitPost } from "./mutations";
import useMediaUpload, { Attachments } from "./useMediaUpload";
import { ClipboardEvent, useRef } from "react";
import { ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
function PostEditor() {
  const { mutate: submitPost, isPending } = useSubmitPost();
  const {
    attachments,
    isUploading,
    removeAttachment,
    resetAttachments,
    startUpload,
    uploadProgress,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();
  const { user } = useSession();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({ placeholder: "Wsg???" }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";
  function onSubmit() {
    submitPost(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands?.clearContent();
          resetAttachments();
        },
      },
    );
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[]

      startUpload(files)
  }
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm ">
      <div className="flex gap-5">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          className="hidden sm:inline"
          size={40}
        />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            onPaste={onPaste}
            className={cn(
              "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-secondary px-5 py-3",
              isDragActive && "outline-dashed",
            )}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentsPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex justify-end gap-3 items-center">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 10}
        />
        <Button
          onClick={onSubmit}
          disabled={!input.trim() || isPending || isUploading}
          className="min-w-20"
          isLoading={isPending}
          loadingText="Posting"
        >
          Post
        </Button>
      </div>
    </div>
  );
}

export default PostEditor;

type AddAttachmentsButtonProps = {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
};

function AddAttachmentsButton({
  disabled,
  onFilesSelected,
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-primary text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        className="hidden sr-only"
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}
type AttachmentsPreviewsProps = {
  attachments: Attachments[];
  removeAttachment: (filename: string) => void;
};
function AttachmentsPreviews({
  attachments,
  removeAttachment,
}: AttachmentsPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentsPreview
          key={attachment.file.name}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
          attachment={attachment}
        />
      ))}
    </div>
  );
}

type AttachmentsPreviewProps = {
  attachment: Attachments;
  onRemoveClick: () => void;
};

function AttachmentsPreview({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentsPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn(
        "relative mx-auto size-fit transition-opacity",
        isUploading && "opacity-50",
      )}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-background/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
