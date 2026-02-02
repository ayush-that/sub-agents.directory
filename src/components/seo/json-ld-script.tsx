/**
 * JsonLdScript Component
 * Renders JSON-LD structured data scripts
 */

interface JsonLdScriptProps {
  data: Record<string, unknown>;
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

/**
 * Render multiple JSON-LD schemas
 */
export function JsonLdScripts({ schemas }: { schemas: Record<string, unknown>[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLdScript key={index} data={schema} />
      ))}
    </>
  );
}
