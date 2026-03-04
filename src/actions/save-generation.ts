"use server";

import { ensureUserExists } from "@/actions/user";
import { getPrisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);

export async function saveGeneration(input: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to save generations");
  }

  await ensureUserExists();

  const slug = nanoid();

  const generation = await getPrisma().generation.create({
    data: {
      slug,
      userId: user.id,
      input,
      content,
    },
  });

  return {
    slug: generation.slug,
    id: generation.id,
  };
}

export async function getGenerationBySlug(slug: string) {
  return getPrisma().generation.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
}
