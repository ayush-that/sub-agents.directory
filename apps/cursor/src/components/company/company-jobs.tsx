import { JobsCard } from "@/components/jobs/jobs-card";
import { getJobsByCompany } from "@/data/queries";

export async function CompanyJobs({ slug }: { slug: string }) {
  const { data } = await getJobsByCompany(slug);

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className=" mt-10">Jobs</p>
      {data?.map((job) => (
        <JobsCard
          key={job.id}
          data={{
            id: job.id,
            owner_id: job.owner_id,
            title: job.title,
            company: job.companies,
            location: job.location,
            description: job.description,
            created_at: job.created_at,
            link: job.link,
            workplace: job.workplace,
            experience: job.experience,
          }}
        />
      ))}
    </div>
  );
}
