"use client";

import { PostForm } from "@/components/forms/post";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function CreatePostModal({
  isOpen,
  setIsOpen,
}: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const router = useRouter();

  const handleSuccess = () => {
    setIsOpen(false);

    // Refresh the page to see the new post because of revalidatePath
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add a post</DialogTitle>
        </DialogHeader>

        <PostForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
