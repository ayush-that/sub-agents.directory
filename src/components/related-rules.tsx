import type { Rule } from "@/data/rules";
import Link from "next/link";

interface RelatedRulesProps {
  rules: Rule[];
}

export function RelatedRules({ rules }: RelatedRulesProps) {
  if (rules.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-lg font-medium mb-4">Related Sub-Agents</h2>
      <div className="grid gap-3">
        {rules.map((rule) => (
          <Link
            key={rule.slug}
            href={`/${rule.slug}`}
            className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-[#D97757]/40 hover:bg-[#D97757]/5 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <span className="font-medium group-hover:text-[#D97757] transition-colors">
                {rule.title}
              </span>
              {rule.description && (
                <p className="text-sm text-muted-foreground truncate mt-0.5">{rule.description}</p>
              )}
            </div>
            <span className="text-xs text-muted-foreground ml-4 shrink-0 hidden sm:inline">
              {rule.tags[0]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
