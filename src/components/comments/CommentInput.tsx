import { PostData } from "@/lib/types";
import React, { useState } from "react";
import { useSubmitComment } from "./mutations";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, SendHorizonal } from "lucide-react";
type CommentInputProps = {
  post: PostData;
};
function CommentInput({ post }: CommentInputProps) {
  const [value, setValue] = useState<string>("");
  const { isPending, mutate } = useSubmitComment(post.id);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value) return;

    mutate(
      {
        post,
        content: value,
      },
      { onSuccess: () => setValue("") },
    );
  }
  return (
    <form className="w-full flex items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="What do you think about this post?"
        value={value}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!value.trim() || isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : <SendHorizonal />}
      </Button>
    </form>
  );
}

export default CommentInput;
