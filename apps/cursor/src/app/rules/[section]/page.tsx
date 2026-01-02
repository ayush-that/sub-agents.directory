import { Menu } from "@/components/menu";
import { RuleList } from "@/components/rule-list";
import { Tabs } from "@/components/tabs";
import { getSectionBySlug, getSections } from "@directories/data/rules";

type Params = Promise<{ section: string }>;

export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once every day

export async function generateMetadata({ params }: { params: Params }) {
  const { section } = await params;

  const data = getSectionBySlug(section);

  return {
    title: `Rules for ${data?.tag} | Cursor Directory`,
    description: `Cursor rules for ${data?.tag}, a collection of rules for Cursor.`,
  };
}

export async function generateStaticParams() {
  return getSections().map((section) => ({
    section: section.slug,
  }));
}

export default async function Page({ params }: { params: Params }) {
  const { section } = await params;

  const data = getSectionBySlug(section);

  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)]">
        <Menu />
      </div>

      <main className="flex-1 p-6 pt-4 md:pt-16 space-y-8">
        <Tabs />

        <RuleList sections={data ? [data] : []} />
      </main>
    </div>
  );
}
