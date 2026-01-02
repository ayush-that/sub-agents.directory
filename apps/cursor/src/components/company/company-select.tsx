"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { parseAsBoolean, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import { AddCompanyButton } from "./add-company-button";

type Company = {
  id: string;
  name: string;
};

export function CompanySelect({
  onChange,
  value,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const supabase = createClient();
  const [{ reload }, setQueryStates] = useQueryStates({
    reload: parseAsBoolean.withDefault(false),
    addCompany: parseAsBoolean.withDefault(false),
  });

  useEffect(() => {
    async function fetchCompanies() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { data } = await supabase
          .from("companies")
          .select("id, name")
          .eq("owner_id", session.user.id)
          .order("created_at", { ascending: false });

        if (data) {
          setCompanies(data);

          const initialCompany = data.find((c) => c.id === value) || data[0];
          setSelectedCompany(initialCompany);
          onChange(initialCompany?.id ?? "");
        }
      }
    }

    fetchCompanies();

    if (reload) {
      setQueryStates({ reload: false, addCompany: false });
    }
  }, [reload]);

  return (
    <div className="flex items-center gap-4">
      <Select
        key={selectedCompany?.id}
        value={selectedCompany?.id}
        onValueChange={(value) => {
          const company = companies.find((c) => c.id === value);
          setSelectedCompany(company || null);
          onChange(company?.id ?? "");
        }}
      >
        <SelectTrigger
          className="w-full border-border"
          disabled={companies.length === 0}
        >
          <SelectValue placeholder="Select company" />
        </SelectTrigger>
        {companies.length > 0 && (
          <SelectContent className="max-h-[200px] overflow-y-auto">
            <SelectGroup>
              {companies?.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        )}
      </Select>

      <AddCompanyButton redirect={false} />
    </div>
  );
}
