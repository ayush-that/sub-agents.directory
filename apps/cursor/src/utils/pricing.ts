export type JobPlan = "standard" | "featured" | "premium";

export const JOB_PRICES = {
  standard: 99,
  featured: 299,
  premium: 999,
} as const;

export function getJobPlanPrice(plan: JobPlan): number {
  return JOB_PRICES[plan];
}

export function formatPrice(amount: number): string {
  return `$${amount}`;
}

export function getFormattedJobPlanPrice(plan: JobPlan): string {
  return formatPrice(getJobPlanPrice(plan));
}

export type MCPPlan = "standard" | "featured" | "premium";

export const MCP_PRICES = {
  standard: 0,
  featured: 299,
  premium: 499,
} as const;

export function getMCPPlanPrice(plan: MCPPlan): number {
  return MCP_PRICES[plan];
}

export function getFormattedMCPPlanPrice(plan: MCPPlan): string {
  return formatPrice(getMCPPlanPrice(plan));
}
