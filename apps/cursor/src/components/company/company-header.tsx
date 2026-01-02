import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { EditCompanyModal } from "../modals/edit-company-modal";

export function CompanyHeader({
  id,
  image,
  name,
  location,
  isOwner,
  bio,
  website,
  social_x_link,
  is_public,
  slug,
}: {
  id: string;
  image?: string | null;
  name: string;
  location: string | null;
  isOwner: boolean;
  bio?: string | null;
  website?: string | null;
  social_x_link?: string | null;
  is_public?: boolean;
  slug: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-24 border-border border flex items-center justify-center">
        <AvatarImage src={image ?? undefined} />

        <AvatarFallback className="text-sm font-mono">
          {name?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <h2 className="text-xl font-mono">{name}</h2>
        <span className="text-sm font-mono text-[#878787]">{location}</span>
      </div>

      {isOwner && (
        <div className="ml-auto">
          <EditCompanyModal
            data={{
              id,
              image: image ?? undefined,
              location: location ?? undefined,
              name,
              bio: bio ?? undefined,
              website: website ?? undefined,
              social_x_link: social_x_link ?? undefined,
              is_public,
              slug,
            }}
          />
        </div>
      )}
    </div>
  );
}
