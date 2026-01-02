import { getJobs } from "@/data/queries";
import { JobsBuy } from "./jobs-buy";
import { JobsCard } from "./jobs-card";

export async function JobsList() {
  const { data: jobs } = await getJobs();

  return (
    <div className="flex gap-8 justify-between mt-6">
      <div className="flex flex-col gap-8 mt-10 max-w-screen-sm xl:max-w-screen-md border-t border-border pt-10">
        {jobs?.map((job) => (
          <JobsCard key={job.id} data={job} />
        ))}
      </div>

      <div className="hidden lg:block mt-9">
        <JobsBuy />
      </div>
    </div>
  );
}
