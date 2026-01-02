"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileForm } from "../forms/profile";
import { Button } from "../ui/button";

type ProfileData = {
  name?: string;
  status?: string;
  bio?: string;
  work?: string;
  website?: string;
  social_x_link?: string;
  is_public?: boolean;
  slug: string;
};

export function EditProfileModal({ data }: { data: ProfileData }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-8 rounded-full">Edit Profile</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <ProfileForm data={data} />
      </DialogContent>
    </Dialog>
  );
}
