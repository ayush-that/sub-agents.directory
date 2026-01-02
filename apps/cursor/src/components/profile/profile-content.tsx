import { LinkIcon, XIcon } from "lucide-react";

export function ProfileContent({
  bio,
  work,
  website,
  social_x_link,
}: {
  bio: string;
  work: string;
  website: string;
  social_x_link: string;
}) {
  const hasLinks = website || social_x_link;

  return (
    <div className="flex flex-col gap-10 mt-12">
      {bio && (
        <div>
          <p>About</p>
          <p className="text-sm font-mono text-[#878787] mt-2">{bio}</p>
        </div>
      )}

      {work && (
        <div>
          <p>Work</p>
          <p className="text-sm font-mono text-[#878787] mt-2">{work}</p>
        </div>
      )}

      {hasLinks && (
        <div>
          <p>Links</p>

          {website && (
            <div className="flex items-center gap-2 ">
              <LinkIcon className="size-3.5 mt-2" />
              <p className="text-sm font-mono text-[#878787] mt-2">
                <a
                  href={`${website}?utm_source=cursor.directory`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              </p>
            </div>
          )}

          {social_x_link && (
            <div className="flex items-center gap-2">
              <XIcon className="size-3.5 mt-2" />
              <p className="text-sm font-mono text-[#878787] mt-2">
                <a
                  href={social_x_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social_x_link ? `@${social_x_link.split("/").pop()}` : "X"}
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
