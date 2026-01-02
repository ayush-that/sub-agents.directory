"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Login } from "../login";

export function SignInModal({
  isOpen,
  setIsOpen,
  redirectTo,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  redirectTo?: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm text-center">
        <Login redirectTo={redirectTo} />
      </DialogContent>
    </Dialog>
  );
}
