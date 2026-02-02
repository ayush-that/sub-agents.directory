/**
 * FAQSection Component
 * Renders FAQ content with JSON-LD schema for rich snippets
 */

import { createFAQSchema, type FAQItem } from "@/lib/seo/schema-factory";
import { JsonLdScript } from "./json-ld-script";
import { cn } from "@/lib/utils";

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  className?: string;
}

export function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  className,
}: FAQSectionProps) {
  if (faqs.length === 0) return null;

  const schema = createFAQSchema(faqs);

  return (
    <>
      <JsonLdScript data={schema} />
      <section className={cn("space-y-6", className)}>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group border border-border/40 rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-accent/30 transition-colors rounded-lg">
                <h3 className="font-medium text-left pr-4">{faq.question}</h3>
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <div className="px-4 pb-4 text-muted-foreground">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

/**
 * Generate FAQs for category pages
 */
export function generateCategoryFAQs(category: {
  name: string;
  count: number;
  topTools?: string[];
}): FAQItem[] {
  const faqs: FAQItem[] = [
    {
      question: `What are ${category.name} Claude Code sub-agents?`,
      answer: `${category.name} sub-agents are specialized prompts that configure Claude Code to excel at ${category.name.toLowerCase()}-related tasks. They provide expert guidance, best practices, and tool configurations tailored for this domain.`,
    },
    {
      question: `How many ${category.name} sub-agents are available?`,
      answer: `We currently have ${category.count} ${category.name} sub-agents available. Each one is designed for specific use cases within this category.`,
    },
    {
      question: `How do I use a ${category.name} sub-agent?`,
      answer: `To use a ${category.name} sub-agent, simply copy the prompt and paste it into your Claude Code CLAUDE.md file or use it as a system prompt. The agent will then be configured with specialized knowledge for ${category.name.toLowerCase()} tasks.`,
    },
  ];

  if (category.topTools && category.topTools.length > 0) {
    faqs.push({
      question: `What tools do ${category.name} sub-agents use?`,
      answer: `${category.name} sub-agents commonly use tools like ${category.topTools.join(", ")}. These tools are configured in each agent's prompt to provide the best experience for your specific needs.`,
    });
  }

  return faqs;
}

/**
 * Generate FAQs for tool pages
 */
export function generateToolFAQs(tool: { name: string; count: number }): FAQItem[] {
  return [
    {
      question: `What are ${tool.name} Claude Code sub-agents?`,
      answer: `${tool.name} sub-agents are Claude Code prompts that utilize ${tool.name} as one of their primary tools. They're designed to help you work efficiently with ${tool.name}-based workflows.`,
    },
    {
      question: `How many sub-agents use ${tool.name}?`,
      answer: `Currently, ${tool.count} Claude Code sub-agents are configured to use ${tool.name}. Each agent combines ${tool.name} with other tools for specific use cases.`,
    },
    {
      question: `Can I customize ${tool.name} sub-agents?`,
      answer: `Yes! All sub-agents are fully customizable. You can modify the prompts to adjust how ${tool.name} is used, add additional instructions, or combine multiple agents for your specific workflow.`,
    },
  ];
}

/**
 * Generate FAQs for comparison pages
 */
export function generateComparisonFAQs(
  rule1: {
    title: string;
    description?: string;
  },
  rule2: {
    title: string;
    description?: string;
  },
): FAQItem[] {
  return [
    {
      question: `What's the difference between ${rule1.title} and ${rule2.title}?`,
      answer: `${rule1.title} and ${rule2.title} are both Claude Code sub-agents, but they're optimized for different use cases. ${rule1.title} focuses on ${rule1.description || "specific development tasks"}, while ${rule2.title} is better suited for ${rule2.description || "different development scenarios"}.`,
    },
    {
      question: `Which sub-agent should I use: ${rule1.title} or ${rule2.title}?`,
      answer: `The best choice depends on your specific needs. Use ${rule1.title} when you need ${rule1.description || "its specialized capabilities"}. Choose ${rule2.title} when your work requires ${rule2.description || "its particular strengths"}.`,
    },
    {
      question: `Can I use both ${rule1.title} and ${rule2.title} together?`,
      answer: `Yes! You can combine multiple sub-agents by including their prompts in your CLAUDE.md file. Many developers use different agents for different parts of their workflow or project.`,
    },
  ];
}

/**
 * Generate FAQs for use case pages
 */
export function generateUseCaseFAQs(useCase: {
  name: string;
  description: string;
  agentCount?: number;
}): FAQItem[] {
  return [
    {
      question: `What Claude Code sub-agents are best for ${useCase.name}?`,
      answer: `For ${useCase.name}, we recommend agents that specialize in ${useCase.description}. ${useCase.agentCount ? `We have ${useCase.agentCount} agents` : "Several agents"} specifically designed for this use case.`,
    },
    {
      question: `How do I set up Claude Code for ${useCase.name}?`,
      answer: `To set up Claude Code for ${useCase.name}, choose a sub-agent from our collection, copy its prompt, and add it to your project's CLAUDE.md file. The agent will configure Claude Code with the right tools and instructions for ${useCase.name.toLowerCase()}.`,
    },
    {
      question: `Can Claude Code help with ${useCase.name} tasks?`,
      answer: `Yes! Claude Code is excellent for ${useCase.name.toLowerCase()}. With the right sub-agent prompt, it can ${useCase.description.toLowerCase()}, following best practices and helping you work more efficiently.`,
    },
  ];
}

/**
 * Generate FAQs for MCP server pages
 */
export function generateMcpFAQs(mcp: { name: string; description: string }): FAQItem[] {
  return [
    {
      question: `What is the ${mcp.name} MCP server?`,
      answer: `The ${mcp.name} MCP server is a Model Context Protocol integration that ${mcp.description}. It extends Claude Code's capabilities by providing direct access to ${mcp.name} functionality.`,
    },
    {
      question: `How do I install the ${mcp.name} MCP server?`,
      answer: `To install the ${mcp.name} MCP server, follow the installation instructions in the server's documentation. Most MCP servers can be installed via npm or configured directly in your Claude Code settings.`,
    },
    {
      question: `What can I do with the ${mcp.name} MCP server?`,
      answer: `With the ${mcp.name} MCP server, Claude Code can ${mcp.description.toLowerCase()}. This enables more powerful automation and integration with your development workflow.`,
    },
  ];
}
