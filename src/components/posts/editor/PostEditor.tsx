"use client";

import React, { useTransition } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { submitPost } from "./actions";
import UserAvatar from "@/components/main/UserAvatar";
import { useSession } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/button";
function PostEditor() {
    const [isPending,startTransition] = useTransition()
  const { user } = useSession();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({ placeholder: "Wsg???" }),
    ],
    immediatelyRender:false
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  async function onSubmit() {
    startTransition(async()=>{
        await submitPost(input);
        editor?.commands.clearContent();
    })

  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" size={40} />
        <EditorContent editor={editor} className="w-full max-h-[20rem] overflow-y-auto bg-secondary rounded-2xl px-5 py-3" />
      </div>
      <div className="flex justify-end"><Button onClick={onSubmit} disabled={!input.trim() || isPending} className="min-w-20" isLoading={isPending}  loadingText="Posting">Post</Button></div>
    </div>
  );
}

export default PostEditor;