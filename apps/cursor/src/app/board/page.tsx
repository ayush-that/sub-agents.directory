import BoardList from "@/components/board/board-list";
import { getPopularPosts } from "@/data/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending in Cursor Today | Cursor Directory",
  description: "Explore what the community is talking about",
};

export const revalidate = 60;

export default async function Page() {
  const { data: popularPosts } = await getPopularPosts();

  return (
    <div className="flex mx-auto max-w-4xl min-h-screen w-full md:mt-28 mt-14 px-6 lg:px-0">
      <BoardList popularPosts={popularPosts} />
    </div>
  );
}
