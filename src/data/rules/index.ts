import "server-only";
import slugify from "slugify";
import data from "./generated.json";

export interface Rule {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  libs: string[];
  content: string;
}

export type Section = {
  tag: string;
  rules: Rule[];
  slug: string;
};

export const rules: Rule[] = data.rules.map((r) => ({ ...r, content: r.description })) as Rule[];

const sections: Section[] = data.sections.map((s) => ({
  ...s,
  rules: s.rules.map((r) => ({ ...r, content: r.description })),
  slug: s.slug || slugify(s.tag, { lower: true }),
})) as Section[];

export function getSections(): Section[] {
  return sections;
}

export function getSectionBySlug(slug: string) {
  return sections.find((section) => section.slug === slug);
}

export function getRuleBySlug(slug: string) {
  return rules.find((rule) => rule.slug === slug);
}

export function getRelatedRules(slug: string, limit = 4): Rule[] {
  const currentRule = getRuleBySlug(slug);
  if (!currentRule) return [];

  const currentTags = currentRule.tags;
  const currentLibs = new Set(currentRule.libs);

  return rules
    .filter((rule) => rule.slug !== slug)
    .map((rule) => {
      let score = 0;
      if (rule.tags.some((tag) => currentTags.includes(tag))) {
        score += 10;
      }
      const sharedLibs = rule.libs.filter((lib) => currentLibs.has(lib)).length;
      score += sharedLibs * 2;
      return { rule, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ rule }) => rule);
}
