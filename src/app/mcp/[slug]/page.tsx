/**
 * MCP Server Page
 * Enhanced with new SEO infrastructure
 * /mcp/[slug]
 */

import { HowTo } from "@/components/how-to";
import mcpData from "@/data/mcp";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import slugify from "slugify";
import { ArrowRight } from "lucide-react";

import { createMcpMetadata } from "@/lib/seo/metadata-factory";
import { createSoftwareAppSchema } from "@/lib/seo/schema-factory";
import {
  JsonLdScript,
  DynamicBreadcrumbs,
  getMcpBreadcrumbs,
  FAQSection,
  generateMcpFAQs,
} from "@/components/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mcp = mcpData.find((item) => slugify(item.name, { lower: true }) === slug);

  if (!mcp) {
    return {
      title: "MCP Server Not Found",
      robots: { index: false },
    };
  }

  return createMcpMetadata({
    name: mcp.name,
    slug,
    description: mcp.description,
  });
}

export async function generateStaticParams() {
  return mcpData.map((mcp) => ({
    slug: slugify(mcp.name, { lower: true }),
  }));
}

export default async function McpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mcp = mcpData.find((item) => slugify(item.name, { lower: true }) === slug);

  if (!mcp) {
    notFound();
  }

  // Generate breadcrumbs
  const breadcrumbs = getMcpBreadcrumbs({ name: mcp.name, slug });

  // Generate schema
  const softwareSchema = createSoftwareAppSchema({
    name: mcp.name,
    description: mcp.description,
    url: `/mcp/${slug}`,
    logo: mcp.logo,
  });

  // Generate FAQs
  const faqs = generateMcpFAQs({
    name: mcp.name,
    description: mcp.description,
  });

  // Other MCP servers
  const otherMcps = mcpData.filter((m) => slugify(m.name, { lower: true }) !== slug).slice(0, 4);

  return (
    <>
      <JsonLdScript data={softwareSchema} />

      <div className="min-h-screen mt-16 px-4">
        <div className="container px-4 py-8 max-w-2xl">
          {/* Breadcrumbs */}
          <DynamicBreadcrumbs items={breadcrumbs} className="mb-6" />

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            {mcp.logo && (
              <Image
                src={mcp.logo}
                alt={`${mcp.name} logo`}
                width={48}
                height={48}
                priority
                className="rounded-lg"
              />
            )}
            <h1 className="text-2xl font-semibold">{mcp.name} MCP Server</h1>
          </div>

          <p className="text-muted-foreground mb-6">{mcp.description}</p>

          <Link
            href={mcp.url}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-8"
            target="_blank"
          >
            <span>Installation Instructions</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* FAQ Section */}
          <FAQSection faqs={faqs} className="my-8" />

          {/* Other MCP Servers */}
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-lg font-semibold mb-4">Other MCP Servers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherMcps.map((m) => (
                <Link
                  key={m.name}
                  href={`/mcp/${slugify(m.name, { lower: true })}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:border-border hover:bg-accent/30 transition-all"
                >
                  {m.logo && (
                    <Image src={m.logo} alt={m.name} width={24} height={24} className="rounded" />
                  )}
                  <span className="text-sm">{m.name}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/mcp"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              All MCP Servers
            </Link>
          </section>
        </div>

        <HowTo />
      </div>
    </>
  );
}

export const revalidate = 86400; // REVALIDATION_TIMES.mcp
