import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export type Attachments = {
  file: File;
  mediaId?: string;
  isUploading: boolean;
};
export default function useMediaUpload() {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachments[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();
  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          },
        );
      });
      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ]);
      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((result) => result.name == a.file.name);
          if (!uploadResult) return a;

          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({ variant: "destructive", description: e.message });
    },
  });
  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload to finish.",
      });
      return;
    }
    if (attachments.length + files.length > 10) {
      toast({
        variant: "destructive",
        description: "You can only upload only up to 10 files per post.",
      });
      return;
    }

    startUpload(files);
  }

  function removeAttachment(filename: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== filename));
  }

  function resetAttachments() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    resetAttachments,
  };
}
