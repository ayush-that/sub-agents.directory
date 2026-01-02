import { getUserCompanies } from "@/data/queries";
import { AddCompanyButton } from "../company/add-company-button";
import { CompanyCard } from "../company/company-card";

export async function ProfileCompanies({
  userId,
  isOwner,
}: {
  userId: string;
  isOwner: boolean;
}) {
  const { data } = await getUserCompanies(userId);

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center h-full mt-12">
        <p className="text-[#878787] mb-4 text-sm font-mono">
          No companies added yet
        </p>
        {isOwner && <AddCompanyButton redirect={true} />}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data?.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
