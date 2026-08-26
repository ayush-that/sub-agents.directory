import { getMembers } from "@/actions/user";
import { MemberCard } from "@/components/member-card";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Members | Sub-Agents Directory",
  description: "Browse members who have generated and shared Claude Code sub-agent prompts.",
  openGraph: {
    title: "Members | Sub-Agents Directory",
    description: "Browse members who have generated and shared Claude Code sub-agent prompts.",
  },
};

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const { members, total } = await getMembers(1, 90);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 md:mt-24 pb-32">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl mb-2">Browse Members</h1>
          <p className="text-sm text-[#878787] mb-8">
            Join the community with {total} {total === 1 ? "member" : "members"}.
          </p>
        </div>

        <Link href="/login">
          <Button variant="outline" className="border-border rounded-full">
            Join the community
          </Button>
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#878787] mb-4">No members yet.</p>
          <p className="text-sm text-[#878787]">
            Be the first to{" "}
            <Link href="/generate" className="text-primary hover:underline">
              generate and save
            </Link>{" "}
            a sub-agent prompt!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
