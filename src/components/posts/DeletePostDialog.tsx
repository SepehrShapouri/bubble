import { PostData } from "@/lib/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeletePost } from "./mutations";
type DeletePostDialogProps = {
  post: PostData;
  open: boolean;
  onClose: () => void;
};
function DeletePostDialog({ post, open, onClose }: DeletePostDialogProps) {
  const { mutate: deletePost, isDeleting } = useDeletePost();
  function handleOpenChange(open: boolean) {
    if (!open || !isDeleting) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? this action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 md:flex-row">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Never mind
          </Button>
          <Button
            disabled={isDeleting}
            loadingText="Deleting post"
            variant="destructive"
            isLoading={isDeleting}
            className=""
            onClick={() => deletePost(post.id, { onSuccess: () => onClose() })}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeletePostDialog;
