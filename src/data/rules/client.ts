import type { Rule, Section } from "./types";
import data from "./generated.json";

export const rules: Rule[] = data.rules as Rule[];
export const sections: Section[] = data.sections as Section[];

export function getSections(): Section[] {
  return sections;
}

export function getRuleBySlug(slug: string): Rule | undefined {
  return rules.find((rule) => rule.slug === slug);
}
