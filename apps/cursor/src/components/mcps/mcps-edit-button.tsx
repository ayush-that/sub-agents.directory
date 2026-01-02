"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function MCPsEditButton({
  ownerId,
  slug,
}: { ownerId: string; slug: string }) {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const session = await supabase.auth.getSession();

      setUserId(session.data.session?.user?.id ?? null);
    }

    getUser();
  }, []);

  if (!userId) {
    return null;
  }

  if (ownerId !== userId) {
    return null;
  }

  return (
    <Link href={`/mcp/${slug}/edit`}>
      <Button size="sm" className="w-fit rounded-full font-mono text-xs">
        Edit
      </Button>
    </Link>
  );
}
