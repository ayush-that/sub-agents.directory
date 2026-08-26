"use server";

import { supabaseAdmin, supabaseRead } from "@/lib/supabase-rest";
import { createClient } from "@/utils/supabase/server";

function generateUsername(email: string | undefined, name: string | undefined): string {
  if (name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 30);
  }
  if (email) {
    return email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
  }
  return `user-${Date.now().toString(36)}`;
}

export async function ensureUserExists() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const db = supabaseAdmin();

  const { data: existingUser } = await db.from("users").select("*").eq("id", user.id).maybeSingle();

  if (existingUser) {
    return existingUser;
  }

  const metadata = user.user_metadata || {};
  const githubUsername = metadata.user_name || metadata.preferred_username;
  const name = metadata.full_name || metadata.name || user.email?.split("@")[0];
  let username = githubUsername || generateUsername(user.email ?? undefined, name);

  const { data: existingUsername } = await db
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existingUsername) {
    username = `${username}-${Date.now().toString(36).slice(-4)}`;
  }

  const { data: newUser, error } = await db
    .from("users")
    .insert({
      id: user.id,
      email: user.email ?? null,
      name: name || null,
      username,
      avatar_url: metadata.avatar_url || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return newUser;
}

export async function getUserByUsername(username: string) {
  const { data } = await supabaseRead()
    .from("users")
    .select("id, username, name, avatar_url, generations(count)")
    .eq("username", username)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    id: data.id as string,
    username: data.username as string,
    name: (data.name as string | null) ?? null,
    avatarUrl: (data.avatar_url as string | null) ?? null,
    _count: { generations: data.generations?.[0]?.count ?? 0 },
  };
}

export async function getMembers(page = 1, limit = 24) {
  const skip = (page - 1) * limit;

  const { data, count } = await supabaseRead()
    .from("users")
    .select("id, username, name, avatar_url, generations(count)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(skip, skip + limit - 1);

  const members = (data ?? []).map((u) => ({
    id: u.id as string,
    username: u.username as string,
    name: (u.name as string | null) ?? null,
    avatarUrl: (u.avatar_url as string | null) ?? null,
    _count: { generations: u.generations?.[0]?.count ?? 0 },
  }));

  const total = count ?? 0;

  return {
    members,
    total,
    hasMore: skip + members.length < total,
  };
}

export async function getUserGenerations(userId: string, page = 1, limit = 12) {
  const skip = (page - 1) * limit;

  const { data, count } = await supabaseRead()
    .from("generations")
    .select("id, slug, content, title, created_at", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(skip, skip + limit - 1);

  const generations = (data ?? []).map((g) => ({
    id: g.id as string,
    slug: g.slug as string,
    content: g.content as string,
    title: (g.title as string | null) ?? null,
    createdAt: new Date(g.created_at as string),
  }));

  const total = count ?? 0;

  return {
    generations,
    total,
    hasMore: skip + generations.length < total,
  };
}
