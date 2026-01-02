import { getGameBySlug, getGames } from "@/data/games";
import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getGames().map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: "Game Not Found",
    };
  }

  return {
    title: `${game.name} - Game built with Cursor | Cursor Directory`,
    description: game.description,
  };
}

export default async function GamePage({ params }: { params: Params }) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <iframe
        title="Game"
        src={game.link}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
