"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
export function BoardSearch() {
  return (
    <div className="flex items-center gap-2 mt-8 relative border-b-[1px] border-border">
      <Search className="w-4 h-4 text-[#878787] absolute pointer-events-none" />

      <Input
        type="text"
        placeholder="Search..."
        className="border-0 rounded-none p-0 placeholder:text-sm placeholder:text-[#878787] pl-6"
      />
    </div>
  );
}
