import { CommentData } from "@/lib/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeleteComment } from "./mutations";
type DeleteCommentDialogProps = {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
};
function DeleteCommentDialog({
  comment,
  open,
  onClose,
}: DeleteCommentDialogProps) {
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();
  function handleOpenChange(open: boolean) {
    if (!open || !isDeleting) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment? this action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Never mind
          </Button>
          <Button
            disabled={isDeleting}
            loadingText="Deleting comment"
            variant="destructive"
            isLoading={isDeleting}
            className=""
            onClick={() =>
              deleteComment(comment.id, { onSuccess: () => onClose() })
            }
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteCommentDialog;
