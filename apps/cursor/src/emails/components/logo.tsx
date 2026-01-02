import { Img, Section } from "@react-email/components";

export function Logo() {
  return (
    <Section className="mb-12 mt-8">
      <Img
        src="https://pub-abe1cd4008f5412abb77357f87d7d7bb.r2.dev/logo-square.png"
        alt="Cursor Directory"
        width={80}
        height={80}
      />
    </Section>
  );
}
