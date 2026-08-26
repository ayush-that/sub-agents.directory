"use server";

import { ensureUserExists } from "@/actions/user";
import { supabaseAdmin, supabaseRead } from "@/lib/supabase-rest";
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

  const { data: generation, error } = await supabaseAdmin()
    .from("generations")
    .insert({
      slug,
      user_id: user.id,
      input,
      content,
    })
    .select("id, slug")
    .single();

  if (error) {
    throw error;
  }

  return {
    slug: generation.slug as string,
    id: generation.id as string,
  };
}

export async function getGenerationBySlug(slug: string) {
  const { data } = await supabaseRead()
    .from("generations")
    .select("id, slug, content, title, created_at, user:users(id, name, username, avatar_url)")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) {
    return null;
  }

  const u = Array.isArray(data.user) ? data.user[0] : data.user;

  return {
    id: data.id as string,
    slug: data.slug as string,
    content: data.content as string,
    title: (data.title as string | null) ?? null,
    createdAt: new Date(data.created_at as string),
    user: {
      id: u?.id as string,
      name: (u?.name as string | null) ?? null,
      username: u?.username as string,
      avatarUrl: (u?.avatar_url as string | null) ?? null,
    },
  };
}
