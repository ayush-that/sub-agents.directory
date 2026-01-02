import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export type Company = {
  id: string;
  location: string;
  name: string;
  slug: string;
  image: string;
};

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Card className="bg-transparent border-none pb-4 border-b-[1px] border-border">
      <Link href={`/c/${company.slug}`}>
        <CardHeader className="flex flex-row items-center gap-4 p-0">
          <Avatar className="size-10 border border-border rounded-none">
            <AvatarImage src={company.image} alt={company.name} />
            <AvatarFallback className="text-sm font-mono rounded-none bg-transparent">
              {company.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-sm font-normal mt-0">
              {company.name}
            </CardTitle>
            <span className="text-xs text-[#878787] font-mono">
              {company.location}
            </span>
          </div>

          <div className="ml-auto text-xs text-[#878787] font-mono">
            View Company
          </div>
        </CardHeader>
      </Link>
    </Card>
  );
}
