import { Column, Img, Link, Row, Section, Text } from "@react-email/components";

export function Footer() {
  return (
    <Section>
      <Img
        src="https://languine.ai/email/separator.png"
        alt="Separator"
        width="100%"
        className="mb-12"
      />

      <Text className="text-xs leading-6 mb-4 text-left font-mono">
        Cursor Directory - the home for everything Cursor
      </Text>

      <Row className="mt-8" align="left" width="auto">
        <Column className="align-middle pr-6">
          <Link
            href="https://twitter.com/cursordirectory"
            className="text-black no-underline text-xl"
          >
            <Img
              src="https://languine.ai/email/x.png"
              alt="X"
              width={22}
              height={22}
            />
          </Link>
        </Column>

        <Column className="align-middle">
          <Link
            href="https://github.com/pontusab/directories"
            className="text-black no-underline text-xl"
          >
            <Img
              src="https://languine.ai/email/github.png"
              alt="GitHub"
              width={22}
              height={22}
            />
          </Link>
        </Column>
      </Row>
      <Section className="mt-8 flex gap-3">
        <Text className="text-xs leading-6 mb-4 text-left font-mono text-[#B8B8B8]">
          © {new Date().getFullYear()} Cursor Directory. All rights reserved.
          This email was sent to you because you signed up for Cursor Directory.
        </Text>
      </Section>
    </Section>
  );
}
