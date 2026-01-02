import { Company } from "@/components/company";
import { getCompanyProfile } from "@/data/queries";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;

  const { data } = await getCompanyProfile(slug);

  return {
    title: `${data?.name}'s Profile | Cursor Directory`,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  return (
    <div className="flex mx-auto max-w-4xl min-h-screen w-full md:mt-28 mt-14 px-6 lg:px-0">
      <Company slug={slug} />
    </div>
  );
}
