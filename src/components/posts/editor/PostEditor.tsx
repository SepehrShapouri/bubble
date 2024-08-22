"use client";

import React, { useTransition } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { submitPost } from "./actions";
import UserAvatar from "@/components/main/UserAvatar";
import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import { useSubmitPost } from "./mutations";
function PostEditor() {
  const { mutate: submitPost, isPending } = useSubmitPost();
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
    submitPost(input, {
      onSuccess: () => {
        editor?.commands?.clearContent();
      },
    });
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm ">
      <div className="flex gap-5">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          className="hidden sm:inline"
          size={40}
        />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-secondary px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!input.trim() || isPending}
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
