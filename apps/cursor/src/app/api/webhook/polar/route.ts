import {
  activateJobListing,
  activateMCPListing,
  downgradeMCPListing,
} from "@/lib/polar";
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    switch (payload.type) {
      // Checkout has been updated - this will be triggered when checkout status goes from confirmed -> succeeded
      case "checkout.updated": {
        if (!payload.data.metadata.jobListingId) {
          console.error("jobListingId ID is missing");
          break;
        }

        await activateJobListing(
          payload.data.metadata.jobListingId as string,
          payload.data.metadata.plan as string,
        );

        break;
      }

      case "subscription.active": {
        await activateMCPListing(payload.data.metadata.mcpListingId as string);
        break;
      }

      case "subscription.revoked": {
        await downgradeMCPListing(payload.data.metadata.mcpListingId as string);
        break;
      }

      default:
        console.log("Unknown event", payload.type);
        break;
    }
  },
});
