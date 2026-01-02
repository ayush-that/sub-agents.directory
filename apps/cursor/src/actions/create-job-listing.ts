"use server";

import { createJobListingCheckoutSession } from "@/lib/polar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authActionClient } from "./safe-action";

export const createJobListingAction = authActionClient
  .metadata({
    actionName: "create-job-listing",
  })
  .schema(
    z.object({
      title: z.string(),
      company_id: z.string(),
      location: z.string().nullable(),
      description: z.string(),
      link: z.string().url(),
      workplace: z.enum(["On site", "Remote", "Hybrid"]),
      plan: z.enum(["standard", "featured", "premium"]),
      experience: z.string().nullable(),
    }),
  )
  .action(
    async ({
      parsedInput: {
        title,
        company_id,
        location,
        description,
        link,
        workplace,
        experience,
        plan,
      },
      ctx: { email, name },
    }) => {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("jobs")
        .insert({
          title,
          company_id,
          location,
          description,
          link,
          workplace,
          experience,
          plan,
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const session = await createJobListingCheckoutSession({
        plan,
        jobListingId: data.id,
        companyId: company_id,
        email: email ?? "",
        customerName: name ?? "",
      });

      redirect(session.url);
    },
  );
