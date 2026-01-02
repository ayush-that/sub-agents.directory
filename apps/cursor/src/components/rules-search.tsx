"use client";

import { useQueryState } from "nuqs";

export function RulesSearch() {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="w-full max-w-[300px] border border-[#2C2C2] mt-6 hidden md:block">
      <form className="h-full w-full" onSubmit={handleSubmit}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-[#585858] text-xs bg-transparent p-2 resize-none focus:outline-none placeholder:text-[#585858]"
          placeholder="Search rules..."
        />
      </form>
    </div>
  );
}
