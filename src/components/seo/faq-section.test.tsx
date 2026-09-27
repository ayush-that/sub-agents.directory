import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import mcps from "@/data/mcp";
import { FAQSection, generateMcpFAQs } from "./faq-section";

describe("MCP FAQs", () => {
  test("renders source-install guidance in both the visible FAQ and JSON-LD", () => {
    const mcp = mcps.find((entry) => entry.name === "Hyperconsciousness")!;
    const faqs = generateMcpFAQs(mcp);
    const html = renderToStaticMarkup(<FAQSection faqs={faqs} />);
    const script = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)!;
    const schema = JSON.parse(script[1]);
    const visible = html.replace(script[0], "");
    const install = faqs.find((faq) => faq.question.startsWith("How do I install"))!;

    expect(install.answer).toContain("build hc from source with Rust");
    expect(install.answer).toContain("initialize a local store");
    expect(install.answer).toContain("create an access grant");
    expect(visible).toContain("build hc from source with Rust");
    expect(visible).not.toContain("Most MCP servers can be installed via npm");
    expect(
      schema.mainEntity.map(
        (item: { acceptedAnswer: { text: string } }) => item.acceptedAnswer.text,
      ),
    ).toEqual(faqs.map((faq) => faq.answer));
    expect(visible).toContain("Grants limit MCP responses");
    expect(visible).not.toContain("integration that Developer");
  });

  test("preserves generic FAQs for entries without custom answers", () => {
    const faqs = generateMcpFAQs({ name: "Example", description: "connect to a demo service" });
    expect(faqs).toHaveLength(3);
    expect(faqs[1].answer).toBe(
      "To install the Example MCP server, follow the installation instructions in the server's documentation. Most MCP servers can be installed via npm or configured directly in your Claude Code settings.",
    );
  });

  test("keeps alpha and setup caveats inside the social image's 120-character preview", () => {
    const preview = mcps
      .find((entry) => entry.name === "Hyperconsciousness")!
      .description.slice(0, 120);
    expect(preview).toContain("Developer alpha");
    expect(preview).toContain("Rust source build");
    expect(preview).toContain("local store setup");
  });
});
