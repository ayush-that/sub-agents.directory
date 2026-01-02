"use client";

import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { SearchInput } from "../search-input";
import { Button } from "../ui/button";
import { CompanyCard } from "./company-card";
import type { Company } from "./company-card";

export function CompanyList({ data }: { data?: Company[] | null }) {
  const [companies, setCompanies] = useState<Company[]>(data ?? []);
  const [search, setSearch] = useQueryState("q");

  useEffect(() => {
    const filteredCompanies = data?.filter((company) =>
      company.name.toLowerCase().includes(search?.toLowerCase() ?? ""),
    );

    setCompanies(filteredCompanies ?? []);
  }, [search]);

  return (
    <div className="mt-8">
      <SearchInput
        placeholder="Search companies"
        className="border-l-0 border-r-0 border-t-0 border-b-[1px] border-border px-0"
      />

      {companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-8">
          {companies?.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="mt-24 flex flex-col items-center">
          <div className="text-center text-sm text-[#878787]">
            No companies found
          </div>

          <Button
            variant="outline"
            className="mt-4 rounded-full border-border"
            onClick={() => setSearch(null)}
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}
