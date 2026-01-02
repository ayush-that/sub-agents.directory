"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CompanyForm } from "../forms/company";
import { Button } from "../ui/button";

type CompanyData = {
  id: string;
  name?: string;
  location?: string;
  bio?: string;
  website?: string;
  social_x_link?: string;
  is_public?: boolean;
  slug: string;
  image?: string;
};

export function EditCompanyModal({ data }: { data: CompanyData }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-8 rounded-full">Edit Company</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>

        <CompanyForm data={data} />
      </DialogContent>
    </Dialog>
  );
}
