"use client";
import { PostData } from "@/lib/types";

type PostActionsProps = {
  post: PostData;
  className?: string;
};
import React, { useState } from "react";
import DeletePostDialog from "./DeletePostDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";

function PostActions({ post, className }: PostActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        post={post}
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
        }}
      />
    </>
  );
}

export default PostActions;
