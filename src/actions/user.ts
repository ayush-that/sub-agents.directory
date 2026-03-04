"use server";

import { getPrisma } from "@/lib/prisma";
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

  const existingUser = await getPrisma().user.findUnique({
    where: { id: user.id },
  });

  if (existingUser) {
    return existingUser;
  }

  const metadata = user.user_metadata || {};
  const githubUsername = metadata.user_name || metadata.preferred_username;
  const name = metadata.full_name || metadata.name || user.email?.split("@")[0];
  let username = githubUsername || generateUsername(user.email ?? undefined, name);

  const existingUsername = await getPrisma().user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    username = `${username}-${Date.now().toString(36).slice(-4)}`;
  }

  const newUser = await getPrisma().user.create({
    data: {
      id: user.id,
      email: user.email,
      name: name || null,
      username,
      avatarUrl: metadata.avatar_url || null,
    },
  });

  return newUser;
}

export async function getUserByUsername(username: string) {
  return getPrisma().user.findUnique({
    where: { username },
    include: {
      _count: {
        select: { generations: true },
      },
    },
  });
}

export async function getMembers(page = 1, limit = 24) {
  const skip = (page - 1) * limit;

  const [members, total] = await Promise.all([
    getPrisma().user.findMany({
      include: {
        _count: {
          select: { generations: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    getPrisma().user.count(),
  ]);

  return {
    members,
    total,
    hasMore: skip + members.length < total,
  };
}

export async function getUserGenerations(userId: string, page = 1, limit = 12) {
  const skip = (page - 1) * limit;

  const [generations, total] = await Promise.all([
    getPrisma().generation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    getPrisma().generation.count({
      where: { userId },
    }),
  ]);

  return {
    generations,
    total,
    hasMore: skip + generations.length < total,
  };
}
